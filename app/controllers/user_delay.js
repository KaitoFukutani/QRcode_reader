const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const UserDelay = require('../models').user_delay;

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
  return new Promise((resolve, reject) => {
    UserDelay.findAll({
      where: {
        user_id: req.id,
      },
    }).then((result) => {
      resolve(result);
    }).catch((err) => {
      systemLogger.console.error(msg.DB_ERROR2);
      reject(err);
    });
  });
};
