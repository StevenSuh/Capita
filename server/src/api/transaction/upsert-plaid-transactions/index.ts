import connect from 'shared/db';
import { Transaction as TransactionEntity } from 'shared/db/entity/Transaction';
import proto from 'shared/proto';

import validate from './validator';

const { UpsertPlaidTransactionsResponse } = proto.server.transaction;
const { ErrorType, ErrorTypeEnum } = proto.shared;

/**
 * Converts PlaidTransaction protos to object for query.
 *
 * @param transactions - List of transaction protos.
 * @returns - Promise that resolves to list of transaction query objects.
 */
function convertPlaidTransactionsToObject(
  transactions: proto.server.transaction.UpsertPlaidTransactionsRequest.IPlaidTransaction[],
) {
  return Promise.all(
    transactions.map(async transaction => {
      const { Account } = await connect();
      const account = await Account.findOne({
        where: { plaidAccountId: transaction.plaidAccountId },
      });
      if (!account) {
        // Invalid plaid transaction.
        return null;
      }

      return {
        userId: transaction.userId,
        accountId: account.id,
        plaidTransactionId: transaction.plaidTransactionId,
        name: transaction.name,
        category: transaction.category,
        type: transaction.type,
        amount: transaction.amount,
        isoCurrencyCode: transaction.isoCurrencyCode,
        unofficialCurrencyCode: transaction.unofficialCurrencyCode,
        date: transaction.date,
        note: transaction.note,
        pending: transaction.pending,
        recurring: transaction.recurring,
        manuallyCreated: transaction.manuallyCreated,
        hidden: transaction.hidden,
      };
    }),
  );
}

/**
 * UpsertPlaidTransactions endpoint.
 * Upserts and returns a new transaction.
 *
 * @param request - request proto.
 * @returns - response proto.
 */
export async function handleUpsertPlaidTransactions(
  request: proto.server.transaction.IUpsertPlaidTransactionsRequest,
) {
  validate(request);

  const maybeNewTransactions = await convertPlaidTransactionsToObject(
    request.transactions,
  );
  const validNewTransactions = maybeNewTransactions.filter(transaction =>
    Boolean(transaction),
  );

  const { Transaction } = await connect();

  const upsertResult = await Transaction.createQueryBuilder()
    .insert()
    .values(validNewTransactions)
    .returning('*')
    .execute();
  const successfulTransactions = upsertResult.generatedMaps as TransactionEntity[];

  const results = maybeNewTransactions.map(({ plaidTransactionId }) => {
    const isSuccessfulTransaction = plaidTransactionId
      ? successfulTransactions.findIndex(
          transaction => plaidTransactionId === transaction.plaidTransactionId,
        ) !== -1
      : null;

    return UpsertPlaidTransactionsResponse.Result.create({
      plaidTransactionId,
      errorType: isSuccessfulTransaction
        ? undefined
        : ErrorType.create({
            type: ErrorTypeEnum.DATABASE,
          }),
    });
  });

  return UpsertPlaidTransactionsResponse.create({ results });
}
