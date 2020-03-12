import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

import { validateEmail, validatePassword } from '../util';

const { SignUpRequest } = proto.server.user;

/**
 * Validates SignUpRequest.
 *
 * @param request - SignUpRequest proto.
 */
export default function validate(request: proto.server.user.ISignUpRequest) {
  if (!(request instanceof SignUpRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(request)} is not an instance of SignUpRequest`,
    );
  }
  validateRequiredFields(request, ['email', 'password', 'name']);
  validateEmail(request.email);
  validatePassword(request.password);
}
