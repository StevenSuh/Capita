'use strict';

module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    'Account',
    {
      userId: DataTypes.INTEGER,
      linkId: DataTypes.INTEGER,
      plaidAccountId: {
        type: DataTypes.STRING,
        unique: true,
      },
      mask: DataTypes.STRING,
      name: DataTypes.STRING,
      officialName: DataTypes.STRING,
      subtype: DataTypes.STRING,
      type: DataTypes.STRING,
      verificationStatus: DataTypes.STRING,
      balanceAvailable: DataTypes.DECIMAL,
      balanceCurrent: DataTypes.DECIMAL,
      balanceLimit: DataTypes.DECIMAL,
      balanceIsoCurrencyCode: DataTypes.STRING,
      balanceUnofficialCurrencyCode: DataTypes.STRING,
      manuallyCreated: DataTypes.BOOLEAN,
      hidden: DataTypes.BOOLEAN,
    },
    {},
  );
  Account.associate = function(models) {
    // associations can be defined here
    Account.belongsTo(models.User);
    Account.belongsTo(models.Link);
    Account.hasMany(models.Transaction, { onDelete: 'CASCADE' });
    Account.hasMany(models.AccountBalanceHistory, { onDelete: 'CASCADE' });
  };
  return Account;
};
