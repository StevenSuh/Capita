const { SignInRequest, SignInResponse } = require('shared/proto').server.user;

const { User } = require('@src/db/models');
const { InvalidLoginError } = require('@src/shared/error');

const { confirmPassword, createSessionToken } = require('../util');
const validate = require('./validator');

/**
 * SignIn endpoint.
 * User can login and given a session token if provided with correct credentials.
 *
 * @param {SignInRequest} request - request proto.
 * @returns {SignInResponse} - response proto.
 * @throws {InvalidLoginError}
 */
async function handleSignIn(request) {
  validate(request);

  const user = await User.findOne({ where: { email: request.email } });
  if (!user) {
    throw new InvalidLoginError('Invalid email or password');
  }

  const isValidPassword = await confirmPassword(
    user.password,
    request.password,
  );
  if (!isValidPassword) {
    throw new InvalidLoginError('Invalid email or password');
  }

  return SignInResponse.create({
    sessionToken: createSessionToken(user.id),
  });
}

/**
 * Registers and exposes SignIn endpoint.
 *
 * @param {object} app - given.
 */
function registerSignInRoute(app) {
  app.post('/api/user/sign-in', async (req, res) => {
    const request = SignInRequest.decode(req.raw);

    const response = await handleSignIn(request);
    const responseBuffer = SignInResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleSignIn,
  registerSignInRoute,
};
