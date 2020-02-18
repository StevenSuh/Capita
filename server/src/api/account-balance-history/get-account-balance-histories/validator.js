const {
  GetAccountBalanceHistoriesRequest,
} = require('shared/proto/server/account-balance-history/get_account_balance_histories').server.account_balance_history;

const { ValidationError } = require('@src/shared/error');

/**
 * Validates GetAccountBalanceHistoriesRequest.
 *
 * @param {GetAccountBalanceHistoriesRequest} request - GetAccountBalanceHistoriesRequest proto.
 */
function validate(request) {
  if (!(request instanceof GetAccountBalanceHistoriesRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of GetAccountBalanceHistoriesRequest`,
    );
  }
}

module.exports = validate;
