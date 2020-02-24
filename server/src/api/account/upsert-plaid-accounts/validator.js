const { UpsertPlaidAccountsRequest } = require('shared/proto').server.account;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates UpsertPlaidAccountsRequest.
 *
 * @param {UpsertPlaidAccountsRequest} request - UpsertPlaidAccountsRequest proto.
 */
function validate(request) {
  if (!(request instanceof UpsertPlaidAccountsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpsertPlaidAccountsRequest`,
    );
  }
  validateRequiredFields(request, ['accounts']);
  request.accounts.forEach(account =>
    validateRequiredFields(account, ['userId', 'plaidAccountId']),
  );
}

module.exports = validate;
