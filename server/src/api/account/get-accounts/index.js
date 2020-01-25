const {
  GetAccountsRequest,
  GetAccountsResponse,
} = require('shared/proto/server/account/get_accounts');

const { Account, Profile } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const { unobfuscateId } = require('@src/shared/util');

const { convertAccountToProto } = require('../util');
const validate = require('./validator');

/**
 * Reduces profiles' account ids into a single list.
 *
 * @param {object[]} profiles - List of profile query results.
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
 * @returns {GetAccountsResponse} - response proto.
 */
async function handleGetAccounts(request) {
  validate(request);

  let accountIds = (request.obfuscatedAccountIds || []).map(unobfuscateId);
  if (request.obfuscatedProfileIds) {
    const accountIdsFromProfiles = await Profile.findAll({
      where: { id: request.obfuscatedProfileIds.map(unobfuscateId) },
    }).then(reduceProfilesToAccountIds);
    // Merges accountIds from profiles and request without duplicates.
    accountIds = Array.from(new Set(accountIds.concat(accountIdsFromProfiles)));
  }

  const accounts = await Account.findAll({
    where: { id: accountIds },
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

    const response = await handleGetAccounts(request);
    const responseBuffer = GetAccountsResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleGetAccounts,
  registerGetAccountsRoute,
};
