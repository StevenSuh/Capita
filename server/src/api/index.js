const accountRoutes = require('@src/route/api/account');
const accountBalanceHistoryRoutes = require('@src/route/api/account-balance-history');
const linkRoutes = require('@src/route/api/link');
const profileRoutes = require('@src/route/api/profile');
const transactionRoutes = require('@src/route/api/transaction');
const userRoutes = require('@src/route/api/user');

module.exports = app => {
  accountRoutes(app);
  accountBalanceHistoryRoutes(app);
  linkRoutes(app);
  profileRoutes(app);
  transactionRoutes(app);
  userRoutes(app);
};
