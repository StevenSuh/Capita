import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateOneOfFields, validateRequiredFields } from '@src/shared/util';

const { UpdateAccountRequest } = proto.server.account;

/**
 * Validates UpdateAccountRequest.
 *
 * @param {UpdateAccountRequest} request - UpdateAccountRequest proto.
 */
export default function validate(
  request: proto.server.account.IUpdateAccountRequest,
) {
  if (!(request instanceof UpdateAccountRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpdateAccountRequest`,
    );
  }
  validateRequiredFields(request, ['id']);
  validateOneOfFields(request, ['mask', 'name', 'subtype', 'type', 'hidden']);
}
