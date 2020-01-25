'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Accounts', {
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
      linkId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Links',
          key: 'id',
        },
      },
      plaidAccountId: {
        type: Sequelize.STRING,
      },
      mask: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      officialName: {
        type: Sequelize.STRING,
      },
      subtype: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      verificationStatus: {
        type: Sequelize.STRING,
      },
      balanceAvailable: {
        type: Sequelize.DECIMAL,
      },
      balanceCurrent: {
        type: Sequelize.DECIMAL,
      },
      balanceLimit: {
        type: Sequelize.DECIMAL,
      },
      balanceIsoCurrencyCode: {
        type: Sequelize.STRING,
      },
      balanceUnofficialCurrencyCode: {
        type: Sequelize.STRING,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Accounts'),
};
