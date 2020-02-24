const { SyncAccountsRequest } = require('shared/proto').server.account;

const { ValidationError } = require('@src/shared/error');

/**
 * Validates SyncAccountsRequest.
 *
 * @param {SyncAccountsRequest} request - SyncAccountsRequest proto.
 */
function validate(request) {
  if (!(request instanceof SyncAccountsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of SyncAccountsRequest`,
    );
  }
}

module.exports = validate;
