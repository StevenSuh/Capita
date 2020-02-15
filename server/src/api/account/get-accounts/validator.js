const {
  GetAccountsRequest,
} = require('shared/proto/server/account/get_accounts').server.account;

const { ValidationError } = require('@src/shared/error');

/**
 * Validates GetAccountsRequest.
 *
 * @param {GetAccountsRequest} request - GetAccountsRequest proto.
 */
function validate(request) {
  if (!(request instanceof GetAccountsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(request)} is not an instance of GetAccountsRequest`,
    );
  }
}

module.exports = validate;
