const { DeleteLinkRequest } = require('shared/proto').server.link;

const { ValidationError } = require('@src/shared/error');
const { validateOneOfFields } = require('@src/shared/util');

/**
 * Validates DeleteLinkRequest.
 *
 * @param {DeleteLinkRequest} request - DeleteLinkRequest proto.
 */
function validate(request) {
  if (!(request instanceof DeleteLinkRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of DeleteLinkRequest`,
    );
  }
  validateOneOfFields(request, ['plaidItemId', 'linkId']);
}

module.exports = validate;
