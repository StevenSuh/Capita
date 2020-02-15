const plaid = require('plaid');

const { plaidClientId, plaidSecret, plaidPublicKey } = require('@src/config');
const { Link } = require('@src/db/models');

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

function getInstitution(institutionId) {
  return new Promise((resolve, reject) => {
    plaidClient.getInstitutionById(institutionId, { include_optional_metadata: true }, (err, res) => {
      if (err) {
        reject(convertPlaidError(err));
      }
      resolve(convertInstitution(res.institution));
    });
  });
}

async function getAccounts(userId) {
  const { accessToken } = await Link.findOne({ where: { userId } });

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

async function getAccountBalances(userId, accountIds) {
  const { accessToken } = await Link.findOne({ where: { userId } });

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
}

async function getTransactions(userId, startDate, endDate, accountIds, count) {
  const { accessToken } = await Link.findOne({ where: { userId } });

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
      plaidClient.getTransactions(accessToken, startDate, endDate, options, callback);
    } else {
      plaidClient.getAllTransactions(accessToken, startDate, endDate, options, callback);
    }
  });
}

module.exports = {
  getAccounts,
  getAccountBalances,
  getLink,
  getInstitution,
  getTransactions,
};
