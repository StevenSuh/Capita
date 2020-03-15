import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateOneOfFields } from '@src/shared/util';

const { GetUserIdRequest } = proto.server.user;

/**
 * Validates GetUserIdRequest.
 *
 * @param request - GetUserIdRequest proto.
 */
export default function validate(request: proto.server.user.IGetUserIdRequest) {
  if (!(request instanceof GetUserIdRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of GetUserIdRequest`,
    );
  }
  validateOneOfFields(request, [
    'linkId',
    'accountId',
    'transactionId',
    'plaidItemId',
    'plaidAccountId',
    'plaidTransactionId',
    'email',
  ]);
}
