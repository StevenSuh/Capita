const {
  GetLoginStatusRequest,
  GetLoginStatusResponse,
} = require('shared/proto/server/user/get_login_status').server.user;

const { verifyAuth } = require('@src/middleware');

/**
 * Registers and exposes GetLoginStatus endpoint.
 * A void endpoint to check if session token is valid.
 *
 * @param {object} app - given.
 */
function registerGetLoginStatusRoute(app) {
  app.post('/api/user/get-login-status', verifyAuth, (req, res) => {
    // verifyAuth middleware throws an error if invalid login.
    GetLoginStatusRequest.decode(req.raw);

    const response = GetLoginStatusResponse.create();
    const responseBuffer = GetLoginStatusResponse.encode(response).finish();

    return res.send(responseBuffer);
  });
}

module.exports = {
  registerGetLoginStatusRoute,
};
