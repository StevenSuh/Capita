import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';

const { SyncEverythingRequest } = proto.server.user;

/**
 * Validates SyncEverythingRequest.
 *
 * @param request - SyncEverythingRequest proto.
 */
export default function validate(
  request: proto.server.user.ISyncEverythingRequest,
) {
  if (!(request instanceof SyncEverythingRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of SyncEverythingRequest`,
    );
  }
}
