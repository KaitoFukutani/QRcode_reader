'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_attendance = sequelize.define('user_attendance', {
    user_id: DataTypes.INTEGER,
    attendance_date: DataTypes.DATE,
    in_flg: DataTypes.INTEGER,
    out_flg: DataTypes.INTEGER,
  }, {
    underscored: true,
  });
  user_attendance.associate = function(models) {
    // associations can be defined here
    user_attendance.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
    });
  };
  return user_attendance;
};
