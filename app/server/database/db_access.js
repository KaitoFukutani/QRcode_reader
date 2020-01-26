const express = require('express');
const router = new express.Router();
const log4js = require('log4js');
const msg = require('../../logger/message');
const systemLogger = log4js.getLogger('system');
const usersController = require('../../controllers/user');
const userAttendanceController = require('../../controllers/user_attendance');

// ユーザーログイン認証
router.post('/signin', (req, res, next) => {
  console.log('================');
  console.log(req);
  console.log('================');
  systemLogger.info(msg.ACCESS1);

});

module.exports = router;