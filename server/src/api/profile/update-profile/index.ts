import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { verifyAuth } from '@src/middleware';
import { DatabaseError } from '@src/shared/error';
import { CustomRequest } from '@src/types/request';

import validate from './validator';
import { encodeArrayIdsToStr } from 'shared/db/util';

const { UpdateProfileRequest, UpdateProfileResponse } = proto.server.profile;
const { SessionToken } = proto.server;

/**
 * Registers and exposes UpdateProfile endpoint.
 *
 * @param app - given.
 */
export function registerUpdateProfileRoute(app: Application) {
  app.post(
    '/api/profile/update-profile',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = UpdateProfileRequest.decode(req.raw);

      const response = await handleUpdateProfile(request, req.session);
      const responseBuffer = UpdateProfileResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * UpdateProfile endpoint.
 *
 * @param request - request proto.
 * @param session - session token proto.
 * @returns - response proto.
 */
export async function handleUpdateProfile(
  request: proto.server.profile.IUpdateProfileRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const updatingProfile: { name?: string; accountIdsStr?: string } = {};
  if (request.name) {
    updatingProfile.name = request.name;
  }
  if (request.accountIds) {
    updatingProfile.accountIdsStr = encodeArrayIdsToStr(request.accountIds);
  }

  const { Profile } = await connect();
  const updateResult = await Profile.update(
    { id: request.id, userId: session.userId },
    updatingProfile,
  );
  if (!updateResult.affected) {
    throw new DatabaseError(
      `An error has occurred while updating profile ${JSON.stringify(request)}`,
    );
  }

  return UpdateProfileResponse.create();
}
