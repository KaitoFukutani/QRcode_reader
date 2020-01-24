const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');
const userAttendanceController = require('../controllers/user_attendance');
const passport = require('passport');

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

// ユーザー作成ページ
router.get('/create', function(req, res, next) {
  res.render('user/user_signup', {
    title: 'user-create',
  });
});

// ユーザー作成
router.post('/new', function(req, res, next) {
  (async () => {
    await userController.addUser(req.body);
    res.redirect('/user/signin');
  })();
});

module.exports = router;
