const { registerPlaidWebhooks } = require('./plaid');

module.exports = app => {
  registerPlaidWebhooks(app);
};
