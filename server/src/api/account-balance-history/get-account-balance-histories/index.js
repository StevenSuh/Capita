const moment = require('moment');
const { Op } = require('sequelize');
const {
  GetAccountBalanceHistoriesRequest,
  GetAccountBalanceHistoriesResponse,
} = require('shared/proto').server.account_balance_history;
const { SessionToken } = require('shared/proto').server;

const { AccountBalanceHistory } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');

const { convertAccountBalanceHistoryToProto } = require('../util');
const validate = require('./validator');

/**
 * GetAccountBalanceHistories endpoint.
 * Fetches all account balance histories related to requesting user.
 *
 * @param {GetAccountBalanceHistoriesRequest} request - request proto.
 * @param {SessionToken} session - session proto.
 * @returns {GetAccountBalanceHistoriesResponse} - response proto.
 */
async function handleGetAccountBalanceHistories(request, session) {
  validate(request);

  const accountIds = request.accountIds || [];
  const startDate =
    request.startDate ||
    moment()
      .subtract(1, 'year')
      .format('YYYY-MM-DD');
  const endDate = request.endDate || moment().format('YYYY-MM-DD');

  const whereQuery = {
    userId: session.userId,
    date: {
      [Op.gte]: startDate,
      [Op.lte]: endDate,
    },
  };
  if (accountIds.length) {
    whereQuery.accountId = accountIds;
  }

  const accountBalanceHistories = await AccountBalanceHistory.findAll({
    where: whereQuery,
    order: [['date', 'ASC']],
  }).then(results => results.map(convertAccountBalanceHistoryToProto));

  return GetAccountBalanceHistoriesResponse.create({ accountBalanceHistories });
}

/**
 * Registers and exposes GetAccountBalanceHistories endpoint.
 *
 * @param {object} app - given.
 */
function registerGetAccountBalanceHistoriesRoute(app) {
  app.post(
    '/api/account-balance-history/get-account-balance-histories',
    verifyAuth,
    async (req, res) => {
      const request = GetAccountBalanceHistoriesRequest.decode(req.raw);

      const response = await handleGetAccountBalanceHistories(
        request,
        req.session,
      );
      const responseBuffer = GetAccountBalanceHistoriesResponse.encode(
        response,
      ).finish();

      return res.send(responseBuffer);
    },
  );
}

module.exports = {
  handleGetAccountBalanceHistories,
  registerGetAccountBalanceHistoriesRoute,
};
