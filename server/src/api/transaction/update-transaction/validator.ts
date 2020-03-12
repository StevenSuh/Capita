import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateOneOfFields, validateRequiredFields } from '@src/shared/util';

const { UpdateTransactionRequest } = proto.server.transaction;

/**
 * Validates UpdateTransactionRequest.
 *
 * @param request - UpdateTransactionRequest proto.
 */
export default function validate(
  request: proto.server.transaction.IUpdateTransactionRequest,
) {
  if (!(request instanceof UpdateTransactionRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpdateTransactionRequest`,
    );
  }
  validateRequiredFields(request, ['id']);
  validateOneOfFields(request, [
    'name',
    'category',
    'type',
    'amount',
    'date',
    'note',
    'recurring',
    'hidden',
  ]);
}
