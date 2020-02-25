const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const UserAbsence = require('../models').user_absence;
const Users = require('../models').users;
const sequelize = require('sequelize');
const Sequelize = require('../models').sequelize;

// 欠席登録
exports.addAbsence = (req) => {
  return Sequelize.transaction(async (tx) => {
    const absence = await UserAbsence.findAll({
      where: {
        user_id: req.id,
        absence_date: req.date,
      },
      transaction: tx,
    });
    systemLogger.info(msg.DB_INFO2);
    if (absence.length > 0) {
      await UserAbsence.update({
        absence_reason: req.reason,
      }, {
        where: {
          user_id: req.id,
          absence_date: req.date,
        },
        transaction: tx,
      });
      systemLogger.info(msg.DB_INFO3);
    } else {
      await UserAbsence.create({
        user_id: req.id,
        absence_flg: 1,
        absence_reason: req.reason,
        absence_date: req.date,
        transaction: tx,
      });
      systemLogger.info(msg.DB_INFO1);
    }
  }).then((data) => {
    return data;
  }).catch((err) => {
    systemLogger.error(msg.DB_ERROR5 + err);
    throw new Error(err);
  });
};

// 同日登録済み欠席確認
exports.checkAbsence = (req) => {
  return Sequelize.transaction(async (tx) => {
    const absence = await UserAbsence.findAll({
      where: {
        absence_date: req,
      },
      transaction: tx,
    });
    if (absence.length) {
      await UserAbsence.destroy({
        where: {
          id: absence[0].dataValues.id,
        },
        transaction: tx,
      });
      systemLogger.info(msg.DB_INFO4);
    } else {
      systemLogger.info(msg.DB_INFO2);
      return absence;
    }
  }).then((data) => {
    return data;
  }).catch((err) => {
    systemLogger.error(msg.DB_ERROR5 + err);
    throw new Error(err);
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
        absence_date: sequelize.where(sequelize.fn('DATE_FORMAT', sequelize.col('absence_date'), '%Y%m'), date),
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

// 個人ページ欠席状況取得
exports.getAbsenceList = (req) => {
  return new Promise((resolve, reject) => {
    UserAbsence.findAll({
      where: {
        user_id: req,
      },
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
        absence_date: sequelize.where(sequelize.fn('DATE_FORMAT', sequelize.col('absence_date'), '%Y%m'), date),
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

exports.deleteAbsence = (req) => {
  return new Promise((resolve, reject) => {
    UserAbsence.destroy({
      where: {
        user_id: req.user.id,
        absence_date: req.body.date,
      },
    }).then((responce) => {
      systemLogger.info(msg.DB_INFO4);
      resolve(responce);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR4 + err);
      reject(err);
    });
  });
};
