import { Application } from 'express';
import connect from 'shared/db';
import { encodeArrayIdsToStr } from 'shared/db/util';
import proto from 'shared/proto';

import { verifyAuth } from '@src/middleware';
import { CustomRequest } from '@src/types/request';

import { convertProfileToProto } from '../util';
import validate from './validator';

const { CreateProfileRequest, CreateProfileResponse } = proto.server.profile;
const { SessionToken } = proto.server;

/**
 * Registers and exposes CreateProfile endpoint.
 *
 * @param app - given.
 */
export function registerCreateProfileRoute(app: Application) {
  app.post(
    '/api/profile/create-profile',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = CreateProfileRequest.decode(req.raw);

      const response = await handleCreateProfile(request, req.session);
      const responseBuffer = CreateProfileResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * CreateProfile endpoint.
 * Creates and returns a new profile.
 *
 * @param request - request proto.
 * @param session - session token proto.
 * @returns - response proto.
 */
export async function handleCreateProfile(
  request: proto.server.profile.ICreateProfileRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const { Profile } = await connect();
  let profile = Profile.create({
    userId: session.userId,
    name: request.name,
    accountIdsStr: encodeArrayIdsToStr(request.accountIds),
  });
  profile = await Profile.save(profile);

  return CreateProfileResponse.create({
    profile: convertProfileToProto(profile),
  });
}
