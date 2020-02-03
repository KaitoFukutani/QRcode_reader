const express = require('express');
const router = new express.Router();
const passport = require('passport');
const isMasterAuthenticated = require('../server/utils/master_authenticated');

// api関数を読み込む
const getAllUsers = require('../server/api/get_user');
const getCheckLesson = require('../server/api/get_check_lesson');
const getProgress = require('../server/api/get_progress');
const getMongo = require('../server/api/get_mongo');
const getSearch = require('../server/api/get_search');
const getType = require('../server/api/get_type');

// ログイン画面
router.get('/login', (req, res, next) => {
  res.render('master/master_login',
      {title: 'login'});
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/master/home',
  failureRedirect: '/master/login',
  session: true,
}));

// ログアウト
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/master/login');
});

// ホーム画面
router.get('/home', isMasterAuthenticated, (req, res, next) => {
  // 全ユーザー取得関数
  const getData = async () => {
    const result = await getAllUsers.api();
    // viewに値を渡す
    res.render('master/master_home', {
      title: 'home',
      email: req.user.email,
      id: req.user.id,
      name: req.user.name,
      users: result,
    });
  };
  getData();
});

// 生徒進捗確認画面
router.get('/progress', isMasterAuthenticated, (req, res) => {
  if (req.query.user) {
    // 完了未完了レッスン情報取得関数
    const getData = async () => {
      const result = await getCheckLesson.api(req);
      const progress = await getProgress.api(req.query.user);
      // 対象ユーザー情報取得関数
      const userData = await getAllUsers.user(req.query.user);
      // レッスン一覧をviewに渡す
      res.render('master/master_progresslist', {
        title: 'progresslist',
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        lessons: result,
        check_id: req.query.user,
        user: userData,
        html: progress.HTML,
        css: progress.CSS,
        jquery: progress.jQuery,
        js: progress.JavaScript,
        mysql: progress.MySQL,
        php: progress.PHP,
        java: progress.Java,
      });
    };
    getData();
  // 生徒進捗確認画面一覧
  } else if (req.query.id) {
    // 全ユーザー取得関数
    const offset = {offset: req.query.id};
    const order = {
      column: req.query.column,
      order: req.query.order,
    };
    const getData = async () => {
      const count = await getMongo.syncMongoUserCount();
      const userResult = await getAllUsers.range(offset, order);
      const lessonResult = await getCheckLesson.lessonCount();
      const statusList = await getAllUsers.getStatus();
      // viewに値を渡す
      res.render('master/master_progress', {
        title: 'progress',
        email: req.user.email,
        id: req.user.id,
        name: req.user.name,
        users: userResult,
        allCount: lessonResult.count,
        usercount: count.count,
        status: statusList,
        datetype: 'iso',
        column: req.query.column,
        order: req.query.order,
      });
    };
    getData();
  } else {
    res.render('master/master_home', {
      title: 'home',
      email: req.user.email,
      id: req.user.id,
      name: req.user.name,
      // users: result,
    });
  }
});

// 検索結果画面
router.get('/search', isMasterAuthenticated, (req, res) => {
  (async () => {
    let offset = req.query.id;
    if (typeof offset == 'undefined') {
      offset = 0;
    }
    let order;
    if (typeof req.query.column == 'undefined' &&
        typeof req.query.order == 'undefined'
    ) {
      order = {
        column: 'id',
        order: 'desc',
      };
    } else {
      order = {
        column: req.query.column,
        order: req.query.order,
      };
    }
    const searchData = {
      user_name: req.query.name,
      user_email: req.query.email,
      user_status: req.query.status,
      type_id: req.query.type,
      to_date: req.query.to,
      from_date: req.query.from,
      offset: offset,
    };
    const lessonResult = await getCheckLesson.lessonCount();
    const statusList = await getAllUsers.getStatus();
    const result = await getSearch.api(searchData, order);
    res.render('master/master_searchprogress', {
      title: 'progress',
      email: req.user.email,
      id: req.user.id,
      name: req.user.name,
      users: result.users.data,
      allCount: lessonResult.count,
      usercount: result.users.count,
      status: statusList,
      searchData: searchData,
      datetype: 'iso',
      column: order.column,
      order: order.order,
    });
  })();
});

// 提携先追加
router.post('/addtype', (req, res) => {
  (async () => {
    await getType.add(req.body);
    res.redirect('/master/setting');
  })();
});

// チャット画面
router.get('/chat', isMasterAuthenticated, (req, res) => {
  if (req.query.user) {
    // 対象ユーザー情報取得関数
    const getData = async () => {
      const result = await getAllUsers.user(req.query.user);
      res.render('master/master_chat', {
        title: 'chat',
        email: req.user.email,
        id: req.user.id,
        name: req.user.name,
        to_user: req.query.user,
        user: result,
      });
    };
    getData();
  } else {
    // 全ユーザー取得関数
    const getData = async () => {
      const result = await getAllUsers.api();
      // viewに値を渡す
      res.render('master/master_chatlist', {
        title: 'chatlist',
        email: req.user.email,
        id: req.user.id,
        name: req.user.name,
        users: result,
      });
    };
    getData();
  }
});

// ユーザー作成画面
router.get('/create', isMasterAuthenticated, (req, res) => {
  const getStatus = async () => {
    const statusList = await getAllUsers.getStatus();
    res.render('master/master_createuser', {
      title: 'user-create',
      email: req.user.email,
      id: req.user.id,
      name: req.user.name,
      status: statusList,
    });
  };
  getStatus();
});

// 提携先画面
router.get('/setting', isMasterAuthenticated, (req, res) => {
  (async () => {
    const statusList = await getAllUsers.getStatus();
    res.render('master/master_setting', {
      title: 'setting',
      email: req.user.email,
      id: req.user.id,
      name: req.user.name,
      status: statusList,
    });
  })();
});

// ユーザー詳細画面
router.get('/user', (req, res, next) => {
  (async () => {
    // 以下userDataに一人分のデータが格納してあります。
    const userData = await getAllUsers.getDetail(req.query);
    const lessonData = await getMongo.getLessonsData(userData.user_email);
    let resultLesson = {};
    if (typeof lessonData[0].lessondata != 'undefined') {
      resultLesson = lessonData[0].lessondata;
    }
    res.render('master/master_userinfo', {
      title: 'setting',
      email: req.user.email,
      id: req.user.id,
      name: req.user.name,
      userData: userData,
      lessonData: resultLesson,
    });
  })();
});

module.exports = router;

