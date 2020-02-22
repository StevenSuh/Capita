const {
  UpdateAccountRequest,
  UpdateAccountResponse,
} = require('shared/proto').server.account;
const { SessionToken } = require('shared/proto').server;

const { Account } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const { DatabaseError } = require('@src/shared/error');

const { convertAccountTypeToString } = require('../util');
const validate = require('./validator');

/**
 * UpdateAccount endpoint.
 *
 * @param {UpdateAccountRequest} request - request proto.
 * @param {SessionToken} session - session token proto.
 * @returns {UpdateAccountResponse} - response proto.
 */
async function handleUpdateAccount(request, session) {
  validate(request);

  const updatingAccount = {};
  if (request.mask) {
    updatingAccount.mask = request.mask;
  }
  if (request.name) {
    updatingAccount.name = request.name;
  }
  if (request.subtype) {
    updatingAccount.subtype = request.subtype;
  }
  if (request.type) {
    updatingAccount.type = convertAccountTypeToString(request.type);
  }
  if (request.hidden) {
    updatingAccount.hidden = request.hidden;
  }

  const [affectedRows] = await Account.update(updatingAccount, {
    where: { id: request.id, userId: session.userId },
  });
  if (!affectedRows) {
    throw new DatabaseError(
      `An error has occurred while updating account ${request.toString()}`,
    );
  }

  return UpdateAccountResponse.create();
}

/**
 * Registes and exposes UpdateAccount endpoint.
 *
 * @param {object} app - given.
 */
function registerUpdateAccountRoute(app) {
  app.post('/api/account/update-account', verifyAuth, async (req, res) => {
    const request = UpdateAccountRequest.decode(req.raw);

    const response = await handleUpdateAccount(request, req.session);
    const responseBuffer = UpdateAccountResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleUpdateAccount,
  registerUpdateAccountRoute,
};
