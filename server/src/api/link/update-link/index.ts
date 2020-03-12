import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { verifyAuth } from '@src/middleware';
import { createPublicToken } from '@src/service/plaid';
import { CustomRequest } from '@src/types/request';

import validate from './validator';

const { UpdateLinkRequest, UpdateLinkResponse } = proto.server.link;
const { SessionToken } = proto.server;

/**
 * UpdateLink endpoint.
 * Updates link with plaid.
 *
 * @param request - request proto.
 * @param session - session token proto.
 */
export async function handleUpdateLink(
  request: proto.server.link.IUpdateLinkRequest,
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

  return UpdateLinkResponse.create({ plaidPublicToken: publicToken });
}

/**
 * Registers and exposes UpdateLink endpoint.
 *
 * @param app - given.
 */
export function registerUpdateLinkRoute(app: Application) {
  app.post(
    '/api/link/update-link',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = UpdateLinkRequest.decode(req.raw);

      const response = await handleUpdateLink(request, req.session);
      const responseBuffer = UpdateLinkResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}
