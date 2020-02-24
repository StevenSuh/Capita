const { UpdateAccountRequest } = require('shared/proto').server.account;

const { ValidationError } = require('@src/shared/error');
const {
  validateOneOfFields,
  validateRequiredFields,
} = require('@src/shared/util');

/**
 * Validates UpdateAccountRequest.
 *
 * @param {UpdateAccountRequest} request - UpdateAccountRequest proto.
 */
function validate(request) {
  if (!(request instanceof UpdateAccountRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpdateAccountRequest`,
    );
  }
  validateRequiredFields(request, ['id']);
  validateOneOfFields(request, ['mask', 'name', 'subtype', 'type', 'hidden']);
}

module.exports = validate;
