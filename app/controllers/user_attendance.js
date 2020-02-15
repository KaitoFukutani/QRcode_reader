const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const UserAttendance = require('../models').user_attendance;
const Sequelize = require('sequelize');
const op = Sequelize.Op;

exports.addAttendance = (req) => {
  return new Promise((resolve, reject) => {
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
    UserAttendance.findAll({
      where: {
        user_id: req.id,
        in_flg: inFlg,
        out_flg: outFlg,
        attendance_date: {
          [op.gt]: date,
        },
      },
    }).then((data) => {
      if (!data.length) {
        UserAttendance.create({
          user_id: req.id,
          attendance_date: dt,
          in_flg: inFlg,
          out_flg: outFlg,
        }).then((data) => {
          resolve({result: 'success'});
        }).catch((err) => {
          reject(err);
        });
      } else {
        resolve({result: 'warning'});
      }
    }).catch((err) => {
      reject(err);
    });
  });
};

// userの出席状況取得
exports.getAttendance = (req) => {
  return new Promise((resolve, reject) => {
    UserAttendance.findAll({
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

