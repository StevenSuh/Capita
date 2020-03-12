import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';

const { GetAccountsRequest } = proto.server.account;

/**
 * Validates GetAccountsRequest.
 *
 * @param request - GetAccountsRequest proto.
 */
export default function validate(
  request: proto.server.account.IGetAccountsRequest,
) {
  if (!(request instanceof GetAccountsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of GetAccountsRequest`,
    );
  }
}
