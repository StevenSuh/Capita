import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';

const { SyncAccountsRequest } = proto.server.account;

/**
 * Validates SyncAccountsRequest.
 *
 * @param request - SyncAccountsRequest proto.
 */
export default function validate(
  request: proto.server.account.ISyncAccountsRequest,
) {
  if (!(request instanceof SyncAccountsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of SyncAccountsRequest`,
    );
  }
}
