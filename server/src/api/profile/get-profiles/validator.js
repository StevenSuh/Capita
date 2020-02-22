const { GetProfilesRequest } = require('shared/proto').server.profile;

const { ValidationError } = require('@src/shared/error');

/**
 * Validates GetProfilesRequest.
 *
 * @param {GetProfilesRequest} request - GetProfilesRequest proto.
 */
function validate(request) {
  if (!(request instanceof GetProfilesRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of GetProfilesRequest`,
    );
  }
}

module.exports = validate;
