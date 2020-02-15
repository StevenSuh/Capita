const {
  DeleteTransactionsRequest,
} = require('shared/proto/server/transaction/delete_transactions').server.transaction;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates DeleteTransactionsRequest.
 *
 * @param {DeleteTransactionsRequest} request - DeleteTransactionsRequest proto.
 */
function validate(request) {
  if (!(request instanceof DeleteTransactionsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(request)} is not an instance of DeleteTransactionsRequest`,
    );
  }
  validateRequiredFields(request, ['obfuscatedIds']);
}

module.exports = validate;
