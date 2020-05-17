const express = require('express');
const router = new express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.redirect('user/signin');
});

module.exports = router;
