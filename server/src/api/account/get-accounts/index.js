const {
  GetAccountsRequest,
  GetAccountsResponse,
} = require('shared/proto/server/account/get_accounts').server.account;
const {
  GetProfilesRequest,
} = require('shared/proto/server/profile/get_profiles').server.profile;
const { Profile } = require('shared/proto/shared/profile').shared;
const { SessionToken } = require('shared/proto/server/session_token').server;

const { handleGetProfiles } = require('@src/api/profile/get-profiles');
const { Account } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const { unobfuscateId } = require('@src/shared/util');

const { convertAccountToProto } = require('../util');
const validate = require('./validator');

/**
 * Reduces profiles' account ids into a single list.
 *
 * @param {Profile[]} profiles - List of profile query results.
 * @returns {number[]} - List of account ids associated with the profiles.
 */
function reduceProfilesToAccountIds(profiles) {
  return profiles.reduce(
    (accumulator, profile) =>
      accumulator.concat(profile.obfuscatedAccountIds.map(unobfuscateId)),
    [],
  );
}

/**
 * GetAccounts endpoint.
 * Could filter results by matching accountIds or profileIds at the point of querying.
 *
 * @param {GetAccountsRequest} request - request proto.
 * @param {SessionToken} session - session proto.
 * @returns {GetAccountsResponse} - response proto.
 */
async function handleGetAccounts(request, session) {
  validate(request);

  let accountIds = (request.obfuscatedAccountIds || []).map(unobfuscateId);
  if (request.obfuscatedProfileIds) {
    const getProfilesRequest = GetProfilesRequest.create({
      obfuscatedProfileIds: request.obfuscatedProfileIds,
    });
    const getProfilesResponse = await handleGetProfiles(getProfilesRequest);
    const accountIdsFromProfiles = reduceProfilesToAccountIds(
      getProfilesResponse.profiles,
    );
    // Merges accountIds from profiles and request without duplicates.
    accountIds = Array.from(new Set(accountIds.concat(accountIdsFromProfiles)));
  }

  const whereQuery = { userId: session.userId };
  if (accountIds.length) {
    whereQuery.id = accountIds;
  }

  const accounts = await Account.findAll({
    where: whereQuery,
  }).then(results => results.map(convertAccountToProto));

  return GetAccountsResponse.create({ accounts });
}

/**
 * Registers and exposes GetAccounts endpoint.
 *
 * @param {object} app - given.
 */
function registerGetAccountsRoute(app) {
  app.post('/api/account/get-accounts', verifyAuth, async (req, res) => {
    const request = GetAccountsRequest.decode(req.raw);

    const response = await handleGetAccounts(request, req.session);
    const responseBuffer = GetAccountsResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleGetAccounts,
  registerGetAccountsRoute,
};
