const {
  CreateAccountRequest,
  CreateAccountResponse,
} = require('shared/proto/server/account/create_account').server.account;
const { SessionToken } = require('shared/proto/server/session_token').server;

const { Account } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');

const {
  convertAccountToProto,
  convertAccountTypeToString,
} = require('../util');
const validate = require('./validator');

/**
 * CreateAccount endpoint.
 *
 * @param {CreateAccountRequest} request - request proto.
 * @param {SessionToken} session - session proto.
 * @returns {CreateAccountResponse} - response proto.
 */
async function handleCreateAccount(request, session) {
  validate(request);

  const account = await Account.create({
    // Provided by client request.
    name: request.name,
    type: convertAccountTypeToString(request.type),
    subtype: request.subtype,
    balanceAvailable: request.balance.available,
    balanceCurrent: request.balance.current,
    balanceLimit: request.balance.limit,
    balanceIsoCurrencyCode: request.balance.isoCurrencyCode,
    // Not provided by client request.
    userId: session.userId,
    officialName: request.name,
    balanceUnofficialCurrencyCode: request.balance.isoCurrencyCode,
    manuallyCreated: true,
  }).then(convertAccountToProto);

  return CreateAccountResponse.create({ account });
}

/**
 * Registers and exposes CreateAccount endpoint.
 *
 * @param {object} app - given.
 */
function registerCreateAccountRoute(app) {
  app.post('/api/account/create-account', verifyAuth, async (req, res) => {
    const request = CreateAccountRequest.decode(req.raw);

    const response = await handleCreateAccount(request, req.session);
    const responseBuffer = CreateAccountResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleCreateAccount,
  registerCreateAccountRoute,
};
