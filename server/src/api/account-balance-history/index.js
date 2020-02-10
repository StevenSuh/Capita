const { registerGetAccountBalanceHistoriesRoute } = require('./get-account-balance-histories');

module.exports = app => {
  registerGetAccountBalanceHistoriesRoute(app);
};
