const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');
const userAttendanceController = require('../controllers/user_attendance');
const passport = require('passport');
const isMasterAuthenticated = require('../server/util/master_authenticated');

// 管理者ログインページ
router.get('/signin', function(req, res, next) {
  systemLogger.info(msg.ACCESS1);
  res.render('admin/admin_signin', {
    title: 'admin-signin',
  });
});

// 管理者ログイン
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/admin/home',
  failureRedirect: '/admin/signin',
  session: true,
}));

// 管理者トップページ
router.get('/home', isMasterAuthenticated, function(req, res, next) {
  systemLogger.info(msg.ACCESS3);
  res.render('admin/admin_home', {
    title: 'user-admin',
  });
});

// 管理者ログアウト
router.get('/logout', (req, res) => {
  if (req.user.passport) {
    delete req.session.passport;
  }
  res.redirect('/');
});

module.exports = router;
