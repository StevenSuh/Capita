const {
  DeleteTransactionsRequest,
  DeleteTransactionsResponse,
} = require('shared/proto/server/transaction/delete_transactions').server.transaction;
const {
  ErrorType,
  ErrorTypeEnum,
} = require('shared/proto/shared/error_type').shared;

const { sequelize, Transaction } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const { obfuscateId, unobfuscateId } = require('@src/shared/util');

const validate = require('./validator');

/**
 * DeleteTransactions endpoint.
 * Deletes transactions and returns individual results.
 *
 * @param {DeleteTransactionsRequest} request - request proto.
 * @returns {DeleteTransactionsResponse} - response proto.
 */
async function handleDeleteTransactions(request) {
  validate(request);

  const deletingIds = request.obfuscatedIds.map(unobfuscateId);
  const query = `DELETE FROM "${Transaction.getTableName()}" WHERE id IN (${deletingIds.join(
    ', ',
  )}) RETURNING id`;
  const [deletedIds] = await sequelize.query(query);

  // TODO: Update account_balance_history accordingly.

  const results = deletingIds.map(id =>
    DeleteTransactionsResponse.Result.create({
      obfuscatedId: obfuscateId(id),
      errorType: deletedIds.includes(id)
        ? undefined // success
        : ErrorType.create({
            type: ErrorTypeEnum.DATABASE,
          }),
    }),
  );

  return DeleteTransactionsResponse.create({ results });
}

/**
 * Registers and exposes DeleteTransactions endpoint.
 *
 * @param {object} app - given.
 */
function registerDeleteTransactionsRoute(app) {
  app.post(
    '/api/transaction/delete-transactions',
    verifyAuth,
    async (req, res) => {
      const request = DeleteTransactionsRequest.decode(req.raw);

      const response = await handleDeleteTransactions(request);
      const responseBuffer = DeleteTransactionsResponse.encode(
        response,
      ).finish();

      return res.send(responseBuffer);
    },
  );
}

module.exports = {
  handleDeleteTransactions,
  registerDeleteTransactionsRoute,
};
