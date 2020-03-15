import connect from 'shared/db';
import { Link as LinkEntity } from 'shared/db/entity/Link';
import proto from 'shared/proto';

import { handleUpsertPlaidAccounts } from '@src/api/account/upsert-plaid-accounts';
import { verifyAuth } from '@src/middleware';
import {
  getAccounts,
  getInstitution,
  getLink,
  invalidateAccessToken,
} from '@src/service/plaid';
import { DatabaseError } from '@src/shared/error';
import { createExcludedKeys } from '@src/shared/util';
import { PlaidAccount } from '@src/types/plaid';
import { CustomRequest } from '@src/types/request';

import validate from './validator';
import { Application } from 'express';

const { CreateLinkRequest, CreateLinkResponse } = proto.server.link;
const { UpsertPlaidAccountsRequest } = proto.server.account;
const { SessionToken } = proto.server;

/**
 * Registers and exposes CreateLink endpoint.
 *
 * @param app - given.
 */
export function registerCreateLinkRoute(app: Application) {
  app.post(
    '/api/link/create-link',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = CreateLinkRequest.decode(req.raw);

      const response = await handleCreateLink(request, req.session);
      const responseBuffer = CreateLinkResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * CreateLink endpoint.
 * Creates link with plaid and syncs its accounts to our database.
 *
 * NOTE: This does not sync with transactions due to Plaid needing some time. Those will be handled through webhooks.
 *
 * @param request - request proto.
 * @param session - session token proto.
 * @returns - response proto.
 */
export async function handleCreateLink(
  request: proto.server.link.ICreateLinkRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const { accessToken, itemId } = await getLink(request.plaidPublicToken);

  const { Link } = await connect();
  const oldLink = await Link.findOne({
    where: { plaidItemId: itemId, userId: session.userId },
  });
  if (oldLink) {
    // Invalidate old access token.
    await invalidateAccessToken(oldLink.accessToken);
  }

  const institution = await getInstitution(request.plaidInstitutionId);
  const upsertingLink = {
    userId: session.userId,
    accessToken,
    plaidItemId: itemId,
    plaidInstitutionId: request.plaidInstitutionId,
    institutionName: institution.name,
    institutionUrl: institution.url,
    institutionLogo: institution.logo,
    ready: false,
    needsUpdate: true,
  };

  const excludedKeys = createExcludedKeys(upsertingLink);
  const upsertResult = await Link.createQueryBuilder()
    .insert()
    .values(upsertingLink)
    .onConflict(`("plaidItemId") DO UPDATE SET ${excludedKeys}`)
    .returning('*')
    .execute();
  const newLink = upsertResult.generatedMaps[0] as LinkEntity;
  if (!newLink) {
    throw new DatabaseError(
      `An error has occurred while creating link ${JSON.stringify(request)}`,
    );
  }
  await upsertPlaidAccounts(itemId, newLink, session);

  return CreateLinkResponse.create();
}

/**
 * Call UpsertPlaidAccountsRequest.
 *
 * @param itemId - Plaid item id.
 * @param link - Link query object.
 * @param session - session token proto.
 */
async function upsertPlaidAccounts(
  itemId: string,
  link: LinkEntity,
  session: proto.server.ISessionToken,
) {
  const { accounts } = await getAccounts(itemId);

  const request = UpsertPlaidAccountsRequest.create({
    accounts: accounts.map(account =>
      convertAccountToPlaidAccount(account, link, session),
    ),
  });

  const response = await handleUpsertPlaidAccounts(request);
  response.results.forEach(result => {
    if (result.errorType) {
      throw new DatabaseError(
        `Error while upserting plaid account ${
          result.plaidAccountId
        } under request ${JSON.stringify(request)}`,
      );
    }
  });
}

/**
 * Convert account object to UpsertPlaidAccountsRequest.PlaidAccount.
 *
 * @param account - Plaid account object.
 * @param link - Link query object.
 * @param session - session token proto.
 * @returns - PlaidAccount proto.
 */
function convertAccountToPlaidAccount(
  account: PlaidAccount,
  link: LinkEntity,
  session: proto.server.ISessionToken,
) {
  return UpsertPlaidAccountsRequest.PlaidAccount.create({
    userId: session.userId,
    linkId: link.id,
    plaidAccountId: account.id,
    mask: account.mask,
    name: account.name,
    officialName: account.officialName,
    subtype: account.subtype,
    type: account.type,
    verificationStatus: account.verificationStatus,
    balanceAvailable: account.balances.available,
    balanceCurrent: account.balances.current,
    balanceLimit: account.balances.limit,
    balanceIsoCurrencyCode: account.balances.isoCurrencyCode,
    balanceUnofficialCurrencyCode: account.balances.unofficialCurrencyCode,
    manuallyCreated: false,
    hidden: false,
    needsUpdate: false,
  });
}
