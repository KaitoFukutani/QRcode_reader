const express = require('express');
const router = new express.Router();
const log4js = require('log4js');
const msg = require('../../logger/message');
const systemLogger = log4js.getLogger('system');
const usersController = require('../../controllers/user');
const userAttendanceController = require('../../controllers/user_attendance');

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

module.exports = router;
