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

/**
 * Convert transaction object to client-consumable transaction proto.
 *
 * @param {object} transaction - Queried transaction.
 * @returns {Transaction} - Transaction proto.
 */
function convertTransactionToProto(transaction) {
  return Transaction.create({
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

  if (!date) {
    return oneYearAgo;
  }
  return date < oneYearAgo ? oneYearAgo : date;
}

/**
 * Create missing account balance histories within one year span in given histories.
 *
 * @param {object[]} histories - Existing account balance histories.
 * @param {number} accountId - The target account's id in question.
 * @returns {object[]} - Updated account balance histories list.
 */
function createMissingHistoriesWithinOneYear(histories, accountId) {
  const now = moment();
  const oneYearAgo = now.subtract(1, 'year');
  let diff = now.diff(oneYearAgo, 'days');

  const newestHistory =
    histories.length > 0 ? histories[histories.length - 1] : null;

  const newHistories = [];
  let deltaAmount = 0;

  if (!newestHistory) {
    for (let i = 1; i <= diff; i += 1) {
      newHistories.push({
        accountId,
        deltaAmount,
        date: oneYearAgo.add(i, 'days').format('YYYY-MM-DD'),
      });
    }
    return newHistories;
  }

  const newestDate = moment(newestHistory.date, 'YYYY-MM-DD');
  diff = now.diff(newestDate, 'days');

  if (diff) {
    deltaAmount = newestHistory.deltaAmount;
    for (let i = 1; i <= diff; i += 1) {
      newHistories.push({
        accountId,
        deltaAmount,
        date: newestDate.add(diff, 'days').format('YYYY-MM-DD'),
      });
    }
    return histories.concat(newHistories);
  }

  return histories;
}

/**
 * Function factory for updating account balance histories from transactions.
 *
 * @param {object} accountBalanceHistoriesMap - Account balance history map by account ids.
 * @param {boolean} isDeleting - Is deleting transactions or not.
 * @returns {Function} - Function.
 */
function calculateHistoriesFromTransactions(
  accountBalanceHistoriesMap,
  isDeleting,
) {
  return transaction => {
    if (!accountBalanceHistoriesMap[transaction.accountId]) {
      accountBalanceHistoriesMap[
        transaction.accountId
      ] = createMissingHistoriesWithinOneYear([], transaction.accountId);
    }
    const currAccountBalanceHistories =
      accountBalanceHistoriesMap[transaction.accountId];

    let index = currAccountBalanceHistories.findIndex(
      item => item.date === transaction.date,
    );
    index = index === -1 ? 0 : index;

    while (index < currAccountBalanceHistories.length) {
      currAccountBalanceHistories[index].deltaAmount = isDeleting
        ? currAccountBalanceHistories[index].deltaAmount - transaction.amount
        : currAccountBalanceHistories[index].deltaAmount + transaction.amount;
      index += 1;
    }
  };
}

/**
 * Calculates and returns histories by account id.
 *
 * @param {object[]} oldTransactions - List of old transactions.
 * @param {object[]} newTransactions - List of new transactions.
 * @returns {object[]} - Calculated histories.
 */
async function calculateAccountBalanceHistories(
  oldTransactions,
  newTransactions,
) {
  const accountIds = Array.from(
    new Set(
      oldTransactions.concat(newTransactions).map(({ accountId }) => accountId),
    ),
  );

  const minDate = oldTransactions
    .concat(newTransactions)
    .reduce((accumulatingDate, transaction) => {
      const currMinDate = normalizeToOneYearMax(transaction.date);
      return currMinDate < accumulatingDate ? currMinDate : accumulatingDate;
    }, normalizeToOneYearMax(null));

  const request = GetAccountBalanceHistoriesRequest.create({
    accountIds,
    startDate: minDate,
  });

  // Gets histories from oldest to most recent.
  const { accountBalanceHistories } = await handleGetAccountBalanceHistories(
    request,
  );
  const accountBalanceHistoriesMap = {};
  accountBalanceHistories.forEach(item => {
    if (!accountBalanceHistoriesMap[item.accountId]) {
      accountBalanceHistoriesMap[item.accountId] = [];
    }
    accountBalanceHistoriesMap[item.accountId].push(item);
  });

  // Create empty histories within one year if missing.
  Object.keys(accountBalanceHistoriesMap).forEach(accountId => {
    accountBalanceHistoriesMap[accountId] = createMissingHistoriesWithinOneYear(
      accountBalanceHistoriesMap[accountId],
      accountId,
    );
  });

  // Update the fetched/created account balance histories.
  oldTransactions.forEach(
    calculateHistoriesFromTransactions(
      accountBalanceHistoriesMap,
      /* isDeleting= */ true,
    ),
  );
  newTransactions.forEach(
    calculateHistoriesFromTransactions(
      accountBalanceHistoriesMap,
      /* isDeleting= */ false,
    ),
  );

  return accountBalanceHistories;
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
  const accountBalanceHistories = await calculateAccountBalanceHistories(
    oldTransactions,
    newTransactions,
  );

  const upsertingItems = accountBalanceHistories.map(item =>
    UpsertAccountBalanceHistoriesRequest.UpsertingItem.create({
      id: item.id,
      accountId: item.accountId,
      deltaAmount: item.deltaAmount,
      date: item.date,
    }),
  );

  return UpsertAccountBalanceHistoriesRequest.create({ items: upsertingItems });
}

module.exports = {
  convertTransactionToProto,
  createUpsertAccountBalanceHistoriesRequest,
};
