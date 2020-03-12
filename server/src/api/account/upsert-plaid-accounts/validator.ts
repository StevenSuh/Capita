import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

const { UpsertPlaidAccountsRequest } = proto.server.account;

/**
 * Validates UpsertPlaidAccountsRequest.
 *
 * @param request - UpsertPlaidAccountsRequest proto.
 */
export default function validate(
  request: proto.server.account.IUpsertPlaidAccountsRequest,
) {
  if (!(request instanceof UpsertPlaidAccountsRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpsertPlaidAccountsRequest`,
    );
  }
  validateRequiredFields(request, ['accounts']);
  request.accounts.forEach(account =>
    validateRequiredFields(account, ['userId', 'plaidAccountId']),
  );
}
