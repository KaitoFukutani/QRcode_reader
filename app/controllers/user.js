const Sequelize = require('sequelize');
const logMsg = require('log4js').getLogger('categories');
const msg = require('../logger/ message');
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
      logMsg.error(msg.DB_ERROR1 + err);
      reject(err);
    });
  });
};
