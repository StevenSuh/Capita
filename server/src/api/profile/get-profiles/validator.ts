import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';

const { GetProfilesRequest } = proto.server.profile;

/**
 * Validates GetProfilesRequest.
 *
 * @param request - GetProfilesRequest proto.
 */
export default function validate(
  request: proto.server.profile.IGetProfilesRequest,
) {
  if (!(request instanceof GetProfilesRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of GetProfilesRequest`,
    );
  }
}
