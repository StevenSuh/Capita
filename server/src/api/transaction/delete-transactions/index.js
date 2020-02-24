const {
  DeleteTransactionsRequest,
  DeleteTransactionsResponse,
} = require('shared/proto').server.transaction;
const { SessionToken } = require('shared/proto').server;
const { ErrorType, ErrorTypeEnum } = require('shared/proto').shared;

const { sequelize, Transaction } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');

const validate = require('./validator');

/**
 * DeleteTransactions endpoint.
 * Deletes transactions and returns individual results.
 *
 * @param {DeleteTransactionsRequest} request - request proto.
 * @param {SessionToken} session - session token proto.
 * @returns {DeleteTransactionsResponse} - response proto.
 */
async function handleDeleteTransactions(request, session) {
  validate(request);

  const deletingIds = request.ids;
  const query = `DELETE FROM "${Transaction.getTableName()}" WHERE id IN (${deletingIds.join(
    ', ',
  )}) AND userId = ${session.userId} RETURNING *`;
  const [deletedTransactions] = await sequelize.query(query);

  const results = deletingIds.map(id =>
    DeleteTransactionsResponse.Result.create({
      id,
      errorType: deletedTransactions.find(transaction => transaction.id === id)
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

      const response = await handleDeleteTransactions(request, req.session);
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
