const {
  UpdateLinkRequest,
  UpdateLinkResponse,
} = require('shared/proto').server.link;
const { SessionToken } = require('shared/proto').server;

const { Account, Link } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const { createPublicToken } = require('@src/service/plaid');

const validate = require('./validator');

/**
 * UpdateLink endpoint.
 * Updates link with plaid.
 *
 * @param {UpdateLinkRequest} request - request proto.
 * @param {SessionToken} session - session token proto.
 */
async function handleUpdateLink(request, session) {
  validate(request);

  let { linkId } = request;
  if (!linkId && !request.plaidItemId) {
    const account = await Account.findOne({
      where: {
        id: request.accountId,
        userId: session.userId,
      },
    });
    linkId = account.linkId;
  }

  const whereQuery = { userId: session.userId };
  if (linkId) {
    whereQuery.id = linkId;
  }
  if (request.plaidItemId) {
    whereQuery.plaidItemId = request.plaidItemId;
  }

  const link = await Link.findOne({ where: whereQuery });
  const publicToken = await createPublicToken(link.accessToken);

  return UpdateLinkResponse.create({ plaidPublicToken: publicToken });
}

/**
 * Registers and exposes UpdateLink endpoint.
 *
 * @param {object} app - given.
 */
function registerUpdateLinkRoute(app) {
  app.post('/api/link/update-link', verifyAuth, async (req, res) => {
    const request = UpdateLinkRequest.decode(req.raw);

    const response = await handleUpdateLink(request, req.session);
    const responseBuffer = UpdateLinkResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleUpdateLink,
  registerUpdateLinkRoute,
};
