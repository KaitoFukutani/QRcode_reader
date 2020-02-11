'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    admin_flg: DataTypes.INTEGER,
    reading_machine: DataTypes.INTEGER,
  }, {
    underscored: true,
  });
  user.associate = function(models) {
    // associations can be defined here
    user.hasMany(models.user_attendance, {
      foreignKey: 'user_id',
    });
    user.hasMany(models.user_delay, {
      foreignKey: 'user_id',
    });
    user.hasMany(models.user_absence, {
      foreignKey: 'user_id',
    });
  };
  return user;
};
