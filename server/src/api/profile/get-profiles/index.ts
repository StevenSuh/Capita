import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';
import { FindOperator, In, Like } from 'typeorm';

import { verifyAuth } from '@src/middleware';
import { CustomRequest } from '@src/types/request';

import { convertProfileToProto } from '../util';
import validate from './validator';

const { GetProfilesRequest, GetProfilesResponse } = proto.server.profile;

/**
 * Registers and exposes GetProfiles endpoint.
 *
 * @param app - given.
 */
export function registerGetProfilesRoute(app: Application) {
  app.post(
    '/api/profile/get-profiles',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = GetProfilesRequest.decode(req.raw);

      const response = await handleGetProfiles(request, req.session);
      const responseBuffer = GetProfilesResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * GetProfiles endpoint.
 * Fetches all profiles related to requesting user.
 *
 * @param request - request proto.
 * @param session - session proto.
 * @returns - response proto.
 */
export async function handleGetProfiles(
  request: proto.server.profile.IGetProfilesRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  let whereQueries: {
    id?: FindOperator<number[]>;
    accountIdsStr?: FindOperator<string>;
    userId: number;
  }[] = [];
  // OR operator on field 'accountIdsStr'.
  if (request.accountIds) {
    whereQueries = whereQueries.concat(
      request.accountIds.map(accountId => ({
        accountIdsStr: Like(`%${accountId}%`),
        userId: session.userId,
      })),
    );
  }
  // Supply a default query if empty.
  if (!whereQueries.length) {
    whereQueries.push({
      userId: session.userId,
    });
  }
  if (request.profileIds) {
    whereQueries.forEach(query => {
      query.id = In(request.profileIds);
    });
  }

  const { Profile } = await connect();
  const profiles = await Profile.find({ where: whereQueries }).then(results =>
    results.map(convertProfileToProto),
  );

  return GetProfilesResponse.create({ profiles });
}
