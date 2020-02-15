const { verifyAuth } = require('@src/middleware');

/**
 * CreateLink endpoint.
 * Creates link with plaid and syncs its accounts and transactions to our database.
 */
function handleCreateLink() {}

/**
 * Registers and exposes CreateLink endpoint.
 *
 * @param {object} app - given.
 */
function registerCreateLinkRoute(app) {
  app.post('/api/link/create-link', verifyAuth, (_req, _res) => {});
}

module.exports = {
  handleCreateLink,
  registerCreateLinkRoute,
};
