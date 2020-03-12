import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

const { CreateLinkRequest } = proto.server.link;

/**
 * Validates CreateLinkRequest.
 *
 * @param {CreateLinkRequest} request - CreateLinkRequest proto.
 */
export default function validate(
  request: proto.server.link.ICreateLinkRequest,
) {
  if (!(request instanceof CreateLinkRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(
        request,
      )} is not an instance of CreateLinkRequest`,
    );
  }
  validateRequiredFields(request, ['plaidPublicToken', 'plaidInstitutionId']);
}
