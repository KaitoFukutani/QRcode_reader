const express = require('express');
const router = new express.Router();
const passport = require('passport');
const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const isReaderAuthenticated = require('../server/util/reader_authenticated');

// QRログインページ
router.get('/signin', function(req, res) {
  systemLogger.info(msg.ACCESS1);
  res.render('reader/reader_signin', {
    title: 'reader-signin',
  });
});

// QRログイン
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/reader/home',
  failureRedirect: '/reader/signin',
  session: true,
}));

// QRトップページ
router.get('/home', isReaderAuthenticated, function(req, res) {
  systemLogger.info(msg.ACCESS3);
  res.render('reader/reader_home', {
    title: 'reader-reader',
  });
});

// QRログアウト
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/reader/signin');
});

module.exports = router;
