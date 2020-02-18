const {
  DeletePlaidTransactionsRequest,
} = require('shared/proto/server/transaction/delete_plaid_transactions').server.transaction;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates DeletePlaidTransactionsRequest.
 *
 * @param {DeletePlaidTransactionsRequest} request - DeletePlaidTransactionsRequest proto.
 */
function validate(request) {
  if (!(request instanceof DeletePlaidTransactionsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of DeletePlaidTransactionsRequest`,
    );
  }
  validateRequiredFields(request, ['plaidTransactionIds']);
}

module.exports = validate;
