const accountRoutes = require('@src/api/account');
const accountBalanceHistoryRoutes = require('@src/api/account-balance-history');
const linkRoutes = require('@src/api/link');
const profileRoutes = require('@src/api/profile');
const transactionRoutes = require('@src/api/transaction');
const userRoutes = require('@src/api/user');
const webhooks = require('@src/api/webhook');

module.exports = app => {
  accountRoutes(app);
  accountBalanceHistoryRoutes(app);
  linkRoutes(app);
  profileRoutes(app);
  transactionRoutes(app);
  userRoutes(app);
  webhooks(app);
};
