const plaid = require('plaid');

const { plaidClientId, plaidSecret, plaidPublicKey } = require('@src/config');
const { Account, Link } = require('@src/db/models');

const {
  convertAccount,
  convertInstitution,
  convertItem,
  convertPlaidError,
  convertTransaction,
} = require('./util');

const plaidEnv =
  process.env.NODE_ENV === 'production'
    ? plaid.environments.production
    : plaid.environments.development;

const plaidClient = new plaid.Client(
  plaidClientId,
  plaidSecret,
  plaidPublicKey,
  plaidEnv,
  { version: '2020-01-26' },
);

/**
 * Get plaid link based on public token.
 *
 * @param {string} publicToken - Validated token given after successful link by user.
 * @returns {Promise<object>} - Object of access token and the item id.
 */
function getLink(publicToken) {
  return new Promise((resolve, reject) => {
    plaidClient.exchangePublicToken(publicToken, (err, res) => {
      if (err) {
        reject(convertPlaidError(err));
      }

      const accessToken = res.access_token;
      const itemId = res.item_id;

      resolve({ accessToken, itemId });
    });
  });
}

/**
 * Invalidates a plaid access token by item.
 *
 * @param {string} itemId - Plaid item id.
 * @returns {Promise} - Void if successful, errors out otherwise.
 */
async function invalidateItem(itemId) {
  const { accessToken } = await Link.findOne({
    where: { plaidItemId: itemId },
  });

  if (!accessToken) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    plaidClient.invalidateAccessToken(accessToken, err => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve();
    });
  });
}

/**
 * Get plaid institution information.
 *
 * @param {string} institutionId - Plaid institution id.
 * @returns {Promise<object>} - Converted plaid institution.
 */
function getInstitution(institutionId) {
  return new Promise((resolve, reject) => {
    plaidClient.getInstitutionById(
      institutionId,
      { include_optional_metadata: true },
      (err, res) => {
        if (err) {
          reject(convertPlaidError(err));
        }
        resolve(convertInstitution(res.institution));
      },
    );
  });
}

/**
 * Get all accounts associated to item.
 *
 * @param {string} itemId - Plaid item id.
 * @returns {Promise<object>} - Object of accounts and item.
 */
async function getAccounts(itemId) {
  const { accessToken } = await Link.findOne({
    where: { plaidItemId: itemId },
  });

  return new Promise((resolve, reject) => {
    plaidClient.getAccounts(accessToken, (err, res) => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve({
        accounts: res.accounts.map(convertAccount),
        item: convertItem(res.item),
      });
    });
  });
}

/**
 * Get account balances requested.
 *
 * @param {string[]} accountIds - List of plaid account ids.
 * @returns {Promise<object[]>} - List of account balance results by items.
 */
async function getAccountBalances(accountIds) {
  const accounts = await Account.findAll({
    where: { plaidAccountId: accountIds },
  });
  const uniqueLinkIds = Array.from(
    new Set(accounts.map(account => account.linkId)),
  );

  const links = await Link.findAll({ where: { id: uniqueLinkIds } });

  return Promise.all(
    links.map(({ accessToken }) => {
      return new Promise((resolve, reject) => {
        const options = {};
        if (accountIds) {
          options.account_ids = accountIds;
        }

        plaidClient.getBalance(accessToken, options, (err, res) => {
          if (err) {
            reject(convertPlaidError(err));
          }
          resolve({
            accounts: res.accounts.map(convertAccount),
            item: convertItem(res.item),
          });
        });
      });
    }),
  );
}

/**
 * Get all transactions associated to item.
 *
 * @param {string} itemId - Plaid item id.
 * @param {string?} startDate - Optional date field to note when the transactions should start. In YYYY-MM-DD format.
 * @param {string?} endDate - Optional date field to note when the transactions should end. In YYYY-MM-DD format.
 * @param {Array<string>?} accountIds - List of plaid account ids. Account id/s not associated to `itemId` will be ignored.
 * @param {number?} count - Optional number to limit the number of transactions to get.
 */
async function getTransactions(itemId, startDate, endDate, accountIds, count) {
  const { accessToken } = await Link.findOne({
    where: { plaidItemId: itemId },
  });

  return new Promise((resolve, reject) => {
    const options = {};
    if (accountIds) {
      options.account_ids = accountIds;
    }
    const callback = (err, res) => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve({
        accounts: res.accounts.map(convertAccount),
        item: convertItem(res.item),
        totalTransactions: res.total_transactions,
        transactions: res.transactions.map(convertTransaction),
      });
    };

    if (count) {
      options.count = count;
      plaidClient.getTransactions(
        accessToken,
        startDate,
        endDate,
        options,
        callback,
      );
    } else {
      plaidClient.getAllTransactions(
        accessToken,
        startDate,
        endDate,
        options,
        callback,
      );
    }
  });
}

module.exports = {
  getAccounts,
  getAccountBalances,
  getLink,
  getInstitution,
  getTransactions,
  invalidateItem,
};
