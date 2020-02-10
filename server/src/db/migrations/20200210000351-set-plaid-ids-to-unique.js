'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(transaction =>
      Promise.all([
        queryInterface.addConstraint(
          'Links',
          ['plaidItemId'],
          { type: 'unique' },
          transaction,
        ),
        queryInterface.addConstraint(
          'Accounts',
          ['plaidAccountId'],
          { type: 'unique' },
          transaction,
        ),
        queryInterface.addConstraint(
          'Transactions',
          ['plaidTransactionId'],
          { type: 'unique' },
          transaction,
        ),
      ]),
    ),
  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(transaction =>
      Promise.all([
        queryInterface.removeConstraint('Links', 'Links_plaidItemId_uk', {
          transaction,
        }),
        queryInterface.removeConstraint('Accounts', 'Accounts_plaidAccountId_uk', {
          transaction,
        }),
        queryInterface.removeConstraint('Transactions', 'Transactions_plaidTransactionId_uk', {
          transaction,
        }),
      ]),
    ),
};
