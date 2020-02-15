const express = require('express');
const router = new express.Router();
const passport = require('passport');
// const validation = require('../server/util/validation');
const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const isUserAuthenticated = require('../server/util/user_authenticated');
const qrCreate = require('../public/javascript/create_qrcode');

// ユーザーログインページ
router.get('/signin', function(req, res, next) {
  (async () => {
    systemLogger.info(msg.ACCESS1);
    res.render('user/user_signin', {
      title: 'user-signin',
    });
  })();
});

// ユーザーログイン
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/user/home',
  failureRedirect: '/user/signin',
  session: true,
}));

// ユーザートップページ
router.get('/home', isUserAuthenticated, function(req, res, next) {
  (async () => {
    systemLogger.info(msg.ACCESS3);
    res.render('user/user_home', {
      title: 'user-home',
    });
  })();
});

// QRコード生成ページ
router.get('/create_qr', isUserAuthenticated, function(req, res, next) {
  (async () => {
    systemLogger.info(msg.ACCESS4);
    res.render('user/user_createqr', {
      title: 'create-qrcode',
      user_id: req.user.id,
    });
  })();
});

// 出席QRコード生成
router.get('/user_inqr', isUserAuthenticated, function(req, res, next) {
  (async () => {
    systemLogger.info(msg.ACCESS5);
    const qrcode = qrCreate.createQrCode(req.user.id, 'in');
    res.render('user/user_qrcode', {
      title: 'qrcode',
      QRcode: qrcode,
    });
  })();
});

// 退席QRコード生成
router.get('/user_outqr', isUserAuthenticated, function(req, res, next) {
  (async () => {
    systemLogger.info(msg.ACCESS5);
    const qrcode = qrCreate.createQrCode(req.user.id, 'out');
    res.render('user/user_qrcode', {
      title: 'qrcode',
      QRcode: qrcode,
    });
  })();
});

// 遅刻登録ページ
router.get('/delay', isUserAuthenticated, function(req, res, next) {
  (async () => {
    systemLogger.info(msg.ACCESS6);
    res.render('user/user_delay', {
      title: 'user-delay',
    });
  })();
});

// 欠席登録ページ
router.get('/absence', isUserAuthenticated, function(req, res, next) {
  (async () => {
    systemLogger.info(msg.ACCESS7);
    res.render('user/user_absence', {
      title: 'user-abscece',
    });
  })();
});

// ユーザーログアウト
router.get('/logout', (req, res) => {
  (async () => {
    req.logout();
    res.redirect('/user/signin');
  })();
});

module.exports = router;
