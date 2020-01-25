const {
  GetTransactionsRequest,
} = require('shared/proto/server/transaction/get_transactions').server.transaction;

const { ValidationError } = require('@src/shared/error');

/**
 * Validates GetTransactionsRequest.
 *
 * @param {GetTransactionsRequest} request - GetTransactionsRequest proto.
 */
function validate(request) {
  if (!(request instanceof GetTransactionsRequest)) {
    throw new ValidationError(
      `Request ${request} is not an instance of GetTransactionsRequest`,
    );
  }
}

module.exports = validate;
