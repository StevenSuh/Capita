const {
  UpsertAccountBalanceHistoriesRequest,
  UpsertAccountBalanceHistoriesResponse,
} = require('shared/proto').server.transaction;
const { ErrorType, ErrorTypeEnum } = require('shared/proto').shared;

const { AccountBalanceHistory } = require('@src/db/models');

const validate = require('./validator');

/**
 * Converts UpsertingItem proto to object.
 *
 * @param {UpsertAccountBalanceHistoriesRequest.UpsertingItem} item - item proto.
 * @returns {object} - object of UpsertingItem.
 */
function convertAccountBalanceHistoryToObject(item) {
  const updatingItem = {};

  if (item.id) {
    updatingItem.id = item.id;
  }
  if (item.accountId) {
    updatingItem.accountId = item.accountId;
  }
  if (item.deltaAmount) {
    updatingItem.deltaAmount = item.deltaAmount;
  }
  if (item.date) {
    updatingItem.date = item.date;
  }

  return updatingItem;
}

/**
 * UpsertAccountBalanceHistories endpoint.
 * Upserts and returns a new transaction.
 *
 * @param {UpsertAccountBalanceHistoriesRequest} request - request proto.
 * @returns {UpsertAccountBalanceHistoriesResponse} - response proto.
 */
async function handleUpsertAccountBalanceHistories(request) {
  validate(request);

  const requestItems = request.items.map(convertAccountBalanceHistoryToObject);
  const successfulItems = await AccountBalanceHistory.bulkCreate(requestItems, {
    returning: true,
    updateOnDuplicate: true,
  });

  // TODO: Delete histories older than one year.

  const results = requestItems.map(({ id }) => {
    const isSuccess = Boolean(successfulItems.find(item => item.id === id));

    return UpsertAccountBalanceHistoriesResponse.Result.create({
      id,
      errorType: isSuccess
        ? undefined
        : ErrorType.create({
            type: ErrorTypeEnum.DATABASE,
          }),
    });
  });

  return UpsertAccountBalanceHistoriesResponse.create({ results });
}

module.exports = {
  handleUpsertAccountBalanceHistories,
};
