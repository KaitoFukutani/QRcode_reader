const express = require('express');
const router = new express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('admin/login', {
    title: 'admin-login',
  });
});

module.exports = router;
