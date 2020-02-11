'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addIndex('AccountBalanceHistories', ['accountId', 'date'], {
      unique: true,
    }),
  down: (queryInterface, Sequelize) =>
    queryInterface.removeIndex(
      'AccountBalanceHistories',
      'account_balance_histories_account_id_date',
    ),
};
