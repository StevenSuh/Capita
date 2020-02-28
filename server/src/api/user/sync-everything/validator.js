const { SyncEverythingRequest } = require('shared/proto').server.user;

const { ValidationError } = require('@src/shared/error');

/**
 * Validates SyncEverythingRequest.
 *
 * @param {SyncEverythingRequest} request - SyncEverythingRequest proto.
 */
function validate(request) {
  if (!(request instanceof SyncEverythingRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of SyncEverythingRequest`,
    );
  }
}

module.exports = validate;
