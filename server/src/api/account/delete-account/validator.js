const {
  DeleteAccountRequest,
} = require('shared/proto/server/account/delete_account').server.account;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates DeleteAccountRequest.
 *
 * @param {DeleteAccountRequest} request - DeleteAccountRequest proto.
 */
function validate(request) {
  if (!(request instanceof DeleteAccountRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(request)} is not an instance of DeleteAccountRequest`,
    );
  }
  validateRequiredFields(request, ['obfuscatedId']);
}

module.exports = validate;
