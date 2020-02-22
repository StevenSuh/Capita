const { PLAID_WEBHOOK } = require('../defs');

/**
 * Registers and exposes UpdateProfile endpoint.
 *
 * @param {object} app - given.
 */
function registerPlaidWebhook(app) {
  app.post(PLAID_WEBHOOK, (req, res) => {
    // JWT verify request

    // Check "webhook_type"

    // Then check "webhook_code"

    // Plaid expects a response of 200 or it will retry the webhook few more times.
    res.status(200).end();
  });
}

module.exports = {
  registerPlaidWebhook,
};
