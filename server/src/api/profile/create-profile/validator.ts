import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

const { CreateProfileRequest } = proto.server.profile;

/**
 * Validates CreateProfileRequest.
 *
 * @param request - CreateProfileRequest proto.
 */
export default function validate(
  request: proto.server.profile.ICreateProfileRequest,
) {
  if (!(request instanceof CreateProfileRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of CreateProfileRequest`,
    );
  }
  validateRequiredFields(request, ['name', 'accountIds']);
}
