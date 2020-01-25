const {
  CreateProfileRequest,
} = require('shared/proto/server/profile/create_profile').server.profile;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates CreateProfileRequest.
 *
 * @param {CreateProfileRequest} request - CreateProfileRequest proto.
 */
function validate(request) {
  if (!(request instanceof CreateProfileRequest)) {
    throw new ValidationError(
      `Request ${request} is not an instance of CreateProfileRequest`,
    );
  }
  validateRequiredFields(request, ['name', 'accountIds']);
}

module.exports = validate;
