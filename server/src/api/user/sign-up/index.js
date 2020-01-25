const {
  SignUpRequest,
  SignUpResponse,
} = require('shared/proto/server/user/sign_up');

const { User } = require('@src/db/models');
const { BadRequestError } = require('@src/shared/error');

const { createSessionToken, encryptPassword } = require('../util');
const validate = require('./validator');

/**
 * SignUp endpoint.
 * User can create a new account and a session token if provided with correct information.
 *
 * @param {SignUpRequest} request - request proto.
 * @returns {SignUpResponse} - response proto.
 */
async function handleSignUp(request) {
  validate(request);

  const hashedPassword = encryptPassword(request.password);

  let user = await User.findOne({ where: { email: request.email } });
  if (user) {
    throw new BadRequestError('An account with this email already exists');
  }

  user = await User.create({
    email: request.email,
    password: hashedPassword,
  });

  return SignUpResponse.create({
    sessionToken: createSessionToken(user.id),
  });
}

/**
 * Registers and exposes SignUp endpoint.
 *
 * @param {object} app - given.
 */
function registerSignUpRoute(app) {
  app.post('/api/user/sign-up', async (req, res) => {
    const request = SignUpRequest.decode(req.raw);

    const response = await handleSignUp(request);
    const responseBuffer = SignUpResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleSignUp,
  registerSignUpRoute,
};
