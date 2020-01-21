const express = require('express');
const router = new express.Router();

/* GET home page. */
router.get('/signin', function(req, res, next) {
  res.render('admin/admin_signin', {
    title: 'admin-signin',
  });
});

module.exports = router;
