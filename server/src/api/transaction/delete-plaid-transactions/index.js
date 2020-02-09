const {
  DeletePlaidTransactionsRequest,
  DeletePlaidTransactionsResponse,
} = require('shared/proto/server/transaction/delete_plaid_transactions').server.transaction;
const {
  ErrorType,
  ErrorTypeEnum,
} = require('shared/proto/shared/error_type').shared;

const { sequelize, Transaction } = require('@src/db/models');

const validate = require('./validator');

/**
 * DeletePlaidTransactions endpoint.
 * Deletes transactions and returns individual results.
 *
 * @param {DeletePlaidTransactionsRequest} request - request proto.
 * @returns {DeletePlaidTransactionsResponse} - response proto.
 */
async function handleDeletePlaidTransactions(request) {
  validate(request);

  const deletingIds = request.plaidTransactionIds;
  const query = `DELETE FROM "${Transaction.getTableName()}" WHERE plaid_transaction_id IN (${deletingIds.join(
    ', ',
  )}) RETURNING plaid_transaction_id`;
  const [deletedIds] = await sequelize.query(query);

  // TODO: Update account_balance_history accordingly.

  const results = deletingIds.map(id =>
    DeletePlaidTransactionsResponse.Result.create({
      plaidTransactionId: id,
      errorType: deletedIds.includes(id)
        ? undefined // success
        : ErrorType.create({
            type: ErrorTypeEnum.DATABASE,
          }),
    }),
  );

  return DeletePlaidTransactionsResponse.create({ results });
}

module.exports = {
  handleDeletePlaidTransactions,
};
