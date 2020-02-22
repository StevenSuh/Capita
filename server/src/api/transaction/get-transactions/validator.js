const { GetTransactionsRequest } = require('shared/proto').server.transaction;

const { ValidationError } = require('@src/shared/error');

/**
 * Validates GetTransactionsRequest.
 *
 * @param {GetTransactionsRequest} request - GetTransactionsRequest proto.
 */
function validate(request) {
  if (!(request instanceof GetTransactionsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of GetTransactionsRequest`,
    );
  }
}

module.exports = validate;
