import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';

import { handleGetAccounts } from '@src/api/account/get-accounts';
import { verifyAuth } from '@src/middleware';
import { BadRequestError } from '@src/shared/error';
import { CustomRequest } from '@src/types/request';

import { convertTransactionToProto } from '../util';
import validate from './validator';

const {
  CreateTransactionRequest,
  CreateTransactionResponse,
} = proto.server.transaction;
const { GetAccountsRequest } = proto.server.account;

/**
 * CreateTransaction endpoint.
 * Creates and returns a new transaction.
 *
 * @param request - request proto.
 * @param session - session proto.
 * @returns - response proto.
 */
export async function handleCreateTransaction(
  request: proto.server.transaction.ICreateTransactionRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const getAccountsRequest = GetAccountsRequest.create({
    accountIds: [request.accountId],
  });
  const getAccountsResponse = await handleGetAccounts(
    getAccountsRequest,
    session,
  );

  const account = (getAccountsResponse.accounts || [])[0];
  if (!account) {
    throw new BadRequestError(
      'Cannot create a transaction that does not belong to an account',
    );
  }

  const { Transaction } = await connect();
  let transaction = Transaction.create({
    // Provided by client request.
    accountId: account.id,
    name: request.name,
    category: request.category,
    type: request.type,
    amount: request.amount,
    date: request.date,
    note: request.note,
    recurring: request.recurring,
    // Not provided by client request.
    userId: session.userId,
    isoCurrencyCode: account.balance.isoCurrencyCode,
    unofficialCurrencyCode: account.balance.unofficialCurrencyCode,
    manuallyCreated: true,
  });
  transaction = await Transaction.save(transaction);

  return CreateTransactionResponse.create({
    transaction: convertTransactionToProto(transaction),
  });
}

/**
 * Registers and exposes CreateTransaction endpoint.
 *
 * @param app - given.
 */
export function registerCreateTransactionRoute(app: Application) {
  app.post(
    '/api/transaction/create-transaction',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = CreateTransactionRequest.decode(req.raw);

      const response = await handleCreateTransaction(request, req.session);
      const responseBuffer = CreateTransactionResponse.encode(
        response,
      ).finish();

      return res.send(responseBuffer);
    },
  );
}
