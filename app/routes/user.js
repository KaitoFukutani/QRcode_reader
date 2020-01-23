const express = require('express');
const router = new express.Router();
const userController = require('../controllers/user');
const userAttendanceController = require('../controllers/user_attendance');

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
  (async () => {
    const result = userController.addUser(req.body);
    console.log('##==========');
    console.log(result);
    console.log('##==========');
    res.redirect('/user/signin');
  })();
});

module.exports = router;
