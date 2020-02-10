const {
  DeleteAccountBalanceHistoriesRequest,
} = require('shared/proto/server/account-balance-history/delete_account_balance_histories').server.account_balance_history;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates DeleteAccountBalanceHistoriesRequest.
 *
 * @param {DeleteAccountBalanceHistoriesRequest} request - DeleteAccountBalanceHistoriesRequest proto.
 */
function validate(request) {
  if (!(request instanceof DeleteAccountBalanceHistoriesRequest)) {
    throw new ValidationError(
      `Request ${request} is not an instance of DeleteAccountBalanceHistoriesRequest`,
    );
  }
  validateRequiredFields(request, ['ids']);
}

module.exports = validate;
