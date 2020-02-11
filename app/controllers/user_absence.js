const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const UserAbsence = require('../models').user_absence;

exports.addAbsence = (req) => {
  return new Promise((resolve, reject) => {
    UserAbsence.findAll({
      where: {
        user_id: req.id,
        absence_date: req.date,
      },
    }).then((data) => {
      systemLogger.info(msg.DB_INFO2);
      if (data.length > 0) {
        UserAbsence.update({
          absence_reason: req.reason,
        }, {
          where: {
            user_id: req.id,
            absence_date: req.date,
          },
        }).then((data) => {
          systemLogger.info(msg.DB_INFO3);
          resolve(data);
        }).catch((err) => {
          systemLogger.error(msg.DB_ERROR3 + err);
          reject(err);
        });
      } else {
        UserAbsence.create({
          user_id: req.id,
          absence_flg: 1,
          absence_reason: req.reason,
          absence_date: req.date,
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
      systemLogger.error(msg.DB_ERROR2 + err);
      reject(err);
    });
  });
};
