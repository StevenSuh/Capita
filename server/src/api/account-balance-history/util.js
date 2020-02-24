const { AccountBalanceHistory } = require('shared/proto').shared;

/**
 * Convert account_balance_history object to client-consumable account_balance_history proto.
 *
 * @param {object} accountBalanceHistory - Queried account_balance_history.
 * @returns {AccountBalanceHistory} - AccountBalanceHistory proto.
 */
function convertAccountBalanceHistoryToProto(accountBalanceHistory) {
  return AccountBalanceHistory.create({
    accountId: accountBalanceHistory.accountId,
    deltaAmount: accountBalanceHistory.deltaAmount,
    date: accountBalanceHistory.date,
  });
}

module.exports = {
  convertAccountBalanceHistoryToProto,
};
