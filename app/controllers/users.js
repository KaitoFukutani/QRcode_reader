const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const Users = require('../models').users;

// ユーザ登録
exports.addUser = (req) => {
  return new Promise((resolve, reject) => {
    Users.create({
      name: req.name,
      email: req.email,
      password: req.password,
    }).then((data) => {
      resolve(data);
    }).catch((err) => {
      systemLogger.error(msg.DB_ERROR1 + err);
      reject(err);
    });
  });
};

// ユーザ存在チェック
exports.userCheck = (req) => {
  return new Promise((resolve, reject) => {
    Users.findAll({
      where: {
        email: req.email,
      },
    }).then((data) => {
      resolve(data);
    }).catch((err) => {
      systemLogger.error(msg.ERR_5 + err);
      reject(err);
    });
  });
};

// ログインチェック
exports.loginCheck = (req) => {
  return new Promise((resolve, reject) => {
    Users.findAll({
      where: {
        email: req,
      },
    }).then((data) => {
      resolve(data);
    }).catch((err) => {
      systemLogger.error(msg.ERR_5 + err);
      reject(err);
    });
  });
};

// ユーザ情報取得
exports.getUser = () => {
  return new Promise((resolve, reject) => {
    Users.findAll({
    }).then((data) => {
      resolve(data);
    }).catch((err) => {
      systemLogger.error(msg.ERR_5 + err);
      reject(err);
    });
  });
};

exports.getDetail = (req) => {
  return new Promise((resolve, reject) => {
    Users.findAll({
      where: {
        id: req,
      },
    }).then((data) => {
      resolve(data[0].dataValues);
    }).catch((err) => {
      systemLogger.error(msg.ERR_5 + err);
      reject(err);
    });
  });
};
