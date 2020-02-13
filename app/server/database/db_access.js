const express = require('express');
const router = new express.Router();
const log4js = require('log4js');
const msg = require('../../logger/message');
const systemLogger = log4js.getLogger('system');
const usersController = require('../../controllers/users');
const userAttendanceController = require('../../controllers/user_attendance');
const userDelayController = require('../../controllers/user_delay');
const userAbsenceController = require('../../controllers/user_absence');
require('dotenv').config();

// ログイン認証ユーザー取得
router.post('/signin', (req, res, next) => {
  (async (req) => {
    systemLogger.info(msg.ACCESS1);
    usersController.userCheck(req.body).then((data) => {
      res.send(data);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR2 + err);
      res.send(err);
    });
  })(req);
});

// 遅刻登録
router.post('/add_delay', (req, res, next) => {
  const delay = {
    reason: req.body.reason,
    date: req.body.date,
    id: req.user.id,
  };
  const result = userDelayController.addDelay(delay);
  console.log(delay);
  res.send(result);
});

// 欠席登録
router.post('/add_absence', (req, res, next) => {
  const absence = {
    reason: req.body.reason,
    date: req.body.date,
    id: req.user.id,
  };
  const result = userAbsenceController.addAbsence(absence);
  console.log(absence);
  res.send(result);
});

// 出欠データ登録
router.post('/add_attendance', (req, res, next) => {
  (async (req) => {
    const QRdata = JSON.parse(req.body.QRdata.data);
    if (
      typeof QRdata.key != 'undefined' &&
      QRdata.key == process.env.QR_KEY
    ) {
      await userAttendanceController.addAttendance(QRdata).then((data) => {
        res.send(data);
      }).catch((err) => {
        res.send({result: 'error'});
      });
    } else {
      res.send({result: 'question'});
    }
  })(req);
});

module.exports = router;
