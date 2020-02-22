const {
  DeleteAccountRequest,
  DeleteAccountResponse,
} = require('shared/proto').server.account;
const { GetProfilesRequest } = require('shared/proto').server.profile;
const { SessionToken } = require('shared/proto').server;
const ProfileProto = require('shared/proto').shared.Profile;

const { handleGetProfiles } = require('@src/api/profile/get-profiles');
const { Account, Profile } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');

const validate = require('./validator');

/**
 * Create profile update object without accountId in its accountIds field.
 *
 * @param {ProfileProto} profile - profile proto.
 * @param {number} accountId - account id.
 * @returns {object} - Profile update object.
 */
function createAccountIdFilteredProfileObject(profile, accountId) {
  return {
    id: profile.id,
    accountIds: profile.accountIds.filter(id => id !== accountId),
  };
}

/**
 * DeleteAccount endpoint.
 * Deletes a account.
 *
 * @param {DeleteAccountRequest} request - request proto.
 * @param {SessionToken} session - session token proto.
 * @returns {DeleteAccountResponse} - response proto.
 */
async function handleDeleteAccount(request, session) {
  validate(request);

  const getProfilesRequest = GetProfilesRequest.create({
    accountIds: [request.id],
  });
  const getProfilesResponse = await handleGetProfiles(getProfilesRequest);

  const accountId = request.id;
  const profiles = getProfilesResponse.profiles.map(profile =>
    createAccountIdFilteredProfileObject(profile, accountId),
  );

  // Remove the deleting account id from Profile. Because accountIds is an array field, ON DELETE CASCADE becomes nontrivial.
  await Profile.bulkCreate(profiles, { updateOnDuplicate: true });
  await Account.destroy({ where: { id: accountId, userId: session.userId } });

  return DeleteAccountResponse.create();
}

/**
 * Registers and exposes DeleteAccount endpoint.
 *
 * @param {object} app - given.
 */
function registerDeleteAccountRoute(app) {
  app.post('/api/account/delete-account', verifyAuth, async (req, res) => {
    const request = DeleteAccountRequest.decode(req.raw);

    const response = await handleDeleteAccount(request, req.session);
    const responseBuffer = DeleteAccountResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleDeleteAccount,
  registerDeleteAccountRoute,
};
