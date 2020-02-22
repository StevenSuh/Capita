const {
  DeleteProfileRequest,
  DeleteProfileResponse,
} = require('shared/proto').server.profile;

const { Profile } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');

const validate = require('./validator');

/**
 * DeleteProfile endpoint.
 * Deletes a profile.
 *
 * @param {DeleteProfileRequest} request - request proto.
 * @returns {DeleteProfileResponse} - response proto.
 */
async function handleDeleteProfile(request) {
  validate(request);

  await Profile.destroy({
    where: {
      id: request.id,
    },
  });

  return DeleteProfileResponse.create();
}

/**
 * Registers and exposes DeleteProfile endpoint.
 *
 * @param {object} app - given.
 */
function registerDeleteProfileRoute(app) {
  app.post('/api/profile/delete-profile', verifyAuth, async (req, res) => {
    const request = DeleteProfileRequest.decode(req.raw);

    const response = await handleDeleteProfile(request);
    const responseBuffer = DeleteProfileResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleDeleteProfile,
  registerDeleteProfileRoute,
};
