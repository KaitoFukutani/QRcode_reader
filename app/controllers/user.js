const Sequelize = require('sequelize');
const log4js = require('log4js');
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
      log.error('Database ERROR: ' + err);
      reject(err);
    });
  });
};
