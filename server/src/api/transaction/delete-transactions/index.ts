import { Application } from 'express';
import connect from 'shared/db';
import { Transaction as TransactionEntity } from 'shared/db/entity/Transaction';
import proto from 'shared/proto';

import { verifyAuth } from '@src/middleware';
import { CustomRequest } from '@src/types/request';

import validate from './validator';

const {
  DeleteTransactionsRequest,
  DeleteTransactionsResponse,
} = proto.server.transaction;
const { ErrorType, ErrorTypeEnum } = proto.shared;

/**
 * Registers and exposes DeleteTransactions endpoint.
 *
 * @param app - given.
 */
export function registerDeleteTransactionsRoute(app: Application) {
  app.post(
    '/api/transaction/delete-transactions',
    verifyAuth,
    async (req: CustomRequest, res) => {
      const request = DeleteTransactionsRequest.decode(req.raw);

      const response = await handleDeleteTransactions(request, req.session);
      const responseBuffer = DeleteTransactionsResponse.encode(
        response,
      ).finish();

      return res.send(responseBuffer);
    },
  );
}

/**
 * DeleteTransactions endpoint.
 * Deletes transactions and returns individual results.
 *
 * @param request - request proto.
 * @param session - session token proto.
 * @returns - response proto.
 */
export async function handleDeleteTransactions(
  request: proto.server.transaction.IDeleteTransactionsRequest,
  session: proto.server.ISessionToken,
) {
  validate(request);

  const { Transaction } = await connect();

  const deletingIds = request.ids;
  const deleteResult = await Transaction.createQueryBuilder()
    .delete()
    .where('id IN (:...ids)', { ids: deletingIds })
    .andWhere('userId = :userId', { userId: session.userId })
    .returning('*')
    .execute();
  const deletedTransactions = deleteResult.raw as TransactionEntity[];

  const results = deletingIds.map(id =>
    DeleteTransactionsResponse.Result.create({
      id,
      errorType: deletedTransactions.find(transaction => transaction.id === id)
        ? undefined // success
        : ErrorType.create({
            type: ErrorTypeEnum.DATABASE,
          }),
    }),
  );

  return DeleteTransactionsResponse.create({ results });
}
