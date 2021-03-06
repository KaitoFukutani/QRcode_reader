const express = require('express');
const router = new express.Router();
const usersController = require('../controllers/users');
const validation = require('../server/util/validation');
const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const bcrypt = require('../server/util/bcrypt');

// ユーザー作成ページ
router.get('/', (req, res) => {
  systemLogger.info(msg.ACCESS2);
  res.render('user/user_signup', {
    title: 'user_signup',
  });
});

// ユーザー作成
router.post('/', (req, res) => {
  (async () => {
    if (validation.new(req.body)) {
      const check = await usersController.userCheck(req.body);
      if (check) {
        const insertData = {
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.encrypt(req.body.password),
        };
        await usersController.addUser(insertData);
        res.redirect('/user/signin');
      } else {
        systemLogger.error(msg.ERROR1);
        res.render('user/user_signup', {
          title: 'user_signup',
          error: '※登録済のメールアドレスです',
        });
      }
    } else {
      systemLogger.error(msg.ERROR1);
      res.render('user/user_signup', {
        title: 'user_signup',
        error: '※無効な入力値です',
      });
    }
  })();
});

module.exports = router;
