'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_delay = sequelize.define('user_delay', {
    user_id: DataTypes.INTEGER,
    delay_flg: DataTypes.INTEGER,
    delay_reason: DataTypes.TEXT,
  }, {
    underscored: true,
  });
  user_delay.associate = function(models) {
    // associations can be defined here
    user_delay.belongsTo(models.user, {
      foreignKey: 'user_id',
      targetKey: 'id',
    });
  };
  return user_delay;
};
