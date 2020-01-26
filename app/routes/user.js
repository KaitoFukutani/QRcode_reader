const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');
const userAttendanceController = require('../controllers/user_attendance');
const passport = require('passport');
const validation = require('../server/util/validation');
const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');

// ユーザーログインページ
router.get('/signin', function(req, res, next) {
  res.render('user/user_signin', {
    title: 'user-signin',
  });
});

// ユーザーログイン
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/user/signin',
  failureRedirect: '/user/signin',
  session: true,
}));

module.exports = router;
