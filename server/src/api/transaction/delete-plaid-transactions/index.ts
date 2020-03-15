import connect from 'shared/db';
import { Transaction as TransactionEntity } from 'shared/db/entity/Transaction';
import proto from 'shared/proto';

import validate from './validator';

const { DeletePlaidTransactionsResponse } = proto.server.transaction;
const { ErrorType, ErrorTypeEnum } = proto.shared;

/**
 * DeletePlaidTransactions endpoint.
 * Deletes transactions and returns individual results.
 *
 * @param request - request proto.
 * @returns - response proto.
 */
export async function handleDeletePlaidTransactions(
  request: proto.server.transaction.IDeletePlaidTransactionsRequest,
) {
  validate(request);

  const { Transaction } = await connect();

  const deletingIds = request.plaidTransactionIds;
  const deleteResult = await Transaction.createQueryBuilder()
    .delete()
    .where('plaidTransactionId IN (:...ids)', { ids: deletingIds })
    .returning('plaidTransactionId')
    .execute();

  const deletedTransactions = deleteResult.raw as TransactionEntity[];
  const deletedIds = deletedTransactions.map(
    ({ plaidTransactionId }) => plaidTransactionId,
  );

  // TODO: Update account_balance_history accordingly.

  const results = deletingIds.map(id =>
    DeletePlaidTransactionsResponse.Result.create({
      plaidTransactionId: id,
      errorType: deletedIds.includes(id)
        ? undefined // success
        : ErrorType.create({
            type: ErrorTypeEnum.DATABASE,
          }),
    }),
  );

  return DeletePlaidTransactionsResponse.create({ results });
}
