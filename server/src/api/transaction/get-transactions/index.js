const { Op } = require('sequelize');
const {
  GetTransactionsRequest,
  GetTransactionsResponse,
} = require('shared/proto/server/transaction/get_transactions');
const { SessionToken } = require('shared/proto/server/session_token').server;

const { Transaction } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const { unobfuscateId } = require('@src/shared/util');

const { convertTransactionToProto } = require('../util');
const validate = require('./validator');

/**
 * GetTransactions endpoint.
 * Could filter results by matching accountIds or transactioinIds in the query if supplied in request.
 *
 * @param {GetTransactionsRequest} request - request proto.
 * @param {SessionToken} session - session proto.
 * @returns {GetTransactionsResponse} - response proto.
 */
async function handleGetTransactions(request, session) {
  validate(request);

  const accountIds = (request.obfuscatedAccountIds || []).map(unobfuscateId);
  const transactionIds = (request.obfuscatedTransactionIds || []).map(
    unobfuscateId,
  );

  const whereQuery = { userId: session.userId };

  if (transactionIds.length || accountIds.length) {
    const orFieldQuery = [];

    if (transactionIds.length) {
      orFieldQuery.push({ transactionId: transactionIds });
    }
    if (accountIds.length) {
      orFieldQuery.push({ accountId: accountIds });
    }

    whereQuery[Op.or] = orFieldQuery;
  }

  const transactions = await Transaction.findAll({
    where: whereQuery,
  }).then(results => results.map(convertTransactionToProto));

  return GetTransactionsResponse.create({ transactions });
}

/**
 * Registers and exposes GetTransactions endpoint.
 *
 * @param {object} app - given.
 */
function registerGetTransactionsRoute(app) {
  app.post(
    '/api/transaction/get-transactions',
    verifyAuth,
    async (req, res) => {
      const request = GetTransactionsRequest.decode(req.raw);

      const response = await handleGetTransactions(request, req.session);
      const responseBuffer = GetTransactionsResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

module.exports = {
  handleGetTransactions,
  registerGetTransactionsRoute,
};
