'use strict';

module.exports = (sequelize, DataTypes) => {
  const Link = sequelize.define(
    'Link',
    {
      userId: DataTypes.INTEGER,
      accessToken: DataTypes.STRING,
      plaidItemId: {
        type: DataTypes.STRING,
        unique: true,
      },
      linkSessionId: DataTypes.STRING,
      plaidInstitutionId: DataTypes.STRING,
      institutionName: DataTypes.STRING,
      institutionUrl: DataTypes.STRING,
      institutionLogo: DataTypes.TEXT,
      ready: DataTypes.BOOLEAN,
      needsUpdate: DataTypes.BOOLEAN,
    },
    {},
  );
  Link.associate = function(models) {
    // associations can be defined here
    Link.belongsTo(models.User);
    Link.hasMany(models.Account, { onDelete: 'CASCADE' });
  };
  return Link;
};
