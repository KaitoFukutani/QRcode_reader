const express = require('express');
const router = new express.Router();

/* ログインページ */
router.get('/signin', function(req, res, next) {
  res.render('user/user_signin', {
    title: 'user-signin',
  });
});

router.get('/create', function(req, res, next) {
  res.render('user/user_signup', {
    title: 'user-create',
  });
});

router.post('/new', function(req, res, next) {
  console.log('==========');
  console.log(req.body);
  console.log('==========');
  res.redirect('/user/user_signin');
});

module.exports = router;
