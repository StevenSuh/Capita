import { Application } from 'express';
import proto from 'shared/proto';

import { handleGetAccounts } from '@src/api/account/get-accounts';
import { handleSyncAccounts } from '@src/api/account/sync-accounts';
import { verifyAuth } from '@src/middleware';
import { CustomRequest } from '@src/types/request';

const { GetAccountsRequest, SyncAccountsRequest } = proto.server.account;
const { SyncEverythingRequest, SyncEverythingResponse } = proto.server.user;

/**
 * Registers and exposes SyncEverything endpoint.
 *
 * @param app - given.
 */
export function registerSyncEverythingRoute(app: Application) {
  app.post(
    '/api/user/sync-everything',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = SyncEverythingRequest.decode(req.raw);

      const response = await handleSyncEverything(request, req.session);
      const responseBuffer = SyncEverythingResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * SyncEverything endpoint.
 * Calls SyncAccounts for all accounts related to user.
 *
 * @param request - request proto.
 * @param session - session token proto.
 * @returns - response proto.
 */
export async function handleSyncEverything(
  request: proto.server.user.ISyncEverythingRequest,
  session: proto.server.ISessionToken,
) {
  const getAccountsRequest = GetAccountsRequest.create();
  const { accounts } = await handleGetAccounts(getAccountsRequest, session);

  const syncAccountsRequest = SyncAccountsRequest.create({
    accountIds: accounts.map(({ id }) => id),
    sinceDate: request.sinceDate,
    count: request.count,
  });
  const syncAccountsResponse = await handleSyncAccounts(
    syncAccountsRequest,
    session,
  );

  return SyncEverythingResponse.create({
    results: syncAccountsResponse.results,
  });
}
