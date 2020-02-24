const { registerCreateAccountRoute } = require('./create-account');
const { registerGetAccountsRoute } = require('./get-accounts');
const { registerSyncAccountsRoute } = require('./sync-accounts');
const { registerUpdateAccountRoute } = require('./update-account');

module.exports = app => {
  registerCreateAccountRoute(app);
  registerGetAccountsRoute(app);
  registerSyncAccountsRoute(app);
  registerUpdateAccountRoute(app);
};
