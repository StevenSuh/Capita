const { registerGetLoginStatusRoute } = require('./get-login-status');
const { registerSignInRoute } = require('./sign-in');
const { registerSignUpRoute } = require('./sign-up');

module.exports = app => {
  registerGetLoginStatusRoute(app);
  registerSignInRoute(app);
  registerSignUpRoute(app);
};
