import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { BadRequestError } from '@src/shared/error';
import { CustomRequest } from '@src/types/request';

import { createSessionToken, encryptPassword } from '../util';
import validate from './validator';

const { SignUpRequest, SignUpResponse } = proto.server.user;
const { SessionToken } = proto.server;

/**
 * Registers and exposes SignUp endpoint.
 *
 * @param app - given.
 */
export function registerSignUpRoute(app: Application) {
  app.post('/api/user/sign-up', async (req: CustomRequest, res) => {
    const request = SignUpRequest.decode(req.raw);

    const response = await handleSignUp(request);
    const responseBuffer = SignUpResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

/**
 * SignUp endpoint.
 * User can create a new account and a session token if provided with correct information.
 *
 * @param request - request proto.
 * @returns - response proto.
 */
export async function handleSignUp(request: proto.server.user.ISignUpRequest) {
  validate(request);

  const hashedPassword = await encryptPassword(request.password);

  const { User } = await connect();
  let user = await User.findOne({ where: { email: request.email } });
  if (user) {
    throw new BadRequestError('An account with this email already exists');
  }

  user = User.create({
    email: request.email,
    password: hashedPassword,
  });
  user = await User.save(user);

  return SignUpResponse.create({
    sessionToken: createSessionToken(SessionToken.create({ userId: user.id })),
  });
}
