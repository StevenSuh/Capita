const { registerGetProfilesRoute } = require('./get-profiles');
const { registerCreateProfileRoute } = require('./create-profile');
const { registerDeleteProfileRoute } = require('./delete-profile');
const { registerUpdateProfileRoute } = require('./update-profile');

module.exports = app => {
  registerGetProfilesRoute(app);
  registerCreateProfileRoute(app);
  registerDeleteProfileRoute(app);
  registerUpdateProfileRoute(app);
};
