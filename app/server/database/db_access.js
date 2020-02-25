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
router.post('/addDelay', (req, res, next) => {
  (async (req) => {
    const delay = {
      reason: req.body.reason,
      date: req.body.date,
      id: req.user.id,
    };
    await userAbsenceController.checkAbsence(delay.date);
    const result = await userDelayController.addDelay(delay);
    console.log(delay);
    res.send(result);
  })(req);
});

// 欠席登録
router.post('/addAbsence', (req, res, next) => {
  (async (req) => {
    const absence = {
      reason: req.body.reason,
      date: req.body.date,
      id: req.user.id,
    };
    await userDelayController.checkDelay(absence.date);
    const result = await userAbsenceController.addAbsence(absence);
    console.log(absence);
    res.send(result);
  })(req);
});

// 出欠データ登録
router.post('/addAttendance', (req, res, next) => {
  (async (req) => {
    let QRdata;
    if (req.body.QRdata.data.indexOf(process.env.QR_KEY) !== -1) {
      QRdata = JSON.parse(req.body.QRdata.data);
      if (
        typeof QRdata.key != 'undefined' &&
        QRdata.key == process.env.QR_KEY
      ) {
        await userAttendanceController.addAttendance(QRdata).then((data) => {
          if (data.result == 'success') {
            const dt = new Date();
            dt.setHours(dt.getHours() + 9);
            const y = dt.getFullYear();
            const m = ('00' + (dt.getMonth()+1)).slice(-2);
            const d = ('00' + dt.getDate()).slice(-2);
            const date = y + '-' + m + '-' + d;
            userDelayController.checkDelay(date);
            userAbsenceController.checkAbsence(date);
          }
          res.send(data);
        }).catch((err) => {
          res.send({result: 'error'});
        });
      } else {
        res.send({result: 'question'});
      }
    } else {
      res.send({result: 'question'});
    }
  })(req);
});

// 出欠データ取得
router.post('/getAttendance', (req, res, next) => {
  (async (req) => {
    const attendanceData = await userAttendanceController.getAttendance(req);
    const delayData = await userDelayController.getDelay(req);
    const absenceData = await userAbsenceController.getAbsence(req);
    const userData = {
      attendanceData: attendanceData,
      delayData: delayData,
      absenceData: absenceData,
    };
    res.send(userData);
  })(req);
});

// ユーザー出欠データ取得
router.post('/getUserAttendance', (req, res, next) => {
  (async (req) => {
    const attendanceData = await userAttendanceController.getUserAttendance(req);
    const delayData = await userDelayController.getUserDelay(req);
    const absenceData = await userAbsenceController.getUserAbsence(req);
    const userData = {
      attendanceData: attendanceData,
      delayData: delayData,
      absenceData: absenceData,
    };
    res.send(userData);
  })(req);
});

// 遅刻情報削除
router.post('/deleteDelay', (req, res, next) => {
  (async (req) => {
    await userDelayController.deleteDelay(req);
    res.send();
  })(req);
});

// 欠席情報削除
router.post('/deleteAbsence', (req, res, next) => {
  (async (req) => {
    await userAbsenceController.deleteAbsence(req);
    res.send();
  })(req);
});

module.exports = router;
