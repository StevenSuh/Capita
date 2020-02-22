const { CreateLinkRequest } = require('shared/proto').server.link;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates CreateLinkRequest.
 *
 * @param {CreateLinkRequest} request - CreateLinkRequest proto.
 */
function validate(request) {
  if (!(request instanceof CreateLinkRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of CreateLinkRequest`,
    );
  }
  validateRequiredFields(request, ['plaidPublicToken', 'plaidInstitutionId']);
}

module.exports = validate;
