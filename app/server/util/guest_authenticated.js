const log4js = require('log4js');
// const logMsg = require('../../logger/message');

// // Log出力タイプ
// const systemLogger = log4js.getLogger('system');

/**
 * ログイン状態チェック関数
 * @param {object} req
 * @param {object} res
 * @param {callback} next
 * @return {object}
 */
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.status == 'user') {
    // systemLogger.info(logMsg.INFO_7 + req.user.email);
    if (req.user.auth == req.session.passport.user.auth) {
      return next();
    }
  } else {
    res.redirect('/user/logout');
  }
}

module.exports = isAuthenticated;
