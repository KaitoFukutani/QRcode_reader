const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');
const userAttendanceController = require('../controllers/user_attendance');
const passport = require('passport');
const isMasterAuthenticated = require('../server/util/master_authenticated');

// 管理者ログインページ
router.get('/signin', function(req, res, next) {
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

router.get('/home', isMasterAuthenticated, function(req, res, next) {
  res.render('admin/admin_home', {
    title: 'user-admin',
  });
});

module.exports = router;
