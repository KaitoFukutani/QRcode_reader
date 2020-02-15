const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const UserDelay = require('../models').user_delay;
const Sequelize = require('sequelize');

// 遅刻登録
exports.addDelay = (req) => {
  return new Promise((resolve, reject) => {
    UserDelay.findAll({
      where: {
        user_id: req.id,
        delay_date: req.date,
      },
    }).then((data) => {
      systemLogger.info(msg.DB_INFO2);
      if (data.length > 0) {
        UserDelay.update({
          delay_reason: req.reason,
        }, {
          where: {
            user_id: req.id,
            delay_date: req.date,
          },
        }).then((data) => {
          systemLogger.info(msg.DB_INFO3);
          resolve(data);
        }).catch((err) => {
          systemLogger.error(msg.DB_ERROR3 + err);
          reject(err);
        });
      } else {
        UserDelay.create({
          user_id: req.id,
          delay_flg: 1,
          delay_reason: req.reason,
          delay_date: req.date,
        }).then((data) => {
          systemLogger.info(msg.DB_INFO1);
          resolve(data);
        }).catch((err) => {
          systemLogger.error(msg.DB_ERROR1 + err);
          reject(err);
        });
      }
      resolve(data);
    }).catch((err) => {
      systemLogger.error(msg.ERR_5 + err);
      reject(err);
    });
  });
};

// userの遅刻状況取得
exports.getDelay = (req) => {
  const year = req.body.year;
  const month = (req.body.month.length > 1)?req.body.month.length: '0' + req.body.month;
  const date = String(year) + String(month);
  return new Promise((resolve, reject) => {
    UserDelay.findAll({
      where: {
        user_id: req.user.id,
        delay_date: Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('delay_date'), '%Y%m'), date),
      },
    }).then((result) => {
      resolve(result);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR2 + err);
      reject(err);
    });
  });
};
