import moment from 'moment';
import connect from 'shared/db';
import proto from 'shared/proto';
import { In } from 'typeorm';

import { handleUpsertPlaidAccounts } from '@src/api/account/upsert-plaid-accounts';
import { handleDeleteTransactions } from '@src/api/transaction/delete-transactions';
import { handleUpsertPlaidTransactions } from '@src/api/transaction/upsert-plaid-transactions';

import { verifyAuth } from '@src/middleware';
import { getAccountBalances, getTransactions } from '@src/service/plaid';
import { DatabaseError } from '@src/shared/error';
import { CustomRequest } from '@src/types/request';
import { PlaidTransaction } from '@src/types/plaid';

import validate from './validator';
import { Account } from 'shared/db/entity/Account';
import { Application } from 'express';

const {
  SyncAccountsRequest,
  SyncAccountsResponse,
  UpsertPlaidAccountsRequest,
} = proto.server.account;
const {
  DeleteTransactionsRequest,
  UpsertPlaidTransactionsRequest,
} = proto.server.transaction;
const { ErrorType, ErrorTypeEnum } = proto.shared;

/**
 * Updates account balances by fetching them and calling UpsertPlaidAccounts.
 *
 * @param accounts - List of queried accounts from database.
 * @param session - session token proto.
 * @returns - List of accounts that failed to update.
 */
async function updateAccountBalances(
  accounts: Account[],
  session: proto.server.ISessionToken,
): Promise<Account[]> {
  const plaidAccountIds = accounts.map(({ plaidAccountId }) => plaidAccountId);
  const plaidAccounts = await getAccountBalances(
    plaidAccountIds,
  ).then(accountsByLinks =>
    accountsByLinks.reduce(
      (accumulator, current) => accumulator.concat(current.accounts),
      [],
    ),
  );

  const request = UpsertPlaidAccountsRequest.create({
    accounts: plaidAccounts.map(plaidAccount =>
      UpsertPlaidAccountsRequest.PlaidAccount.create({
        userId: session.userId,
        plaidAccountId: plaidAccount.id,
        balanceAvailable: plaidAccount.balance.available,
        balanceCurrent: plaidAccount.balance.current,
        balanceLimit: plaidAccount.balance.limit,
        balanceIsoCurrencyCode: plaidAccount.balance.isoCurrencyCode,
        balanceUnofficialCurrencyCode:
          plaidAccount.balance.unofficialCurrencyCode,
      }),
    ),
  });

  const response = await handleUpsertPlaidAccounts(request);

  const errors = response.results.filter(result => Boolean(result.errorType));
  if (errors.length) {
    return errors
      .map(error =>
        accounts.find(
          account => error.plaidAccountId === account.plaidAccountId,
        ),
      )
      .filter(Boolean);
  }
  return [];
}

/**
 * Delete stale transactions according to Plaid.
 *
 * @param accountIds - List of account database ids.
 * @param plaidTransactionIds - List of plaid transaction ids that should not be deleted.
 * @param session - session token proto.
 */
async function deleteTransactions(
  accountIds: number[],
  plaidTransactionIds: string[],
  session: proto.server.ISessionToken,
) {
  const { Transaction } = await connect();
  // NOT IN is not supported yet by typeorm.repository api.
  const deletingTransactions = await Transaction.createQueryBuilder()
    .where('userId = :userId', { userId: session.userId })
    .andWhere('accountId IN (:...accountIds)', { accountIds })
    .andWhere('plaidTransactionId NOT IN (:...plaidTransactionIds)', {
      plaidTransactionIds,
    })
    .getMany();

  const request = DeleteTransactionsRequest.create({
    ids: deletingTransactions.map(({ id }) => id),
  });
  const response = await handleDeleteTransactions(request, session);
  response.results.forEach(result => {
    if (result.errorType) {
      throw new DatabaseError(
        `Error while deleting transactions ${
          result.id
        } under request ${JSON.stringify(request)}`,
      );
    }
  });
}

/**
 * Upserts new/existing transactions from Plaid.
 *
 * @param plaidTransactions - List of Plaid transactions.
 * @param session - session token proto.
 */
async function upsertTransactions(
  plaidTransactions: PlaidTransaction[],
  session: proto.server.ISessionToken,
) {
  const request = UpsertPlaidTransactionsRequest.create({
    transactions: plaidTransactions.map(plaidTransaction =>
      UpsertPlaidTransactionsRequest.PlaidTransaction.create({
        userId: session.userId,
        plaidAccountId: plaidTransaction.accountId,
        plaidTransactionId: plaidTransaction.id,
        name: plaidTransaction.name,
        category: plaidTransaction.category[0],
        type: plaidTransaction.type,
        amount: plaidTransaction.amount,
        isoCurrencyCode: plaidTransaction.isoCurrencyCode,
        unofficialCurrencyCode: plaidTransaction.unofficialCurrencyCode,
        date: plaidTransaction.date,
        pending: plaidTransaction.pending,
        manuallyCreated: false,
      }),
    ),
  });

  const response = await handleUpsertPlaidTransactions(request);
  response.results.forEach(result => {
    if (result.errorType) {
      throw new DatabaseError(
        `Error while upserting plaid transactions ${
          result.plaidTransactionId
        } under request ${JSON.stringify(request)}`,
      );
    }
  });
}

/**
 * Upsert and delete transactions from given accounts.
 *
 * @param accounts - List of queried accounts.
 * @param sinceDate - Optional parameter to determine the start date of transactions to fetch.
 * @param session - session token proto.
 */
async function upsertAndDeleteTransactions(
  accounts: Account[],
  sinceDate: string,
  session: proto.server.ISessionToken,
) {
  const linkIds = Array.from(new Set(accounts.map(({ linkId }) => linkId)));
  const plaidAccountIds = accounts.map(({ plaidAccountId }) => plaidAccountId);
  const accountIds = accounts.map(({ id }) => id);

  const { Link } = await connect();
  const links = await Link.find({
    where: { id: In(linkIds), userId: session.userId },
  });

  const twoYearsAgo = moment()
    .subtract(2, 'year')
    .format('YYYY-MM-DD');
  const now = moment().format('YYYY-MM-DD');

  const startDate = sinceDate || twoYearsAgo;
  const getTransactionsResponses = await Promise.all(
    links.map(link =>
      getTransactions(link.plaidItemId, startDate, now, plaidAccountIds),
    ),
  );

  const plaidTransactions = getTransactionsResponses.reduce(
    (accumulator, { transactions }) => accumulator.concat(transactions),
    [],
  );
  const plaidTransactionIds = plaidTransactions.map(({ id }) => id);

  await Promise.all([
    upsertTransactions(plaidTransactions, session),
    deleteTransactions(accountIds, plaidTransactionIds, session),
  ]);
}

/**
 * SyncAccounts endpoint.
 * Sync accounts with plaid and transactions associated with them to our database.
 *
 * @param request - request proto.
 * @param session - session proto.
 * @returns - response proto.
 */
export async function handleSyncAccounts(
  request: proto.server.account.ISyncAccountsRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const resultErrors: proto.server.account.SyncAccountsResponse.IResult[] = [];

  const { Account } = await connect();
  // Retrieve accounts in request.
  let accounts = await Account.find({
    where: { id: In(request.accountIds), userId: session.userId },
  });

  // Update account balances.
  const accountsWithError = await updateAccountBalances(accounts, session);
  if (accountsWithError.length) {
    // Add error responses for failed account updates.
    accountsWithError.forEach(account =>
      resultErrors.push(
        SyncAccountsResponse.Result.create({
          accountId: account.id,
          errorType: ErrorType.create({
            type: ErrorTypeEnum.DATABASE,
          }),
        }),
      ),
    );

    // Skip accounts with errors when updating transactions.
    accounts = accounts.filter(account =>
      accountsWithError.find(({ id }) => account.id !== id),
    );
  }

  await upsertAndDeleteTransactions(accounts, request.sinceDate, session);

  const results = resultErrors.concat(
    accounts.map(account =>
      SyncAccountsResponse.Result.create({
        accountId: account.id,
        errorType: undefined,
      }),
    ),
  );
  return SyncAccountsResponse.create({ results });
}

/**
 * Registers and exposes SyncAccounts endpoint.
 *
 * @param app - given.
 */
export function registerSyncAccountsRoute(app: Application) {
  app.post(
    '/api/account/sync-accounts',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = SyncAccountsRequest.decode(req.raw);

      const response = await handleSyncAccounts(request, req.session);
      const responseBuffer = SyncAccountsResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}
