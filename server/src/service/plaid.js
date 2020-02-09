const plaid = require('plaid');

const { plaidClientId, plaidSecret, plaidPublicKey } = require('@src/config');

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

module.exports = plaidClient;
