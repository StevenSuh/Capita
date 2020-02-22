const {
  UpdateProfileRequest,
  UpdateProfileResponse,
} = require('shared/proto').server.profile;

const { Profile } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');
const { DatabaseError } = require('@src/shared/error');
const { unobfuscateId } = require('@src/shared/util');

const validate = require('./validator');

/**
 * UpdateProfile endpoint.
 *
 * @param {UpdateProfileRequest} request - request proto.
 * @returns {UpdateProfileResponse} - response proto.
 */
async function handleUpdateProfile(request) {
  validate(request);

  const updatingProfile = {};
  if (request.name) {
    updatingProfile.name = request.name;
  }
  if (request.obfuscatedAccountIds) {
    updatingProfile.accountIds = request.obfuscatedAccountIds.map(
      unobfuscateId,
    );
  }

  const [affectedRows] = await Profile.update(updatingProfile, {
    where: { id: unobfuscateId(request.obfuscatedId) },
  });
  if (!affectedRows) {
    throw new DatabaseError(
      `An error has occurred while updating profile ${JSON.stringify(request)}`,
    );
  }

  return UpdateProfileResponse.create();
}

/**
 * Registers and exposes UpdateProfile endpoint.
 *
 * @param {object} app - given.
 */
function registerUpdateProfileRoute(app) {
  app.post('/api/profile/update-profile', verifyAuth, async (req, res) => {
    const request = UpdateProfileRequest.decode(req.raw);

    const response = await handleUpdateProfile(request);
    const responseBuffer = UpdateProfileResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleUpdateProfile,
  registerUpdateProfileRoute,
};
