const {
  AccountBalanceHistory,
} = require('shared/proto/shared/account_balance_history').shared;

const { obfuscateId } = require('@src/shared/util');

/**
 * Convert account_balance_history object to client-consumable account_balance_history proto.
 *
 * @param {object} accountBalanceHistory - Queried account_balance_history.
 * @returns {AccountBalanceHistory} - AccountBalanceHistory proto.
 */
function convertAccountBalanceHistoryToProto(accountBalanceHistory) {
  return AccountBalanceHistory.create({
    obfuscatedAccountId: obfuscateId(accountBalanceHistory.accountId),
    amount: accountBalanceHistory.amount,
    date: accountBalanceHistory.date,
  });
}

module.exports = {
  convertAccountBalanceHistoryToProto,
};
