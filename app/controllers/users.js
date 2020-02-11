const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const Users = require('../models').users;

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
