const {
  CreatePlaidTransactionsRequest,
  CreatePlaidTransactionsResponse,
} = require('shared/proto/server/transaction/create_plaid_transactions').server.transaction;
const {
  ErrorType,
  ErrorTypeEnum,
} = require('shared/proto/shared/error_type').shared;

const { Account, Transaction } = require('@src/db/models');

const validate = require('./validator');

/**
 * Converts PlaidTransaction protos to object for query.
 *
 * @param {CreatePlaidTransactionsRequest.PlaidTransaction[]} transactions - List of transaction protos.
 * @returns {Promise<object[]>} - Promise that resolves to list of transaction query objects.
 */
function convertPlaidTransactionsToObject(transactions) {
  return Promise.all(
    transactions.map(async transaction => {
      const account = await Account.findOne({
        where: { plaidAccountId: transaction.plaidAccountId },
      });
      if (!account) {
        // TODO: Call create_plaid_accounts since it's missing
        return {};
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
 * CreatePlaidTransactions endpoint.
 * Creates and returns a new transaction.
 *
 * @param {CreatePlaidTransactionsRequest} request - request proto.
 * @returns {CreatePlaidTransactionsResponse} - response proto.
 */
async function handleCreatePlaidTransactions(request) {
  validate(request);

  const newTransactions = await convertPlaidTransactionsToObject(
    request.transactions,
  );
  const successfulTransactions = await Transaction.bulkCreate(newTransactions, {
    returning: true,
  });

  const results = newTransactions.map(({ plaidTransactionId }) => {
    const successfulTransaction = successfulTransactions.find(
      transaction => plaidTransactionId === transaction.plaidTransactionId,
    );

    return CreatePlaidTransactionsResponse.Result.create({
      plaidTransactionId,
      errorType: successfulTransaction
        ? undefined
        : ErrorType.create({
            type: ErrorTypeEnum.DATABASE,
          }),
    });
  });

  return CreatePlaidTransactionsResponse.create({ results });
}

module.exports = {
  handleCreatePlaidTransactions,
};
