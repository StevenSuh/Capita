import proto from 'shared/proto';

import { ValidationError } from '@src/shared/error';
import { validateRequiredFields } from '@src/shared/util';

import { validateEmail, validatePassword } from '../util';

const { SignInRequest } = proto.server.user;

/**
 * Validates SignInRequest.
 *
 * @param request - SignInRequest proto.
 */
export default function validate(request: proto.server.user.ISignInRequest) {
  if (!(request instanceof SignInRequest)) {
    throw new ValidationError(
      `Request ${JSON.stringify(request)} is not an instance of SignInRequest`,
    );
  }
  validateRequiredFields(request, ['email', 'password']);
  validateEmail(request.email);
  validatePassword(request.password);
}
