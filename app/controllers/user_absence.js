const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const UserAbsence = require('../models').user_absence;
const Users = require('../models').users;
const Sequelize = require('sequelize');

// 欠席登録
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

// 同日登録済み欠席確認
exports.checkAbsence = (req) => {
  return new Promise((resolve, reject) => {
    UserAbsence.findAll({
      where: {
        absence_date: req,
      },
    }).then((result) => {
      systemLogger.info(msg.DB_INFO2);
      if (result.length) {
        UserAbsence.destroy({
          where: {
            id: result[0].dataValues.id,
          },
        }).then((responce) => {
          systemLogger.info(msg.DB_INFO4);
          resolve(responce);
        }).catch((err) => {
          systemLogger.error(msg.DB_ERROR4 + err);
          reject(err);
        });
      } else {
        systemLogger.info(msg.DB_INFO2);
        resolve(result);
      }
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR2 + err);
      reject(err);
    });
  });
};

// userの欠席状況取得
exports.getAbsence = (req) => {
  const year = req.body.year;
  const month = (req.body.month.length > 1)?req.body.month.length: '0' + req.body.month;
  const date = String(year) + String(month);
  return new Promise((resolve, reject) => {
    UserAbsence.findAll({
      where: {
        user_id: req.user.id,
        absence_date: Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('absence_date'), '%Y%m'), date),
      },
    }).then((result) => {
      systemLogger.info(msg.DB_INFO2);
      resolve(result);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR2 + err);
      reject(err);
    });
  });
};

// 遅刻状況全件取得
exports.getAllAbsence = () => {
  return new Promise((resolve, reject) => {
    UserAbsence.findAll({
      raw: true,
      include: [{
        model: Users,
        required: false,
        attributes: [
          'id',
          'name',
        ],
      }],
      order: [['absence_date', 'DESC']],
    }).then((result) => {
      systemLogger.info(msg.DB_INFO2);
      resolve(result);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR2 + err);
      reject(err);
    });
  });
};

// 管理画面userの欠席状況取得
exports.getUserAbsence = (req) => {
  const year = req.body.year;
  const month = (req.body.month.length > 1)?req.body.month.length: '0' + req.body.month;
  const date = String(year) + String(month);
  return new Promise((resolve, reject) => {
    UserAbsence.findAll({
      where: {
        user_id: req.body.id,
        absence_date: Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('absence_date'), '%Y%m'), date),
      },
    }).then((result) => {
      systemLogger.info(msg.DB_INFO2);
      resolve(result);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR2 + err);
      reject(err);
    });
  });
};
