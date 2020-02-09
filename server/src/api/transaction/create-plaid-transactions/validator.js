const {
  CreatePlaidTransactionsRequest,
} = require('shared/proto/server/transaction/create_plaid_transactions').server.transaction;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates CreatePlaidTransactionsRequest.
 *
 * @param {CreatePlaidTransactionsRequest} request - CreatePlaidTransactionsRequest proto.
 */
function validate(request) {
  if (!(request instanceof CreatePlaidTransactionsRequest)) {
    throw new ValidationError(
      `Request ${request} is not an instance of CreatePlaidTransactionsRequest`,
    );
  }
  validateRequiredFields(request, ['transactions']);
  request.transactions.forEach(transaction =>
    validateRequiredFields(transaction, [
      'userId',
      'plaidAccountId',
      'plaidTransactionId',
      'name',
      'category',
      'type',
      'amount',
      'isoCurrencyCode',
      'unofficialCurrencyCode',
      'date',
    ]),
  );
}

module.exports = validate;
