const log4js = require('log4js');
const msg = require('../../logger/message');
const systemLogger = log4js.getLogger('system');
const User = require('../../models').user;
const bcrypt = require('../util/bcrypt');

require('dotenv').config();

systemLogger.info('*************************');
systemLogger.info(msg.INFO_5);

console.log('%%%%%%%%%%%%%%%%%');
console.log(process.env.MASTER_EMAIL);
console.log('%%%%%%%%%%%%%%%%%');
// マスターカウントがなかったらインサート
User.findAll({
  where: {
    email: process.env.MASTER_EMAIL,
  },
}).then((data) => {
  if (data.length == 0) {
    User.create({
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

systemLogger.info(msg.INFO_5);
systemLogger.info('*************************');
