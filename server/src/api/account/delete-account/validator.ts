import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

const { DeleteAccountRequest } = proto.server.account;

/**
 * Validates DeleteAccountRequest.
 *
 * @param request - DeleteAccountRequest proto.
 */
export default function validate(
  request: proto.server.account.IDeleteAccountRequest,
) {
  if (!(request instanceof DeleteAccountRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of DeleteAccountRequest`,
    );
  }
  validateRequiredFields(request, ['id']);
}
