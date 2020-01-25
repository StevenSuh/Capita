'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
    },
    {},
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Link);
    User.hasMany(models.Profile);
    User.hasMany(models.Account);
    User.hasMany(models.AccountBalanceHistory);
  };
  return User;
};
