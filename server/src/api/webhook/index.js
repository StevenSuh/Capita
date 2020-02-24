const { registerPlaidWebhook } = require('./plaid');

module.exports = app => {
  registerPlaidWebhook(app);
};
