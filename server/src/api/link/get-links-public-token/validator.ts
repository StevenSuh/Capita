import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateOneOfFields } from '@src/shared/util';

const { GetLinksPublicTokenRequest } = proto.server.link;

/**
 * Validates GetLinksPublicTokenRequest.
 *
 * @param request - GetLinksPublicTokenRequest proto.
 */
export default function validate(
  request: proto.server.link.IGetLinksPublicTokenRequest,
) {
  if (!(request instanceof GetLinksPublicTokenRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of GetLinksPublicTokenRequest`,
    );
  }
  validateOneOfFields(request, ['plaidItemId', 'linkId', 'accountId']);
}
