'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_absence = sequelize.define('user_absence', {
    user_id: DataTypes.INTEGER,
    absence_flg: DataTypes.INTEGER,
    absence_reason: DataTypes.TEXT,
  }, {
    underscored: true,
  });
  user_absence.associate = function(models) {
    // associations can be defined here
    user_absence.belongsTo(models.user, {
      foreignKey: 'user_id',
      targetKey: 'id',
    });
  };
  return user_absence;
};
