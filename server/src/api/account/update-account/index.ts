import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { verifyAuth } from '@src/middleware';
import { DatabaseError } from '@src/shared/error';
import { CustomRequest } from '@src/types/request';

import { convertAccountTypeToString } from '../util';
import validate from './validator';

const { UpdateAccountRequest, UpdateAccountResponse } = proto.server.account;

/**
 * Registes and exposes UpdateAccount endpoint.
 *
 * @param app - given.
 */
export function registerUpdateAccountRoute(app: Application) {
  app.post(
    '/api/account/update-account',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = UpdateAccountRequest.decode(req.raw);

      const response = await handleUpdateAccount(request, req.session);
      const responseBuffer = UpdateAccountResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * UpdateAccount endpoint.
 *
 * @param request - request proto.
 * @param session - session token proto.
 * @returns - response proto.
 */
export async function handleUpdateAccount(
  request: proto.server.account.IUpdateAccountRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const updatingAccount: {
    mask?: string;
    name?: string;
    subtype?: string;
    type?: string;
    hidden?: boolean;
    needsUpdate?: boolean;
  } = {};
  if (request.mask) {
    updatingAccount.mask = request.mask;
  }
  if (request.name) {
    updatingAccount.name = request.name;
  }
  if (request.subtype) {
    updatingAccount.subtype = request.subtype;
  }
  if (request.type) {
    updatingAccount.type = convertAccountTypeToString(request.type);
  }
  if (request.hidden) {
    updatingAccount.hidden = request.hidden;
  }
  if (request.needsUpdate) {
    updatingAccount.needsUpdate = request.needsUpdate;
  }

  const { Account } = await connect();
  const updateResult = await Account.update(
    {
      id: request.id,
      userId: session.userId,
    },
    updatingAccount,
  );
  if (!updateResult.affected) {
    throw new DatabaseError(
      `An error has occurred while updating account ${JSON.stringify(request)}`,
    );
  }

  return UpdateAccountResponse.create();
}
