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
    User.hasMany(models.Link, { onDelete: 'CASCADE' });
    User.hasMany(models.Profile, { onDelete: 'CASCADE' });
    User.hasMany(models.Account, { onDelete: 'CASCADE' });
    User.hasMany(models.AccountBalanceHistory, { onDelete: 'CASCADE' });
  };
  return User;
};
