const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');
const userAttendanceController = require('../controllers/user_attendance');
const passport = require('passport');
const validation = require('../server/util/validation');
const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');


// ユーザー作成ページ
router.get('/', function(req, res, next) {
  res.render('user/user_signup', {
    title: 'user_signup',
  });
});

// ユーザー作成
router.post('/', function(req, res, next) {
  (async () => {
    if (validation.new(req.body)) {
      const check = await userController.addCheck(req.body);
      if (check.length == 0) {
        await userController.addUser(req.body);
        res.redirect('/user/signin');
      } else {
        systemLogger.error(msg.ERROR1);
        res.render('user/user_signup', {
          title: 'user_signup',
          error: '※登録済のメールアドレスです',
        });
      }
    } else {
      systemLogger.error(msg.ERROR1);
      res.render('user/user_signup', {
        title: 'user_signup',
        error: '※無効な入力値です',
      });
    }
  })();
});

  module.exports = router;