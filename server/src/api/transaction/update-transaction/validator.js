const {
  UpdateTransactionRequest,
} = require('shared/proto/server/transaction/update_transaction').server.transaction;

const { ValidationError } = require('@src/shared/error');
const {
  validateOneOfFields,
  validateRequiredFields,
} = require('@src/shared/util');

/**
 * Validates UpdateTransactionRequest.
 *
 * @param {UpdateTransactionRequest} request - UpdateTransactionRequest proto.
 */
function validate(request) {
  if (!(request instanceof UpdateTransactionRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(request)} is not an instance of UpdateTransactionRequest`,
    );
  }
  validateRequiredFields(request, ['obfuscatedId']);
  validateOneOfFields(request, [
    'name',
    'category',
    'type',
    'amount',
    'date',
    'note',
    'recurring',
    'hidden',
  ]);
}

module.exports = validate;
