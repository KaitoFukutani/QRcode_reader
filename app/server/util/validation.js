const validator = require('validator');

// 新規アカウント作成
exports.new = (req) => {
  const regex = new RegExp(/^[0-9a-zA-Z]+$/);
  if (
    validator.isEmail(req.email) &&
    regex.test(validator.escape(req.password))) {
    return true;
  } else {
    return false;
  }
};
