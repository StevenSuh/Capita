const { verifyAuth } = require('@src/middleware');

/**
 * UpdateLink endpoint.
 * Updates link with plaid and syncs its accounts and transactions to our database.
 */
function handleUpdateLink() {}

/**
 * Registers and exposes UpdateLink endpoint.
 *
 * @param {object} app - given.
 */
function registerUpdateLinkRoute(app) {
  app.post('/api/link/update-link', verifyAuth, (_req, _res) => {});
}

module.exports = {
  handleUpdateLink,
  registerUpdateLinkRoute,
};
