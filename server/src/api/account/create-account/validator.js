const {
  CreateAccountRequest,
} = require('shared/proto/server/account/create_account').server.account;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates CreateAccountRequest.
 *
 * @param {CreateAccountRequest} request - CreateAccountRequest proto.
 */
function validate(request) {
  if (!(request instanceof CreateAccountRequest)) {
    throw new ValidationError(
      `Request ${request} is not an instance of CreateAccountRequest`,
    );
  }
  validateRequiredFields(request, ['name', 'type', 'subtype', 'balance']);
}

module.exports = validate;