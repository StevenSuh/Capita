import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

const { UpsertPlaidTransactionsRequest } = proto.server.transaction;

/**
 * Validates UpsertPlaidTransactionsRequest.
 *
 * @param request - UpsertPlaidTransactionsRequest proto.
 */
export default function validate(
  request: proto.server.transaction.IUpsertPlaidTransactionsRequest,
) {
  if (!(request instanceof UpsertPlaidTransactionsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpsertPlaidTransactionsRequest`,
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
