const { registerCreateLinkRoute } = require('./create-link');
const { registerUpdateLinkRoute } = require('./update-link');

module.exports = app => {
  registerCreateLinkRoute(app);
  registerUpdateLinkRoute(app);
};
