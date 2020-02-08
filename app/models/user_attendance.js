'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_attendance = sequelize.define('user_attendance', {
    user_id: DataTypes.INTEGER,
    attendance_date: DataTypes.DATE,
    in_flg: DataTypes.INTEGER,
    out_flg: DataTypes.INTEGER,
    delay_flg: DataTypes.INTEGER,
    absence_flg: DataTypes.INTEGER,
    absence_reason: DataTypes.STRING,
  }, {
    underscored: true,
  });
  user_attendance.associate = function(models) {
    // associations can be defined here
  };
  return user_attendance;
};
