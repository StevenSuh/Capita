const { UpdateProfileRequest } = require('shared/proto').server.profile;

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
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpdateProfileRequest`,
    );
  }
  validateRequiredFields(request, ['id']);
  validateOneOfFields(request, ['name', 'accountIds']);
}

module.exports = validate;
