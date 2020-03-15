import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { InvalidLoginError } from '@src/shared/error';
import { CustomRequest } from '@src/types/request';

import { confirmPassword, createSessionToken } from '../util';
import validate from './validator';

const { SignInRequest, SignInResponse } = proto.server.user;
const { SessionToken } = proto.server;

/**
 * Registers and exposes SignIn endpoint.
 *
 * @param app - given.
 */
export function registerSignInRoute(app: Application) {
  app.post('/api/user/sign-in', async (req: CustomRequest, res) => {
    const request = SignInRequest.decode(req.raw);

    const response = await handleSignIn(request);
    const responseBuffer = SignInResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

/**
 * SignIn endpoint.
 * User can login and given a session token if provided with correct credentials.
 *
 * @param request - request proto.
 * @returns - response proto.
 */
export async function handleSignIn(request: proto.server.user.ISignInRequest) {
  validate(request);

  const { User } = await connect();
  const user = await User.findOne({ where: { email: request.email } });
  if (!user) {
    throw new InvalidLoginError('Invalid email or password');
  }

  const isValidPassword = await confirmPassword(
    user.password,
    request.password,
  );
  if (!isValidPassword) {
    throw new InvalidLoginError('Invalid email or password');
  }

  return SignInResponse.create({
    sessionToken: createSessionToken(SessionToken.create({ userId: user.id })),
  });
}
