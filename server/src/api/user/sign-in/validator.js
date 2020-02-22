const { SignInRequest } = require('shared/proto').server.user;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

const { validateEmail, validatePassword } = require('../util');

/**
 * Validates SignInRequest.
 *
 * @param {SignInRequest} request - SignInRequest proto.
 */
function validate(request) {
  if (!(request instanceof SignInRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(request)} is not an instance of SignInRequest`,
    );
  }
  validateRequiredFields(request, ['email', 'password']);
  validateEmail(request.email);
  validatePassword(request.password);
}

module.exports = validate;
