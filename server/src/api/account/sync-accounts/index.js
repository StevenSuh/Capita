const moment = require('moment');
const { Op } = require('sequelize');

const {
  SyncAccountsRequest,
  SyncAccountsResponse,
  UpsertPlaidAccountsRequest,
} = require('shared/proto').server.account;
const {
  DeleteTransactionsRequest,
  UpsertPlaidTransactionsRequest,
} = require('shared/proto').server.transaction;
const { SessionToken } = require('shared/proto').server;
const { ErrorType, ErrorTypeEnum } = require('shared/proto').shared;

const {
  handleUpsertPlaidAccounts,
} = require('@src/api/account/upsert-plaid-accounts');
const {
  handleDeleteTransactions,
} = require('@src/api/transaction/delete-transactions');
const {
  handleUpsertPlaidTransactions,
} = require('@src/api/transaction/upsert-plaid-transactions');

const { Account, Link, Transaction } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const { getAccountBalances, getTransactions } = require('@src/service/plaid');
const { DatabaseError } = require('@src/shared/error');

const validate = require('./validator');

/**
 * Updates account balances by fetching them and calling UpsertPlaidAccounts.
 *
 * @param {object[]} accounts - List of queried accounts from database.
 * @param {SessionToken} session - session token proto.
 * @returns {object[]} - List of accounts that failed to update.
 */
async function updateAccountBalances(accounts, session) {
  const plaidAccountIds = accounts.map(({ plaidAccountId }) => plaidAccountId);
  const plaidAccounts = await getAccountBalances(plaidAccountIds);

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
      .filter(account => Boolean(account));
  }
  return [];
}

/**
 * Delete stale transactions according to Plaid.
 *
 * @param {number[]} accountIds - List of account database ids.
 * @param {string[]} plaidTransactionIds - List of plaid transaction ids.
 * @param {SessionToken} session - session token proto.
 */
async function deleteTransactions(accountIds, plaidTransactionIds, session) {
  const deletingTransactions = await Transaction.findAll({
    where: {
      userId: session.userId,
      accountId: accountIds,
      plaidTransactionId: {
        [Op.notIn]: plaidTransactionIds,
      },
    },
  });

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
 * @param {object[]} plaidTransactions - List of Plaid transactions.
 * @param {SessionToken} session - session token proto.
 */
async function upsertTransactions(plaidTransactions, session) {
  const request = UpsertPlaidTransactionsRequest.create({
    transactions: plaidTransactions.map(plaidTransaction =>
      UpsertPlaidTransactionsRequest.PlaidTransaction.create({
        userId: session.userId,
        plaidAccountId: plaidTransaction.accountId,
        plaidTransactionId: plaidTransaction.id,
        name: plaidTransaction.name,
        category: plaidTransaction.category,
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
 * @param {object[]} accounts - List of queried accounts.
 * @param {string} sinceDate - Optional parameter to determine the start date of transactions to fetch.
 * @param {SessionToken} session - session token proto.
 */
async function upsertAndDeleteTransactions(accounts, sinceDate, session) {
  const linkIds = Array.from(new Set(accounts.map(({ linkId }) => linkId)));
  const plaidAccountIds = accounts.map(({ plaidAccountId }) => plaidAccountId);
  const accountIds = accounts.map(({ id }) => id);

  const links = await Link.findAll({
    where: { id: linkIds, userId: session.userId },
  });

  const twoYearsAgo = moment()
    .subtract(2, 'year')
    .format('YYYY-MM-DD');
  const now = moment().format('YYYY-MM-DD');

  const startDate = sinceDate || twoYearsAgo;
  const getTransactionsResponses = await Promise.all(
    links.map(link =>
      getTransactions(link.itemId, startDate, now, plaidAccountIds),
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
 * @param {SyncAccountsRequest} request - request proto.
 * @param {SessionToken} session - session proto.
 * @returns {SyncAccountsResponse} - response proto.
 */
async function handleSyncAccounts(request, session) {
  validate(request);

  const resultErrors = [];

  // Retrieve accounts in request.
  let accounts = await Account.findAll({
    where: { id: request.accountIds, userId: session.userId },
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
 * @param {object} app - given.
 */
function registerSyncAccountsRoute(app) {
  app.post('/api/account/sync-accounts', verifyAuth, async (req, res) => {
    const request = SyncAccountsRequest.decode(req.raw);

    const response = await handleSyncAccounts(request, req.session);
    const responseBuffer = SyncAccountsResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleSyncAccounts,
  registerSyncAccountsRoute,
};
