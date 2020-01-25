const { registerCreateAccountRoute } = require('./create-account');
const { registerGetAccountsRoute } = require('./get-accounts');
const { registerUpdateAccountRoute } = require('./update-account');

module.exports = app => {
  registerCreateAccountRoute(app);
  registerGetAccountsRoute(app);
  registerUpdateAccountRoute(app);
};
