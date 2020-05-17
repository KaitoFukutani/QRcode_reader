'use strict';
module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    admin_flg: DataTypes.INTEGER,
    reading_machine: DataTypes.INTEGER,
  }, {
    underscored: true,
    freezeTableName: true,
  });
  users.associate = function(models) {
    // associations can be defined here
    users.hasMany(models.user_attendance, {
      foreignKey: 'user_id',
    });
    users.hasMany(models.user_delay, {
      foreignKey: 'user_id',
    });
    users.hasMany(models.user_absence, {
      foreignKey: 'user_id',
    });
  };
  return users;
};
