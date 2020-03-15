import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { verifyAuth } from '@src/middleware';
import { createPublicToken } from '@src/service/plaid';
import { CustomRequest } from '@src/types/request';

import validate from './validator';

const {
  GetLinksPublicTokenRequest,
  GetLinksPublicTokenResponse,
} = proto.server.link;
const { SessionToken } = proto.server;

/**
 * Registers and exposes GetLinksPublicToken endpoint.
 *
 * @param app - given.
 */
export function registerGetLinksPublicTokenRoute(app: Application) {
  app.post(
    '/api/link/get-links-public-token',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = GetLinksPublicTokenRequest.decode(req.raw);

      const response = await handleGetLinksPublicToken(request, req.session);
      const responseBuffer = GetLinksPublicTokenResponse.encode(
        response,
      ).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * GetLinksPublicToken endpoint.
 *
 * @param request - request proto.
 * @param session - session token proto.
 */
export async function handleGetLinksPublicToken(
  request: proto.server.link.IGetLinksPublicTokenRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const { Account, Link } = await connect();

  let { linkId } = request;
  if (!linkId && !request.plaidItemId) {
    const account = await Account.findOne({
      where: {
        id: request.accountId,
        userId: session.userId,
      },
    });
    linkId = account.linkId;
  }

  const whereQuery: { id?: number; userId: number; plaidItemId?: string } = {
    userId: session.userId,
  };
  if (linkId) {
    whereQuery.id = linkId;
  }
  if (request.plaidItemId) {
    whereQuery.plaidItemId = request.plaidItemId;
  }

  const link = await Link.findOne({ where: whereQuery });
  const publicToken = await createPublicToken(link.accessToken);

  return GetLinksPublicTokenResponse.create({ plaidPublicToken: publicToken });
}
