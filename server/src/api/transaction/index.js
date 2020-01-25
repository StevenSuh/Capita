const { registerCreateTransactionRoute } = require('./create-transaction');
const { registerDeleteTransactionsRoute } = require('./delete-transactions');
const { registerGetTransactionsRoute } = require('./get-transactions');
const { registerUpdateTransactionRoute } = require('./update-transaction');

module.exports = app => {
  registerCreateTransactionRoute(app);
  registerDeleteTransactionsRoute(app);
  registerGetTransactionsRoute(app);
  registerUpdateTransactionRoute(app);
};
