const { Transaction } = require('shared/proto/shared/transaction').shared;

const { obfuscateId } = require('@src/shared/util');

/**
 * Convert transaction object to client-consumable transaction proto.
 *
 * @param {object} transaction - Queried transaction.
 * @returns {Transaction} - Transaction proto.
 */
function convertTransactionToProto(transaction) {
  return Transaction.create({
    obfuscatedId: obfuscateId(transaction.id),
    obfuscatedAccountId: obfuscateId(transaction.accountId),
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

module.exports = {
  convertTransactionToProto,
};
