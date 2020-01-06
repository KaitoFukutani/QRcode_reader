'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_attendance = sequelize.define('user_attendance', {
    user_id: DataTypes.INTEGER,
    attendance_date: DataTypes.DATE,
    absence_flg: DataTypes.INTEGER,
  }, {
    underscored: true,
  });
  user_attendance.associate = function(models) {
    // associations can be defined here
  };
  return user_attendance;
};
