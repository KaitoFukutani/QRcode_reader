const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');
const userAttendanceController = require('../controllers/user_attendance');
const passport = require('passport');

// 管理者ログインページ
router.get('/signin', function(req, res, next) {
  res.render('admin/admin_signin', {
    title: 'admin-signin',
  });
});

// 管理者ログイン
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/user/signin',
  failureRedirect: '/admin/signin',
  session: true,
}));

module.exports = router;
