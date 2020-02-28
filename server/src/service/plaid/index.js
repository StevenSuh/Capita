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
 * Creates a public token (expiring in ~30 minutes) to renew Plaid Link.
 *
 * @param {string} accessToken - Plaid access token.
 * @returns {string} - Plaid public token.
 */
function createPublicToken(accessToken) {
  return new Promise((resolve, reject) => {
    plaidClient.createPublicToken(accessToken, (err, res) => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve(res.public_token);
    });
  });
}

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
 * Invalidates a plaid access token.
 *
 * @param {string} accessToken - Plaid access token.
 * @returns {Promise} - Void if successful, errors out otherwise.
 */
async function invalidateAccessToken(accessToken) {
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
 * @param {string[]} plaidAccountIds - List of plaid account ids.
 * @returns {Promise<object[]>} - List of account balance results by items.
 */
async function getAccountBalances(plaidAccountIds) {
  const accounts = await Account.findAll({
    where: { plaidAccountId: plaidAccountIds },
  });
  const uniqueLinkIds = Array.from(
    new Set(accounts.map(account => account.linkId)),
  );

  const links = await Link.findAll({ where: { id: uniqueLinkIds } });

  return Promise.all(
    links.map(({ accessToken }) => {
      return new Promise((resolve, reject) => {
        const options = {};
        if (plaidAccountIds) {
          options.account_ids = plaidAccountIds;
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
 * @param {string} startDate - Optional date field to note when the transactions should start. In YYYY-MM-DD format.
 * @param {string} endDate - Optional date field to note when the transactions should end. In YYYY-MM-DD format.
 * @param {Array<string>?} plaidAccountIds - List of plaid account ids. Account id/s not associated to `itemId` will be ignored.
 * @param {number?} count - Optional number to limit the number of transactions to get.
 */
async function getTransactions(
  itemId,
  startDate,
  endDate,
  plaidAccountIds,
  count,
) {
  const { accessToken } = await Link.findOne({
    where: { plaidItemId: itemId },
  });

  return new Promise((resolve, reject) => {
    const options = {};
    if (plaidAccountIds) {
      options.account_ids = plaidAccountIds;
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

/**
 * Get webhook verification key when webhook endpoint is hit by Plaid.
 *
 * @param {string} keyId - Plaid obfuscated key id.
 * @returns {Promise<object>} - Key object.
 */
async function getWebhookVerificationKey(keyId) {
  return new Promise((resolve, reject) => {
    plaidClient.getWebhookVerificationKey(keyId, (err, res) => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve(res.key);
    });
  });
}

module.exports = {
  createPublicToken,
  getAccounts,
  getAccountBalances,
  getLink,
  getInstitution,
  getTransactions,
  getWebhookVerificationKey,
  invalidateAccessToken,
};
