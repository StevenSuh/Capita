const moment = require('moment');
const {
  GetAccountBalanceHistoriesRequest,
} = require('shared/proto').server.account_balance_history;
const {
  UpsertAccountBalanceHistoriesRequest,
} = require('shared/proto').server.account_balance_history;
const { Transaction } = require('shared/proto').shared;

const {
  handleGetAccountBalanceHistories,
} = require('@src/api/account-balance-history/get-account-balance-histories');
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

/**
 * Creates a map of transactions sorted by date in ascending order and mapped by
 * account id.
 *
 * @param {object[]} transactions - List of transactions
 * @returns {object} - Map of transactions.
 */
function createDateSortedTransactionMapByAccountId(transactions) {
  const map = {};

  (transactions || []).forEach(transaction => {
    if (!map[transaction.accountId]) {
      map[transaction.accountId] = [];
    }
    map[transaction.accountId].push(transaction);
  });
  // Sorted from oldest date to most recent.
  Object.keys(map).forEach(key =>
    map[key].sort((a, b) => (a.date > b.date ? 1 : -1)),
  );

  return map;
}

/**
 * Checks date and return one year ago date as that is the oldest we are
 * concerned about.
 *
 * @param {string} date - ISO 8601 date string.
 * @returns {string} - Date string.
 */
function normalizeToOneYearMax(date) {
  const oneYearAgo = moment()
    .subtract(1, 'year')
    .format('YYYY-MM-DD');
  return date < oneYearAgo ? oneYearAgo : date;
}

/**
 * Calculates and returns histories by account id.
 *
 * @param {object} oldTransactionMap - Map of old transactions by account id.
 * @param {object} newTransactionMap - Map of new transactions by account id.
 * @returns {object} - Map of histories by account id.
 */
async function calculateAccountBalanceHistoriesByAccountId(
  oldTransactionMap,
  newTransactionMap,
) {
  const accountBalanceHistoriesMap = {};

  await Promise.all(
    Object.keys(newTransactionMap).map(async key => {
      const oldTransactions = oldTransactionMap[key] || [];
      const newTransactions = newTransactionMap[key] || [];
      const minDate =
        oldTransactions[0].date < newTransactions[0].date
          ? oldTransactions[0].date
          : newTransactions[0].date;

      const request = GetAccountBalanceHistoriesRequest.create({
        obfuscatedAccountIds: [obfuscateId(key)],
        startDate: normalizeToOneYearMax(minDate),
      });
      const response = await handleGetAccountBalanceHistories(request);
      const { accountBalanceHistories } = response;

      // Subtract old transaction balances from fetched histories.
      oldTransactions.forEach(transaction => {
        let index = accountBalanceHistories.findIndex(
          item => item.date === transaction.date,
        );
        index = index === -1 ? 0 : index;

        while (index < accountBalanceHistories.length) {
          accountBalanceHistories[index].amount -= transaction.amount;
          index += 1;
        }
      });

      // Add new transaction balances to fetched histories.
      newTransactions.forEach(transaction => {
        let index = accountBalanceHistories.findIndex(
          item => item.date === transaction.date,
        );
        index = index === -1 ? 0 : index;

        while (index < accountBalanceHistories.length) {
          accountBalanceHistories[index].amount += transaction.amount;
          index += 1;
        }
      });

      accountBalanceHistoriesMap[key] = accountBalanceHistories;
    }),
  );

  return accountBalanceHistoriesMap;
}

/**
 * Creates an UpsertAccountBalanceHistoriesRequest with appropriate
 * UpsertingItems based on old/new transactions' amount and date.
 *
 * @param {object[]} oldTransactions - List of old transactions being modified
 *     or deleted.
 * @param {object[]} newTransactions - List of new transactions that could be
 *     empty in the case of deletion.
 * @returns {UpsertAccountBalanceHistoriesRequest} - request proto.
 */
async function createUpsertAccountBalanceHistoriesRequest(
  oldTransactions,
  newTransactions,
) {
  const oldTransactionMap = createDateSortedTransactionMapByAccountId(
    oldTransactions,
  );
  const newTransactionMap = createDateSortedTransactionMapByAccountId(
    newTransactions,
  );
  const accountBalanceHistoriesMap = await calculateAccountBalanceHistoriesByAccountId(
    oldTransactionMap,
    newTransactionMap,
  );

  const upsertingItems = Object.keys(accountBalanceHistoriesMap).reduce(
    (accumulator, key) =>
      accumulator.concat(
        accountBalanceHistoriesMap[key].map(item =>
          UpsertAccountBalanceHistoriesRequest.UpsertingItem.create({
            id: item.id,
            accountId: item.accountId,
            amount: item.amount,
            date: item.date,
          }),
        ),
      ),
    [],
  );

  return UpsertAccountBalanceHistoriesRequest.create({ items: upsertingItems });
}

module.exports = {
  convertTransactionToProto,
  createUpsertAccountBalanceHistoriesRequest,
};
