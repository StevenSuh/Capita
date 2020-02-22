const {
  DeleteAccountBalanceHistoriesRequest,
  DeleteAccountBalanceHistoriesResponse,
} = require('shared/proto').server.account_balance_history;
const { ErrorType, ErrorTypeEnum } = require('shared/proto').shared;

const { sequelize, AccountBalanceHistory } = require('@src/db/models');

const validate = require('./validator');

/**
 * DeleteAccountBalanceHistories endpoint.
 * Deletes account balance histories and returns individual results.
 *
 * @param {DeleteAccountBalanceHistoriesRequest} request - request proto.
 * @returns {DeleteAccountBalanceHistoriesResponse} - response proto.
 */
async function handleDeleteAccountBalanceHistories(request) {
  validate(request);

  const deletingIds = request.ids;
  const query = `DELETE FROM "${AccountBalanceHistory.getTableName()}" WHERE id IN (${deletingIds.join(
    ', ',
  )}) RETURNING id`;
  const [deletedIds] = await sequelize.query(query);

  const results = deletingIds.map(id =>
    DeleteAccountBalanceHistoriesResponse.Result.create({
      id,
      errorType: deletedIds.includes(id)
        ? undefined // success
        : ErrorType.create({
            type: ErrorTypeEnum.DATABASE,
          }),
    }),
  );

  return DeleteAccountBalanceHistoriesResponse.create({ results });
}

module.exports = {
  handleDeleteAccountBalanceHistories,
};
