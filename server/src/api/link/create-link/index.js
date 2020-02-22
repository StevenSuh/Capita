const {
  CreateLinkRequest,
  CreateLinkResponse,
} = require('shared/proto').server.link;
const { UpsertPlaidAccountsRequest } = require('shared/proto').server.account;
const { SessionToken } = require('shared/proto').server;

const {
  handleUpsertPlaidAccounts,
} = require('@src/api/account/upsert-plaid-accounts');
const { Link } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const {
  getAccounts,
  getInstitution,
  getLink,
  invalidateAccessToken,
} = require('@src/service/plaid');
const { DatabaseError } = require('@src/shared/error');

const validate = require('./validator');

/**
 * Convert account object to UpsertPlaidAccountsRequest.PlaidAccount.
 *
 * @param {object} account - Plaid account object.
 * @param {object} link - Link query object.
 * @param {SessionToken} session - session token proto.
 * @returns {UpsertPlaidAccountsRequest.PlaidAccount} - PlaidAccount proto.
 */
function convertAccountToPlaidAccount(account, link, session) {
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
    balanceAvailable: account.balance.available,
    balanceCurrent: account.balance.current,
    balanceLimit: account.balance.limit,
    balanceIsoCurrencyCode: account.balance.isoCurrencyCode,
    balanceUnofficialCurrencyCode: account.balance.unofficialCurrencyCode,
    manuallyCreated: false,
    hidden: false,
  });
}

/**
 * Call UpsertPlaidAccountsRequest.
 *
 * @param {string} itemId - Plaid item id.
 * @param {object} link - Link query object.
 * @param {SessionToken} session - session token proto.
 */
async function upsertPlaidAccounts(itemId, link, session) {
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
 * CreateLink endpoint.
 * Creates link with plaid and syncs its accounts to our database.
 *
 * NOTE: This does not sync with transactions due to Plaid needing some time. Those will be handled through webhooks.
 *
 * @param {CreateLinkRequest} request - request proto.
 * @param {SessionToken} session - session token proto.
 * @returns {CreateLinkResponse} - response proto.
 */
async function handleCreateLink(request, session) {
  validate(request);

  const { accessToken, itemId } = await getLink(request.plaidPublicToken);

  const oldLink = await Link.findOne({
    where: { plaidItemId: itemId, userId: session.userId },
  });
  if (oldLink) {
    // Invalidate old access token.
    await invalidateAccessToken(oldLink.accessToken);
  }

  // Upsert new link.
  const institution = await getInstitution(request.plaidInstitutionId);
  const newLink = await Link.upsert(
    {
      userId: session.userId,
      accessToken,
      plaidItemId: itemId,
      plaidInstitutionId: request.plaidInstitutionId,
      institutionName: institution.name,
      institutionUrl: institution.url,
      institutionLogo: institution.logo,
      ready: false,
      needsUpdate: true,
    },
    { returning: true },
  );
  if (!newLink) {
    throw new DatabaseError(
      `An error has occurred while creating link ${JSON.stringify(request)}`,
    );
  }
  await upsertPlaidAccounts(itemId, newLink, session);

  return CreateLinkResponse.create();
}

/**
 * Registers and exposes CreateLink endpoint.
 *
 * @param {object} app - given.
 */
function registerCreateLinkRoute(app) {
  app.post('/api/link/create-link', verifyAuth, async (req, res) => {
    const request = CreateLinkRequest.decode(req.raw);

    const response = await handleCreateLink(request, req.session);
    const responseBuffer = CreateLinkResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleCreateLink,
  registerCreateLinkRoute,
};
