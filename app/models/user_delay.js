'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_delay = sequelize.define('user_delay', {
    user_id: DataTypes.INTEGER,
    delay_flg: DataTypes.INTEGER,
    delay_reason: DataTypes.TEXT,
    delay_date: DataTypes.DATE,
  }, {
    underscored: true,
    freezeTableName: true,
  });
  user_delay.associate = function(models) {
    // associations can be defined here
    user_delay.belongsTo(models.users, {
      foreignKey: 'user_id',
      targetKey: 'id',
    });
  };
  return user_delay;
};
