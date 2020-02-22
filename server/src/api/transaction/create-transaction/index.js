const {
  CreateTransactionRequest,
  CreateTransactionResponse,
} = require('shared/proto').server.transaction;
const {
  GetAccountsRequest,
} = require('shared/proto').server.account;
const { SessionToken } = require('shared/proto').server;

const { handleGetAccounts } = require('@src/api/account/get-accounts');
const { Transaction } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const { BadRequestError } = require('@src/shared/error');

const { convertTransactionToProto } = require('../util');
const validate = require('./validator');

/**
 * CreateTransaction endpoint.
 * Creates and returns a new transaction.
 *
 * @param {CreateTransactionRequest} request - request proto.
 * @param {SessionToken} session - session proto.
 * @returns {CreateTransactionResponse} - response proto.
 */
async function handleCreateTransaction(request, session) {
  validate(request);

  const getAccountsRequest = GetAccountsRequest.create({
    obfuscatedAccountIds: [request.obfuscatedAccountId],
  });
  const getAccountsResponse = await handleGetAccounts(getAccountsRequest);

  const account = (getAccountsResponse.accounts || [])[0];
  if (!account) {
    throw new BadRequestError(
      'Cannot create a transaction that does not belong to an account',
    );
  }

  const transaction = await Transaction.create({
    // Provided by client request.
    accountId: account.id,
    name: request.name,
    category: request.category,
    type: request.type,
    amount: request.amount,
    date: request.date,
    note: request.note,
    recurring: request.recurring,
    // Not provided by client request.
    userId: session.userId,
    isoCurrencyCode: account.balanceIsoCurrencyCode,
    unofficialCurrencyCode: account.balanceUnofficialCurrencyCode,
    manuallyCreated: true,
  }).then(convertTransactionToProto);

  // TODO: upsert account balance histories

  return CreateTransactionResponse.create({ transaction });
}

/**
 * Registers and exposes CreateTransaction endpoint.
 *
 * @param {object} app - given.
 */
function registerCreateTransactionRoute(app) {
  app.post(
    '/api/transaction/create-transaction',
    verifyAuth,
    async (req, res) => {
      const request = CreateTransactionRequest.decode(req.raw);

      const response = await handleCreateTransaction(request, req.session);
      const responseBuffer = CreateTransactionResponse.encode(
        response,
      ).finish();

      return res.send(responseBuffer);
    },
  );
}

module.exports = {
  handleCreateTransaction,
  registerCreateTransactionRoute,
};
