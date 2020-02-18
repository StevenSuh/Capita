const {
  CreateTransactionRequest,
} = require('shared/proto/server/transaction/create_transaction').server.transaction;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates CreateTransactionRequest.
 *
 * @param {CreateTransactionRequest} request - CreateTransactionRequest proto.
 */
function validate(request) {
  if (!(request instanceof CreateTransactionRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of CreateTransactionRequest`,
    );
  }
  validateRequiredFields(request, [
    'obfuscatedAccountId',
    'name',
    'category',
    'type',
    'amount',
    'date',
  ]);
}

module.exports = validate;
