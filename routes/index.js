var express = require('express'),
    db = require('../db');

var app = express();
module.exports = app;


app.get('/login', function(req, res) {
  // View(login)にデータ(sessionなど)を渡す
  res.render('login', {session:req.session});
});


app.post('/login', function(req, res, next) { // 1

  // パラメータチェック(簡易)
  if (!req.param('email')) return res.send(400);

  // Authorを検索
  db.Author.findByEmail(req.param('email'), function(error, author) {

    // エラーが起きたら、次のルーティング(next)にエラーを渡して終了(return)
    if (error) return next(error);

    // 見つからなかったら...
    if (!author) {
      // メッセージをsessionに格納
      req.session.login = {message: 'メールアドレスが違います'};

      return next(); // 2へ
    }

    // 見つかったら、セッションにidを格納して
    req.session.author_id = author.id;

    return next(); // 2へ
  });

// リダイレクト用のMiddleware
}, function(req, res, next) { // 2
  // 指定されたページにリダイレクト
  if (req.param('next')) {
    return res.redirect(req.param('next'));
  }
  // それ以外は、管理画面にリダイレクト
  res.redirect('/admin/articles');
});


app.post('/signup', function(req, res, next) {

  if (!req.param('email')) return res.send(400);

  // createAuthor はModelで定義
  db.Author.createAuthor(req.param('email'), function(error, author) {
    if (error) return next(error);

    // メッセージをsessionに格納
    req.session.login = {message: 'Authorを作成しました'};

    // 作成したのでリダイレクト
    res.redirect('/login');
  });
});


