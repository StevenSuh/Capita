const {
  UpsertPlaidTransactionsRequest,
} = require('shared/proto/server/transaction/upsert_plaid_transactions').server.transaction;

const { ValidationError } = require('@src/shared/error');
const { validateRequiredFields } = require('@src/shared/util');

/**
 * Validates UpsertPlaidTransactionsRequest.
 *
 * @param {UpsertPlaidTransactionsRequest} request - UpsertPlaidTransactionsRequest proto.
 */
function validate(request) {
  if (!(request instanceof UpsertPlaidTransactionsRequest)) {
    throw new ValidationError(
      `Request ${request} is not an instance of UpsertPlaidTransactionsRequest`,
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
