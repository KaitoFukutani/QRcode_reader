const log4js = require('log4js');
const msg = require('../logger/message');
const systemLogger = log4js.getLogger('system');
const User = require('../models').user;

exports.addUser = (req) => {
  return new Promise((resolve, reject) => {
    User.create({
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

exports.addCheck = (req) => {
  return new Promise((resolve, reject) => {
    User.findAll({
      where: {
        email: req.email,
      },
    }).then((data) => {
      resolve(data);
    }).catch((err) => {
      systemLogger.error(logMsg.ERR_5 + err);
      reject(err);
    });
  });
};
