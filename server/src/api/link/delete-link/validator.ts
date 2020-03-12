import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateOneOfFields } from '@src/shared/util';

const { DeleteLinkRequest } = proto.server.link;

/**
 * Validates DeleteLinkRequest.
 *
 * @param request - DeleteLinkRequest proto.
 */
export default function validate(
  request: proto.server.link.IDeleteLinkRequest,
) {
  if (!(request instanceof DeleteLinkRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of DeleteLinkRequest`,
    );
  }
  validateOneOfFields(request, ['plaidItemId', 'linkId']);
}
