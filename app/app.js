const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const log4js = require('log4js');
const msg = require('./logger/message');
const bcrypt = require('./server/util/bcrypt');
const usersController = require('./controllers/users');
require('dotenv').config();

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const readerRouter = require('./routes/reader');
const signupRouter = require('./routes/user_signup');
const dbRouter = require('./server/database/db_access');

const app = express();

// log4js設定
log4js.configure('./log-config.json');
const logger = log4js.getLogger('system');
const systemLogger = log4js.getLogger('system');
app.use(log4js.connectLogger(logger, {level: 'auto'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/sweetalert2', express.static(path.join(__dirname, '/node_modules/sweetalert2/dist/')));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// セッションミドルウェア設定
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'user',
}));

// ログイン認証
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: true,
}, (req, email, password, done) => {
  process.nextTick(() => {
    (async () => {
      usersController.loginCheck(email).then((result) => {
        if (result.length != 0) {
          result = result[0];
          if (
            result.password &&
            bcrypt.decrypt(password, result.password)
          ) {
            // ログインユーザーがマスターアカウントだった場合
            if (
              result.email == process.env.MASTER_EMAIL &&
              result.admin_flg == 1
            ) {
              systemLogger.info(msg.INFO1);
              return done(null, {
                name: result.name,
                email: result.email,
                id: result.id,
                status: 'master',
              });
            // ログインユーザーがQRreaderだった場合
            } else if (
              result.email == process.env.READER_EMAIL &&
              result.reading_machine == 1
            ) {
              systemLogger.info(msg.INFO3);
              return done(null, {
                name: result.name,
                email: result.email,
                id: result.id,
                status: 'reader',
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
        systemLogger.error(msg.ERROR3);
        return done(null, false, {
          message: 'ログインに失敗しました。',
        });
      });
    })();
  });
}));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/user_signup', signupRouter);
app.use('/reader', readerRouter);
app.use('/db', dbRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
