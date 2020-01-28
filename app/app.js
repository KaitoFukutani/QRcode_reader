const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const fetch = require('node-fetch');
const log4js = require('log4js');
const msg = require('./logger/message');
const systemLogger = log4js.getLogger('system');
const bcrypt = require('./server/util/bcrypt');
require('dotenv').config();

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const signupRouter = require('./routes/user_signup');
const dbRouter = require('./server/database/db_access');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/user_signup', signupRouter);
app.use('/db', dbRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// セッション設定
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'user',
  httpOnly: true,
  secure: false,
}));

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// ログイン認証
app.use(passport.initialize());
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  fetch('http://localhost:3000/db/signin', {
    method: 'POST',
    body: JSON.stringify({
      email: email,
      password: password,
    }),
    headers: {'Content-Type': 'application/json'},
  }).then((data) => {
    return data.json();
  }).then((result) => {
    if (result.length != 0) {
      result = result[0];
      if (
        result.password &&
        bcrypt.decrypt(password, result.password)
      ) {
        // ログインユーザーがマスターアカウントだった場合
        if (result.email == process.env.MASTER_EMAIL) {
          systemLogger.info(msg.INFO1);
          return done(null, {
            name: result.name,
            email: result.email,
            id: result.id,
            status: 'master',
          });
        // ログインユーザーが一般ユーザーだった場合
        } else {
          systemLogger.info(msg.INFO2);
          return done(null, {
            name: result.name,
            email: result.email,
            id: result.id,
            status: 'user',
          });
        }
      } else {
        // password不一致
        systemLogger.error(msg.ERROR3);
        return done(null, false, {
          message: 'パスワードが正しくありません。',
        });
      }
    } else {
      // 該当ユーザー無し
      systemLogger.error(msg.ERROR3);
      return done(null, false, {
        message: 'メールアドレスが正しくありません。',
      });
    }
  }).catch((err) => {
    systemLogger.error(msg.ERROR2 + err);
  });
}));

module.exports = app;
