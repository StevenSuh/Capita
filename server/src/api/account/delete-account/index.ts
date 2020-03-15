import connect from 'shared/db';
import proto from 'shared/proto';

import { handleGetProfiles } from '@src/api/profile/get-profiles';
import { verifyAuth } from '@src/middleware';
import { createExcludedKeys } from '@src/shared/util';
import { CustomRequest } from '@src/types/request';

import validate from './validator';
import { Application } from 'express';
import { encodeArrayIdsToStr } from 'shared/db/util';

const { DeleteAccountRequest, DeleteAccountResponse } = proto.server.account;
const { GetProfilesRequest } = proto.server.profile;

/**
 * Registers and exposes DeleteAccount endpoint.
 *
 * @param app - given.
 */
export function registerDeleteAccountRoute(app: Application) {
  app.post(
    '/api/account/delete-account',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = DeleteAccountRequest.decode(req.raw);

      const response = await handleDeleteAccount(request, req.session);
      const responseBuffer = DeleteAccountResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * DeleteAccount endpoint.
 * Deletes a account.
 *
 * @param request - request proto.
 * @param session - session token proto.
 * @returns - response proto.
 */
export async function handleDeleteAccount(
  request: proto.server.account.IDeleteAccountRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const getProfilesRequest = GetProfilesRequest.create({
    accountIds: [request.id],
  });
  const getProfilesResponse = await handleGetProfiles(
    getProfilesRequest,
    session,
  );

  const accountId = request.id;
  const profiles = getProfilesResponse.profiles.map(profile =>
    createAccountIdFilteredProfileObject(profile, accountId),
  );

  const { Account, Profile } = await connect();
  // Remove the deleting account id from Profile.
  // Because accountIds is an array field, ON DELETE CASCADE becomes nontrivial.
  if (profiles.length) {
    const excludedKeys = createExcludedKeys(profiles[0]);
    await Profile.createQueryBuilder()
      .insert()
      .values(profiles)
      .onConflict(`("id") DO UPDATE SET ${excludedKeys}`)
      .execute();
  }
  await Account.delete({ id: accountId, userId: session.userId });

  // TODO: Remove link as well if this account is the last one.

  return DeleteAccountResponse.create();
}

/**
 * Create profile update object without accountId in its accountIds field.
 *
 * @param profile - profile proto.
 * @param accountId - account id.
 * @returns - Profile update object.
 */
function createAccountIdFilteredProfileObject(
  profile: proto.shared.IProfile,
  accountId: number,
) {
  return {
    id: profile.id,
    accountIdsStr: encodeArrayIdsToStr(
      profile.accountIds.filter(id => id !== accountId),
    ),
  };
}
