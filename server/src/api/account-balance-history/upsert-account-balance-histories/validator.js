const {
  UpsertAccountBalanceHistoriesRequest,
} = require('shared/proto').server.account_balance_history;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates UpsertAccountBalanceHistoriesRequest.
 *
 * @param {UpsertAccountBalanceHistoriesRequest} request - UpsertAccountBalanceHistoriesRequest proto.
 */
function validate(request) {
  if (!(request instanceof UpsertAccountBalanceHistoriesRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpsertAccountBalanceHistoriesRequest`,
    );
  }
  validateRequiredFields(request, ['items']);
}

module.exports = validate;
