import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

const { DeletePlaidTransactionsRequest } = proto.server.transaction;

/**
 * Validates DeletePlaidTransactionsRequest.
 *
 * @param request - DeletePlaidTransactionsRequest proto.
 */
export default function validate(
  request: proto.server.transaction.IDeletePlaidTransactionsRequest,
) {
  if (!(request instanceof DeletePlaidTransactionsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of DeletePlaidTransactionsRequest`,
    );
  }
  validateRequiredFields(request, ['plaidTransactionIds']);
}
