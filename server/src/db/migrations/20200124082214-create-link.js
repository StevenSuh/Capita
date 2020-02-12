'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Links', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      accessToken: {
        type: Sequelize.STRING,
      },
      plaidItemId: {
        type: Sequelize.STRING,
      },
      linkSessionId: {
        type: Sequelize.STRING,
      },
      plaidInstitutionId: {
        type: Sequelize.STRING,
      },
      institutionName: {
        type: Sequelize.STRING,
      },
      institutionUrl: {
        type: Sequelize.STRING,
      },
      institutionLogo: {
        type: Sequelize.TEXT,
      },
      ready: {
        type: Sequelize.BOOLEAN,
      },
      needsUpdate: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Links'),
};
