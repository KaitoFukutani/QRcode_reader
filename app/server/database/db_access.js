const express = require('express');
const router = new express.Router();
const log4js = require('log4js');
const msg = require('../../logger/message');
const systemLogger = log4js.getLogger('system');
const usersController = require('../../controllers/users');
const userDelayController = require('../../controllers/user_delay');
const userAbsenceController = require('../../controllers/user_absence');

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

// ログイン認証ユーザー取得
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

// ログイン認証ユーザー取得
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

// ログイン認証ユーザー取得
router.post('/test', (req, res, next) => {
  res.send({result: 'success'});
});

module.exports = router;
