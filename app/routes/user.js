const express = require('express');
const router = new express.Router();
const passport = require('passport');
const validation = require('../server/util/validation');
const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const isUserAuthenticated = require('../server/util/user_authenticated');

// ユーザーログインページ
router.get('/signin', function(req, res, next) {
  systemLogger.info(msg.ACCESS1);
  res.render('user/user_signin', {
    title: 'user-signin',
  });
});

// ユーザーログイン
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/user/home',
  failureRedirect: '/user/signin',
  session: true,
}));

// ユーザートップページ
router.get('/home', isUserAuthenticated, function(req, res, next) {
  systemLogger.info(msg.ACCESS3);
  res.render('user/user_home', {
    title: 'user-home',
  });
});

// QRコード生成ページ
router.get('/create_qr', isUserAuthenticated, function(req, res, next) {
  systemLogger.info(msg.ACCESS4);
  console.log(req.session.passport)
  res.render('user/user_createqr', {
    title: 'create-qrcode',
    user_id: req.user.id,
  });
});

// ユーザーログアウト
router.get('/logout', (req, res) => {
  if (req.user.passport) {
    delete req.session.passport;
  }
  res.redirect('/signin');
});

module.exports = router;
