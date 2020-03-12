import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateOneOfFields, validateRequiredFields } from '@src/shared/util';

const { UpdateProfileRequest } = proto.server.profile;

/**
 * Validates UpdateProfileRequest.
 *
 * @param request - UpdateProfileRequest proto.
 */
export default function validate(
  request: proto.server.profile.IUpdateProfileRequest,
) {
  if (!(request instanceof UpdateProfileRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpdateProfileRequest`,
    );
  }
  validateRequiredFields(request, ['id']);
  validateOneOfFields(request, ['name', 'accountIds']);
}
