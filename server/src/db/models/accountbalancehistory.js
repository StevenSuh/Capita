'use strict';
module.exports = (sequelize, DataTypes) => {
  const AccountBalanceHistory = sequelize.define(
    'AccountBalanceHistory',
    {
      userId: DataTypes.INTEGER,
      accountId: DataTypes.INTEGER,
      deltaAmount: DataTypes.DECIMAL,
      date: DataTypes.STRING,
    },
    {},
  );
  AccountBalanceHistory.associate = function(models) {
    // associations can be defined here
    AccountBalanceHistory.belongsTo(models.User);
    AccountBalanceHistory.belongsTo(models.Account);
  };
  return AccountBalanceHistory;
};
