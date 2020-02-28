const {
  GetAccountsRequest,
  SyncAccountsRequest,
} = require('shared/proto').server.account;
const {
  SyncEverythingRequest,
  SyncEverythingResponse,
} = require('shared/proto').server.user;
const { SessionToken } = require('shared/proto').server.user;

const { handleGetAccounts } = require('@src/api/account/get-accounts');
const { handleSyncAccounts } = require('@src/api/account/sync-accounts');
const { verifyAuth } = require('@src/middleware');

/**
 * SyncEverything endpoint.
 * Calls SyncAccounts for all accounts related to user.
 *
 * @param {SyncEverythingRequest} request - request proto.
 * @param {SessionToken} session - session token proto.
 * @returns {SyncEverythingResponse} - response proto.
 */
async function handleSyncEverything(request, session) {
  const getAccountsRequest = GetAccountsRequest.create();
  const { accounts } = await handleGetAccounts(getAccountsRequest, session);

  const syncAccountsRequest = SyncAccountsRequest.create({
    accountIds: accounts.map(({ id }) => id),
    sinceDate: request.sinceDate,
  });
  const syncAccountsResponse = await handleSyncAccounts(
    syncAccountsRequest,
    session,
  );

  return SyncEverythingResponse.create({
    results: syncAccountsResponse.results,
  });
}

/**
 * Registers and exposes SyncEverything endpoint.
 *
 * @param {object} app - given.
 */
function registerSyncEverythingRoute(app) {
  app.post('/api/user/sync-everything', verifyAuth, async (req, res) => {
    const request = SyncEverythingRequest.decode(req.raw);

    const response = await handleSyncEverything(request, req.session);
    const responseBuffer = SyncEverythingResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleSyncEverything,
  registerSyncEverythingRoute,
};
