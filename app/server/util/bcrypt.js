const bcrypt = require('bcrypt');

// 暗号化
exports.encrypt = (password) => {
  return bcrypt.hashSync(password, 5);
};

// 照会
exports.decrypt = (password, reqest) => {
  return bcrypt.compareSync(password, reqest);
};

