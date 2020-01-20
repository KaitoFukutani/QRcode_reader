const express = require('express');
const router = new express.Router();

/* ログインページ */
router.get('/login', function(req, res, next) {
  res.render('user/login', {
    title: 'user-login',
  });
});

router.get('/create', function(req, res, next) {
  res.render('user/user_create', {
    title: 'user-create',
  });
});

module.exports = router;
