const {
  GetProfilesRequest,
  GetProfilesResponse,
} = require('shared/proto/server/profile/get_profiles').server.profile;
const { SessionToken } = require('shared/proto/server/session_token').server;

const { Profile } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');

const { convertProfileToProto } = require('../util');

/**
 * GetProfiles endpoint.
 * Fetches all profiles related to requesting user.
 *
 * @param {GetProfilesRequest} _request - request proto.
 * @param {SessionToken} session - session proto.
 * @returns {GetProfilesResponse} - response proto.
 */
async function handleGetProfiles(_request, session) {
  const profiles = await Profile.findAll({
    where: { userId: session.userId },
  }).then(results => results.map(convertProfileToProto));

  return GetProfilesResponse.create({ profiles });
}

/**
 * Registers and exposes GetProfiles endpoint.
 *
 * @param {object} app - given.
 */
function registerGetProfilesRoute(app) {
  app.post('/api/profile/get-profiles', verifyAuth, async (req, res) => {
    const request = GetProfilesRequest.decode(req.raw);

    const response = await handleGetProfiles(request, req.session);
    const responseBuffer = GetProfilesResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  handleGetProfiles,
  registerGetProfilesRoute,
};
