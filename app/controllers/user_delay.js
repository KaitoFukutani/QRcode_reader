const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const UserDelay = require('../models').user_delay;
const Users = require('../models').users;
const Sequelize = require('sequelize');
const sequelize = require('../models').sequelize;

// 遅刻登録
exports.addDelay = (req) => {
  return sequelize.transaction(async (tx) => {
    const delay = await UserDelay.findAll({
      where: {
        user_id: req.id,
        delay_date: req.date,
      },
      transaction: tx,
    });
    systemLogger.info(msg.DB_INFO2);
    if (delay.length > 0) {
      await UserDelay.update({
        delay_reason: req.reason,
      }, {
        where: {
          user_id: req.id,
          delay_date: req.date,
        },
        transaction: tx,
      });
      systemLogger.info(msg.DB_INFO3);
    } else {
      await UserDelay.create({
        user_id: req.id,
        delay_flg: 1,
        delay_reason: req.reason,
        delay_date: req.date,
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
exports.checkDelay = (req) => {
  return sequelize.transaction(async (tx) => {
    const delay = await UserDelay.findAll({
      where: {
        delay_date: req,
      },
      transaction: tx,
    });
    if (delay.length) {
      await UserDelay.destroy({
        where: {
          id: delay[0].dataValues.id,
        },
        transaction: tx,
      });
      systemLogger.info(msg.DB_INFO4);
    } else {
      systemLogger.info(msg.DB_INFO2);
      return delay;
    }
  }).then((data) => {
    return data;
  }).catch((err) => {
    systemLogger.error(msg.DB_ERROR5 + err);
    throw new Error(err);
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
      systemLogger.info(msg.DB_INFO2);
      resolve(result);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR2 + err);
      reject(err);
    });
  });
};

// 遅刻状況全件取得
exports.getAllDelay = () => {
  return new Promise((resolve, reject) => {
    UserDelay.findAll({
      raw: true,
      include: [{
        model: Users,
        required: false,
        attributes: [
          'id',
          'name',
        ],
      }],
      order: [['delay_date', 'DESC']],
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
exports.getUserDelayList = (req) => {
  return new Promise((resolve, reject) => {
    UserDelay.findAll({
      where: {
        user_id: req,
      },
      order: [['delay_date', 'DESC']],
    }).then((result) => {
      systemLogger.info(msg.DB_INFO2);
      resolve(result);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR2 + err);
      reject(err);
    });
  });
};


// 管理画面userの遅刻状況取得
exports.getUserDelay = (req) => {
  const year = req.body.year;
  const month = (req.body.month.length > 1)?req.body.month.length: '0' + req.body.month;
  const date = String(year) + String(month);
  return new Promise((resolve, reject) => {
    UserDelay.findAll({
      where: {
        user_id: req.body.id,
        delay_date: Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('delay_date'), '%Y%m'), date),
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

exports.deleteDelay = (req) => {
  return new Promise((resolve, reject) => {
    UserDelay.destroy({
      where: {
        user_id: req.user.id,
        delay_date: req.body.date,
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
