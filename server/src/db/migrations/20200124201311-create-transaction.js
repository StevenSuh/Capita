'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      accountId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Accounts',
          key: 'id',
        },
      },
      plaidTransactionId: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.DECIMAL,
      },
      isoCurrencyCode: {
        type: Sequelize.STRING,
      },
      unofficialCurrencyCode: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.STRING,
      },
      note: {
        type: Sequelize.STRING,
      },
      pending: {
        type: Sequelize.BOOLEAN,
      },
      recurring: {
        type: Sequelize.BOOLEAN,
      },
      manuallyCreated: {
        type: Sequelize.BOOLEAN,
      },
      hidden: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Transactions'),
};
