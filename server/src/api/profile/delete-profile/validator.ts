import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

const { DeleteProfileRequest } = proto.server.profile;

/**
 * Validates DeleteProfileRequest.
 *
 * @param request - DeleteProfileRequest proto.
 */
export default function validate(
  request: proto.server.profile.IDeleteProfileRequest,
) {
  if (!(request instanceof DeleteProfileRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of DeleteProfileRequest`,
    );
  }
  validateRequiredFields(request, ['id']);
}
