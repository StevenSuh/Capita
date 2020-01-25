'use strict';

module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define(
    'Profile',
    {
      userId: DataTypes.INTEGER,
      accountIds: DataTypes.ARRAY(DataTypes.INTEGER),
      name: DataTypes.STRING,
    },
    {},
  );
  Profile.associate = function(models) {
    // associations can be defined here
    Profile.belongsTo(models.User);
  };
  return Profile;
};
