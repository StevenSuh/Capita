const { Op } = require('sequelize');
const {
  GetProfilesRequest,
  GetProfilesResponse,
} = require('shared/proto').server.profile;
const { SessionToken } = require('shared/proto').server;

const { Profile } = require('@src/db/models');
const { verifyAuth } = require('@src/middleware');

const { convertProfileToProto } = require('../util');
const validate = require('./validator');

/**
 * GetProfiles endpoint.
 * Fetches all profiles related to requesting user.
 *
 * @param {GetProfilesRequest} request - request proto.
 * @param {SessionToken} session - session proto.
 * @returns {GetProfilesResponse} - response proto.
 */
async function handleGetProfiles(request, session) {
  validate(request);

  const whereQuery = { userId: session.userId };
  if (request.profileIds) {
    whereQuery.id = request.profileIds;
  }
  if (request.accountIds) {
    whereQuery.accountIds = {
      [Op.overlap]: request.accountIds,
    };
  }

  const profiles = await Profile.findAll({ where: whereQuery }).then(results =>
    results.map(convertProfileToProto),
  );

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
