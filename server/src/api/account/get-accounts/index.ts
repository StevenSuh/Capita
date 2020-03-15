import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';
import { FindOperator, In } from 'typeorm';

import { handleGetProfiles } from '@src/api/profile/get-profiles';
import { verifyAuth } from '@src/middleware';
import { CustomRequest } from '@src/types/request';

import { convertAccountToProto } from '../util';
import validate from './validator';

const { GetAccountsRequest, GetAccountsResponse } = proto.server.account;
const { GetProfilesRequest } = proto.server.profile;

/**
 * Registers and exposes GetAccounts endpoint.
 *
 * @param app - given.
 */
export function registerGetAccountsRoute(app: Application) {
  app.post(
    '/api/account/get-accounts',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = GetAccountsRequest.decode(req.raw);

      const response = await handleGetAccounts(request, req.session);
      const responseBuffer = GetAccountsResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * GetAccounts endpoint.
 * Could filter results by matching accountIds or profileIds at the point of querying.
 *
 * @param request - request proto.
 * @param session - session proto.
 * @returns - response proto.
 */
export async function handleGetAccounts(
  request: proto.server.account.IGetAccountsRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  let accountIds = request.accountIds || [];
  if (request.profileIds) {
    const getProfilesRequest = GetProfilesRequest.create({
      profileIds: request.profileIds,
    });
    const getProfilesResponse = await handleGetProfiles(
      getProfilesRequest,
      session,
    );
    const accountIdsFromProfiles = reduceProfilesToAccountIds(
      getProfilesResponse.profiles,
    );
    // Merges accountIds from profiles and request without duplicates.
    accountIds = Array.from(new Set(accountIds.concat(accountIdsFromProfiles)));
  }

  const whereQuery: {
    id?: FindOperator<number[]>;
    plaidAccountId?: FindOperator<string[]>;
    userId: number;
  } = {
    userId: session.userId,
  };
  if (accountIds.length) {
    whereQuery.id = In(accountIds);
  }
  if (request.plaidAccountIds) {
    whereQuery.plaidAccountId = In(request.plaidAccountIds);
  }

  const { Account } = await connect();
  const accounts = await Account.find({
    where: whereQuery,
  }).then(results => results.map(convertAccountToProto));

  return GetAccountsResponse.create({ accounts });
}

/**
 * Reduces profiles' account ids into a single list.
 *
 * @param profiles - List of profile query results.
 * @returns - List of account ids associated with the profiles.
 */
function reduceProfilesToAccountIds(
  profiles: proto.shared.IProfile[],
): number[] {
  return profiles.reduce(
    (accumulator, profile) => accumulator.concat(profile.accountIds),
    [],
  );
}
