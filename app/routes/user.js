const express = require('express');
const router = new express.Router();
const passport = require('passport');
const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const userDelayController = require('../controllers/user_delay');
const userAbsenceController = require('../controllers/user_absence');
const isUserAuthenticated = require('../server/util/user_authenticated');
const qrCreate = require('../public/javascript/create_qrcode');

// ユーザーログインページ
router.get('/signin', (req, res) => {
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
router.get('/home', isUserAuthenticated, (req, res) => {
  systemLogger.info(msg.ACCESS3);
  res.render('user/user_home', {
    title: 'user-home',
  });
});

// QRコード生成ページ
router.get('/create_qr', isUserAuthenticated, (req, res) => {
  systemLogger.info(msg.ACCESS4);
  res.render('user/user_createqr', {
    title: 'create-qrcode',
    user_id: req.user.id,
  });
});

// 出席QRコード生成
router.get('/user_inqr', isUserAuthenticated, (req, res) => {
  systemLogger.info(msg.ACCESS5);
  const qrcode = qrCreate.createQrCode(req.user.id, 'in');
  res.render('user/user_qrcode', {
    title: 'qrcode',
    QRcode: qrcode,
  });
});

// 退席QRコード生成
router.get('/user_outqr', isUserAuthenticated, (req, res) => {
  systemLogger.info(msg.ACCESS5);
  const qrcode = qrCreate.createQrCode(req.user.id, 'out');
  res.render('user/user_qrcode', {
    title: 'qrcode',
    QRcode: qrcode,
  });
});

// 遅刻登録ページ
router.get('/delay', isUserAuthenticated, (req, res) => {
  (async () => {
    systemLogger.info(msg.ACCESS6);
    res.render('user/user_delay', {
      title: 'user-delay',
    });
  })();
});

// 欠席登録ページ
router.get('/absence', isUserAuthenticated, (req, res) => {
  systemLogger.info(msg.ACCESS7);
  res.render('user/user_absence', {
    title: 'user-abscece',
  });
});

// 遅刻登録ページ
router.get('/delaylist', isUserAuthenticated, (req, res) => {
  (async () => {
    systemLogger.info(msg.ACCESS8);
    const userDelayList = await userDelayController.getUserDelayList(req.user.id);
    const dt = new Date();
    dt.setHours(dt.getHours() + 9);
    const y = dt.getFullYear();
    const m = ('00' + (dt.getMonth()+1)).slice(-2);
    const d = ('00' + dt.getDate()).slice(-2);
    const date = y + '-' + m + '-' + d;
    res.render('user/user_delaylist', {
      title: 'user-delay',
      userDelay: userDelayList,
      today: date,
      title: 'user-delay',
    });
  })();
});

// 欠席登録ページ
router.get('/absencelist', isUserAuthenticated, (req, res) => {
  (async () => {
    systemLogger.info(msg.ACCESS8);
    const userAbsenceList = await userAbsenceController.getAbsenceList(req.user.id);
    const dt = new Date();
    dt.setHours(dt.getHours() + 9);
    const y = dt.getFullYear();
    const m = ('00' + (dt.getMonth()+1)).slice(-2);
    const d = ('00' + dt.getDate()).slice(-2);
    const date = y + '-' + m + '-' + d;
    res.render('user/user_absencelist', {
      title: 'user-abscece',
      userAbsence: userAbsenceList,
      today: date,
    });
  })();
});

// ユーザーログアウト
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/user/signin');
});

module.exports = router;
