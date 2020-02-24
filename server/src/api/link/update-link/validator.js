const { UpdateLinkRequest } = require('shared/proto').server.link;

const { ValidationError } = require('@src/shared/error');
const { validateOneOfFields } = require('@src/shared/util');

/**
 * Validates UpdateLinkRequest.
 *
 * @param {UpdateLinkRequest} request - UpdateLinkRequest proto.
 */
function validate(request) {
  if (!(request instanceof UpdateLinkRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpdateLinkRequest`,
    );
  }
  validateOneOfFields(request, ['plaidItemId', 'linkId', 'accountId']);
}

module.exports = validate;
