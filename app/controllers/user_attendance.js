const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const UserAttendance = require('../models').user_attendance;
const Sequelize = require('sequelize');
const sequelize = require('../models').sequelize;
const op = Sequelize.Op;

// 出欠情報登録
exports.addAttendance = (req) => {
  return sequelize.transaction(async (tx) => {
    const dt = new Date();
    dt.setHours(dt.getHours() + 9);
    const y = dt.getFullYear();
    const m = ('00' + (dt.getMonth()+1)).slice(-2);
    const d = ('00' + dt.getDate()).slice(-2);
    const date = y + '-' + m + '-' + d;
    let inFlg;
    let outFlg;
    if (req.status == 'in') {
      inFlg = 1;
      outFlg = 0;
    } else if (req.status == 'out') {
      inFlg = 0;
      outFlg = 1;
    }
    const attendance = await UserAttendance.findAll({
      where: {
        user_id: req.id,
        in_flg: inFlg,
        out_flg: outFlg,
        attendance_date: {
          [op.gt]: date,
        },
      },
      transaction: tx,
    });
    if (!attendance.length) {
      await UserAttendance.create({
        user_id: req.id,
        attendance_date: dt,
        in_flg: inFlg,
        out_flg: outFlg,
        transaction: tx,
      });
      message = {result: 'success'}
    } else {
      message = {result: 'warning'};
    }
  }).then((data) => {
    return message;
  }).catch((err) => {
    systemLogger.error(msg.DB_ERROR5 + err);
    throw new Error(err);
  });
};

// userの出席状況取得
exports.getAttendance = (req) => {
  const year = req.body.year;
  const month = (req.body.month.length > 1)?req.body.month.length: '0' + req.body.month;
  const date = String(year) + String(month);
  return new Promise((resolve, reject) => {
    UserAttendance.findAll({
      where: {
        user_id: req.user.id,
        attendance_date: Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('attendance_date'), '%Y%m'), date),
      },
    }).then((result) => {
      resolve(result);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR2 + err);
      reject(err);
    });
  });
};

// 管理画面userの出席状況取得
exports.getUserAttendance = (req) => {
  const year = req.body.year;
  const month = (req.body.month.length > 1)?req.body.month.length: '0' + req.body.month;
  const date = String(year) + String(month);
  return new Promise((resolve, reject) => {
    UserAttendance.findAll({
      where: {
        user_id: req.body.id,
        attendance_date: Sequelize.where(Sequelize.fn('DATE_FORMAT', Sequelize.col('attendance_date'), '%Y%m'), date),
      },
    }).then((result) => {
      resolve(result);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR2 + err);
      reject(err);
    });
  });
};
