import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

const { CreateAccountRequest } = proto.server.account;

/**
 * Validates CreateAccountRequest.
 *
 * @param request - CreateAccountRequest proto.
 */
export default function validate(
  request: proto.server.account.ICreateAccountRequest,
) {
  if (!(request instanceof CreateAccountRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of CreateAccountRequest`,
    );
  }
  validateRequiredFields(request, ['name', 'type', 'subtype', 'balance']);
}
