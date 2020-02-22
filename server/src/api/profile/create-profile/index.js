const {
  CreateProfileRequest,
  CreateProfileResponse,
} = require('shared/proto').server.profile;
const { SessionToken } = require('shared/proto').server;

const { Profile } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');

const { convertProfileToProto } = require('../util');
const validate = require('./validator');

/**
 * CreateProfile endpoint.
 * Creates and returns a new profile.
 *
 * @param {CreateProfileRequest} request - request proto.
 * @param {SessionToken} session - session token proto.
 * @returns {CreateProfileResponse} - response proto.
 */
async function handleCreateProfile(request, session) {
  validate(request);

  const profile = await Profile.create({
    userId: session.userId,
    name: request.name,
    accountIds: request.accountIds,
  }).then(convertProfileToProto);

  return CreateProfileResponse.create({ profile });
}

/**
 * Registers and exposes CreateProfile endpoint.
 *
 * @param {object} app - given.
 */
function registerCreateProfileRoute(app) {
  app.post('/api/profile/create-profile', verifyAuth, async (req, res) => {
    const request = CreateProfileRequest.decode(req.raw);

    const response = await handleCreateProfile(request, req.session);
    const responseBuffer = CreateProfileResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleCreateProfile,
  registerCreateProfileRoute,
};
