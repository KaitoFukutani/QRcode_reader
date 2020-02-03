const log4js = require('log4js');
const msg = require('../../logger/message');

// Log出力タイプ
const systemLogger = log4js.getLogger('system');

/**
 * ログイン状態チェック関数
 * @param {object} req
 * @param {object} res
 * @param {callback} next
 * @return {object}
 */
function isAuthenticated(req, res, next) {
  if (
    req.isAuthenticated() &&
    req.user.status == 'user' &&
    req.user.email == req.session.passport.user.email
  ) {
    systemLogger.info(msg.ERROR3 + req.user.email);
    return next();
  } else {
    res.redirect('/user/logout');
  }
}

module.exports = isAuthenticated;
