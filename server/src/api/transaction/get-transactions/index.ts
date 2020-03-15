import { Application } from 'express';
import connect from 'shared/db';
import proto from 'shared/proto';
import { In } from 'typeorm';

import { verifyAuth } from '@src/middleware';
import { CustomRequest } from '@src/types/request';

import { convertTransactionToProto } from '../util';
import validate from './validator';

const {
  GetTransactionsRequest,
  GetTransactionsResponse,
} = proto.server.transaction;

/**
 * Registers and exposes GetTransactions endpoint.
 *
 * @param app - given.
 */
export function registerGetTransactionsRoute(app: Application) {
  app.post(
    '/api/transaction/get-transactions',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = GetTransactionsRequest.decode(req.raw);

      const response = await handleGetTransactions(request, req.session);
      const responseBuffer = GetTransactionsResponse.encode(response).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * GetTransactions endpoint.
 * Could filter results by matching accountIds or transactioinIds in the query if supplied in request.
 *
 * @param request - request proto.
 * @param session - session proto.
 * @returns - response proto.
 */
export async function handleGetTransactions(
  request: proto.server.transaction.IGetTransactionsRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const accountIds = request.accountIds || [];
  const transactionIds = request.transactionIds || [];

  const whereQueries = [];
  const defaultQuery = { userId: session.userId };

  if (transactionIds.length || accountIds.length) {
    if (transactionIds.length) {
      whereQueries.push({ ...defaultQuery, transactionId: In(transactionIds) });
    }
    if (accountIds.length) {
      whereQueries.push({ ...defaultQuery, accountId: In(accountIds) });
    }
  }
  if (!whereQueries.length) {
    whereQueries.push(defaultQuery);
  }

  const { Transaction } = await connect();
  const transactions = await Transaction.find({
    where: whereQueries,
  }).then(results => results.map(convertTransactionToProto));

  return GetTransactionsResponse.create({ transactions });
}
