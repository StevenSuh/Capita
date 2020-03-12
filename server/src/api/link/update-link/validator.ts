import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateOneOfFields } from '@src/shared/util';

const { UpdateLinkRequest } = proto.server.link;

/**
 * Validates UpdateLinkRequest.
 *
 * @param request - UpdateLinkRequest proto.
 */
export default function validate(
  request: proto.server.link.IUpdateLinkRequest,
) {
  if (!(request instanceof UpdateLinkRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of UpdateLinkRequest`,
    );
  }
  validateOneOfFields(request, ['plaidItemId', 'linkId', 'accountId']);
}
