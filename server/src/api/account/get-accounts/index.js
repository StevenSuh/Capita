const {
  GetAccountsRequest,
  GetAccountsResponse,
} = require('shared/proto').server.account;
const { GetProfilesRequest } = require('shared/proto').server.profile;
const { Profile } = require('shared/proto').shared;
const { SessionToken } = require('shared/proto').server;

const { handleGetProfiles } = require('@src/api/profile/get-profiles');
const { Account } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');

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
    (accumulator, profile) => accumulator.concat(profile.accountIds),
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

  let accountIds = request.accountIds || [];
  if (request.profileIds) {
    const getProfilesRequest = GetProfilesRequest.create({
      profileIds: request.profileIds,
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
