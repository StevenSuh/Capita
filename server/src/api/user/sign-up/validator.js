const { SignUpRequest } = require('shared/proto').server.user;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

const { validateEmail, validatePassword } = require('../util');

/**
 * Validates SignUpRequest.
 *
 * @param {SignUpRequest} request - SignUpRequest proto.
 */
function validate(request) {
  if (!(request instanceof SignUpRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(request)} is not an instance of SignUpRequest`,
    );
  }

  validateRequiredFields(request, ['email', 'password', 'name']);
  validateEmail(request.email);
  validatePassword(request.password);
}

module.exports = validate;
