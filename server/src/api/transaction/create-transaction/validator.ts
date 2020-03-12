import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

const { CreateTransactionRequest } = proto.server.transaction;

/**
 * Validates CreateTransactionRequest.
 *
 * @param request - CreateTransactionRequest proto.
 */
export default function validate(
  request: proto.server.transaction.ICreateTransactionRequest,
) {
  if (!(request instanceof CreateTransactionRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of CreateTransactionRequest`,
    );
  }
  validateRequiredFields(request, [
    'accountId',
    'name',
    'category',
    'type',
    'amount',
    'date',
  ]);
}
