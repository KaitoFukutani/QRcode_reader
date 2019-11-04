const express = require('express');
const router = new express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('user/login', {title: 'ユーザーログイン画面'});
});

module.exports = router;
