import { Application } from 'express';
import proto from 'shared/proto';

import { verifyAuth } from '@src/middleware';
import { CustomRequest } from '@src/types/request';

const { GetLoginStatusRequest, GetLoginStatusResponse } = proto.server.user;

/**
 * Registers and exposes GetLoginStatus endpoint.
 * A void endpoint to check if session token is valid.
 *
 * @param app - given.
 */
export function registerGetLoginStatusRoute(app: Application) {
  app.post(
    '/api/user/get-login-status',
    verifyAuth,
    (req: CustomRequest, res) => {
      // verifyAuth middleware throws an error if invalid login.
      GetLoginStatusRequest.decode(req.raw);

      const response = GetLoginStatusResponse.create();
      const responseBuffer = GetLoginStatusResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}
