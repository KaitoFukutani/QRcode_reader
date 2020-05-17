const log4js = require('log4js');
const msg = require('../../logger/message');
const systemLogger = log4js.getLogger('system');
const Users = require('../../models').users;
const bcrypt = require('../util/bcrypt');

require('dotenv').config();

systemLogger.info('*************************');
systemLogger.info(msg.INFO_5);

console.log(process.env.MASTER_EMAIL);
// マスターカウントがなかったらインサート
Users.findAll({
  where: {
    email: process.env.MASTER_EMAIL,
  },
}).then((data) => {
  if (data.length == 0) {
    Users.create({
      name: process.env.MASTER_NAME,
      email: process.env.MASTER_EMAIL,
      password: bcrypt.encrypt(process.env.MASTER_PASS),
      admin_flg: 1,
      reading_machine: 0,
    });
  }
}).catch((err) => {
  console.error(err);
});

console.log(process.env.READER_EMAIL);
// マスターカウントがなかったらインサート
Users.findAll({
  where: {
    email: process.env.READER_EMAIL,
  },
}).then((data) => {
  if (data.length == 0) {
    Users.create({
      name: process.env.READER_EMAIL,
      email: process.env.READER_EMAIL,
      password: bcrypt.encrypt(process.env.READER_PASS),
      admin_flg: 0,
      reading_machine: 1,
    });
  }
}).catch((err) => {
  console.error(err);
});

systemLogger.info(msg.INFO_5);
systemLogger.info('*************************');
