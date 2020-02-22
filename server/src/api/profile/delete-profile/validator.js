const { DeleteProfileRequest } = require('shared/proto').server.profile;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates DeleteProfileRequest.
 *
 * @param {DeleteProfileRequest} request - DeleteProfileRequest proto.
 */
function validate(request) {
  if (!(request instanceof DeleteProfileRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of DeleteProfileRequest`,
    );
  }
  validateRequiredFields(request, ['id']);
}

module.exports = validate;
