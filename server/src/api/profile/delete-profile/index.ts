import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { verifyAuth } from '@src/middleware';
import { DatabaseError } from '@src/shared/error';
import { CustomRequest } from '@src/types/request';

import validate from './validator';

const { DeleteProfileRequest, DeleteProfileResponse } = proto.server.profile;
const { SessionToken } = proto.server;

/**
 * Registers and exposes DeleteProfile endpoint.
 *
 * @param {object} app - given.
 */
export function registerDeleteProfileRoute(app: Application) {
  app.post(
    '/api/profile/delete-profile',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = DeleteProfileRequest.decode(req.raw);

      const response = await handleDeleteProfile(request, req.session);
      const responseBuffer = DeleteProfileResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * DeleteProfile endpoint.
 * Deletes a profile.
 *
 * @param request - request proto.
 * @param session - session token proto.
 * @returns - response proto.
 */
export async function handleDeleteProfile(
  request: proto.server.profile.IDeleteProfileRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const { Profile } = await connect();
  const deleteResult = await Profile.delete({
    id: request.id,
    userId: session.userId,
  });
  if (!deleteResult.affected) {
    throw new DatabaseError(
      `An error has occurred while deleting profile ${JSON.stringify(request)}`,
    );
  }

  return DeleteProfileResponse.create();
}
