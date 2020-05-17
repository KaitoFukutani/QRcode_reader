const express = require('express');
const router = new express.Router();
const passport = require('passport');
const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const usersController = require('../controllers/users');
const userDelayController = require('../controllers/user_delay');
const userAbsenceController = require('../controllers/user_absence');
const isMasterAuthenticated = require('../server/util/master_authenticated');

// 管理者ログインページ
router.get('/signin', (req, res) => {
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
router.get('/home', isMasterAuthenticated, (req, res) => {
  (async () => {
    const userList = await usersController.getUser();
    systemLogger.info(msg.ACCESS3);
    res.render('admin/admin_home', {
      title: 'admin-home',
      users: userList,
    });
  })();
});

// ユーザ詳細ページ
router.get('/detail', isMasterAuthenticated, (req, res) => {
  (async () => {
    const reg = new RegExp(/^[0-9]*$/);
    if (req.query.id && reg.test(req.query.id)) {
      const userDetail = await usersController.getDetail(req.query.id);
      if (userDetail.length) {
        res.render('admin/admin_detail', {
          title: 'admin-detail',
          userData: userDetail[0].dataValues,
        });
      } else {
        res.redirect('/admin/home');
      }
    } else {
      res.redirect('/admin/home');
    }
  })();
});

// 遅刻予定一覧
router.get('/delay', isMasterAuthenticated, (req, res) => {
  (async () => {
    const delayList = await userDelayController.getAllDelay();
    const dt = new Date();
    dt.setHours(dt.getHours() + 9);
    const y = dt.getFullYear();
    const m = ('00' + (dt.getMonth()+1)).slice(-2);
    const d = ('00' + dt.getDate()).slice(-2);
    const date = y + '-' + m + '-' + d;
    res.render('admin/admin_delay', {
      title: 'admin-delay',
      delay: delayList,
      today: date,
    });
  })();
});

// 欠席予定一覧
router.get('/absence', isMasterAuthenticated, (req, res) => {
  (async () => {
    const absenceList = await userAbsenceController.getAllAbsence();
    const dt = new Date();
    dt.setHours(dt.getHours() + 9);
    const y = dt.getFullYear();
    const m = ('00' + (dt.getMonth()+1)).slice(-2);
    const d = ('00' + dt.getDate()).slice(-2);
    const date = y + '-' + m + '-' + d;
    res.render('admin/admin_absence', {
      title: 'admin-absence',
      absence: absenceList,
      today: date,
    });
  })();
});

// 管理者ログアウト
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/admin/signin');
});

module.exports = router;
