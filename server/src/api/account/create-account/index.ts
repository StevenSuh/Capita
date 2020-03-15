import connect from 'shared/db';
import proto from 'shared/proto';

import { verifyAuth } from '@src/middleware';
import { CustomRequest } from '@src/types/request';

import { convertAccountToProto, convertAccountTypeToString } from '../util';
import validate from './validator';
import { Application } from 'express';

const { CreateAccountRequest, CreateAccountResponse } = proto.server.account;

/**
 * Registers and exposes CreateAccount endpoint.
 *
 * @param app - given.
 */
export function registerCreateAccountRoute(app: Application) {
  app.post(
    '/api/account/create-account',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = CreateAccountRequest.decode(req.raw);

      const response = await handleCreateAccount(request, req.session);
      const responseBuffer = CreateAccountResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * CreateAccount endpoint.
 *
 * @param request - request proto.
 * @param session - session proto.
 * @returns - response proto.
 */
export async function handleCreateAccount(
  request: proto.server.account.ICreateAccountRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const { Account } = await connect();
  let account = Account.create({
    // Provided by client request.
    name: request.name,
    type: convertAccountTypeToString(request.type),
    subtype: request.subtype,
    balanceAvailable: request.balance.available,
    balanceCurrent: request.balance.current,
    balanceLimit: request.balance.limit,
    balanceIsoCurrencyCode: request.balance.isoCurrencyCode,
    // Not provided by client request.
    userId: session.userId,
    officialName: request.name,
    balanceUnofficialCurrencyCode: request.balance.isoCurrencyCode,
    manuallyCreated: true,
    hidden: false,
    needsUpdate: false,
  });
  account = await Account.save(account);

  return CreateAccountResponse.create({
    account: convertAccountToProto(account),
  });
}
