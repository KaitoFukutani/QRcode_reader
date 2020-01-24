const express = require('express');
const router = new express.Router();
const usersController = require('../../controllers/user');
const userAttendanceController = require('../../controllers/user_attendance');

// ユーザーログイン認証
router.post('/signin', (req, res, next) => {
  console.log('================');
  console.log(req);
  console.log('================');
});

module.exports = router;