'use strict';

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    'Transaction',
    {
      userId: DataTypes.INTEGER,
      accountId: DataTypes.INTEGER,
      plaidTransactionId: DataTypes.STRING,
      name: DataTypes.STRING,
      category: DataTypes.STRING,
      type: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      isoCurrencyCode: DataTypes.STRING,
      unofficialCurrencyCode: DataTypes.STRING,
      date: DataTypes.STRING,
      note: DataTypes.STRING,
      pending: DataTypes.BOOLEAN,
      recurring: DataTypes.BOOLEAN,
      manuallyCreated: DataTypes.BOOLEAN,
      hidden: DataTypes.BOOLEAN,
    },
    {},
  );
  Transaction.associate = function(models) {
    // associations can be defined here
    Transaction.belongsTo(models.User);
    Transaction.belongsTo(models.Account);
  };
  return Transaction;
};
