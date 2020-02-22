const {
  CreateProfileRequest,
  CreateProfileResponse,
} = require('shared/proto').server.profile;

const { Profile } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const { unobfuscateId } = require('@src/shared/util');

const { convertProfileToProto } = require('../util');
const validate = require('./validator');

/**
 * CreateProfile endpoint.
 * Creates and returns a new profile.
 *
 * @param {CreateProfileRequest} request - request proto.
 * @returns {CreateProfileResponse} - response proto.
 */
async function handleCreateProfile(request) {
  validate(request);

  const profile = await Profile.create({
    name: request.name,
    accountIds: request.obfuscatedAccountIds.map(unobfuscateId),
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

    const response = await handleCreateProfile(request);
    const responseBuffer = CreateProfileResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleCreateProfile,
  registerCreateProfileRoute,
};
