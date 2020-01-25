'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(transaction =>
      Promise.all([
        queryInterface.addColumn(
          'Users',
          'enableNotifications',
          Sequelize.BOOLEAN,
          { transaction },
        ),
        queryInterface.addColumn(
          'Users',
          'enableTransactionAlert',
          Sequelize.BOOLEAN,
          { transaction },
        ),
        queryInterface.addColumn(
          'Users',
          'enableMonthlyReport',
          Sequelize.BOOLEAN,
          { transaction },
        ),
      ]),
    ),
  down: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(transaction =>
      Promise.all([
        queryInterface.removeColumn('Users', 'enableNotifications', {
          transaction,
        }),
        queryInterface.removeColumn('Users', 'enableTransactionAlert', {
          transaction,
        }),
        queryInterface.removeColumn('Users', 'enableMonthlyReport', {
          transaction,
        }),
      ]),
    ),
};
