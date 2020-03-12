import proto from 'shared/proto';
import { Transaction } from 'shared/db/entity/Transaction';

const { Transaction: TransactionProto } = proto.shared;

/**
 * Convert transaction object to client-consumable transaction proto.
 *
 * @param transaction - Queried transaction.
 * @returns - Transaction proto.
 */
export function convertTransactionToProto(transaction: Transaction) {
  return TransactionProto.create({
    id: transaction.id,
    accountId: transaction.accountId,
    name: transaction.name,
    category: transaction.category,
    type: transaction.type,
    amount: transaction.amount,
    isoCurrencyCode: transaction.isoCurrencyCode,
    unofficialCurrencyCode: transaction.unofficialCurrencyCode,
    date: transaction.date,
    note: transaction.note,
    pending: transaction.pending,
    recurring: transaction.recurring,
    manuallyCreated: transaction.manuallyCreated,
    hidden: transaction.hidden,
  });
}
