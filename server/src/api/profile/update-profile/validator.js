const {
  UpdateProfileRequest,
} = require('shared/proto/server/profile/update_profile').server.user;

const { ValidationError } = require('@src/shared/error');
const {
  validateOneOfFields,
  validateRequiredFields,
} = require('@src/shared/util');

/**
 * Validates UpdateProfileRequest.
 *
 * @param {UpdateProfileRequest} request - UpdateProfileRequest proto.
 */
function validate(request) {
  if (!(request instanceof UpdateProfileRequest)) {
    throw new ValidationError(
      `Request ${request} is not an instance of UpdateProfileRequest`,
    );
  }
  validateRequiredFields(request, ['obfuscatedId']);
  validateOneOfFields(request, ['name', 'accountIds']);
}

module.exports = validate;