var express = require('express'),
  db = require('../db');

var app = express();

// このモジュールをexport
// app.jsから使う
// var author = require('./routes/author')
// author === app となる
module.exports = app;

const URL_ADMIN = '/admin',
    URL_ARTICLES = URL_ADMIN + '/articles';

// ログインを必要とするページのためのMiddleware
var requireLogin = function(req, res, next) {

  // セッションにauthor_idが無ければ(=未ログイン)、ログイン画面へ
  if (!req.session.author_id) return res.redirect('/login?next=' + encodeURIComponent(req.path));

  return next(); // 次のMiddlewareへ, 2へ
};

// このURL以下はログインが必要
app.all(URL_ADMIN + '/*', requireLogin); // 1


// 2
// 記事一覧画面
app.get(URL_ARTICLES, function(req, res, next) {

  // 全記事取得
  // 別のAuthorの記事も出る
  db.Post.find({}, function(error, posts) {
    if (error) return next(error);

    return res.render('list_articles', {posts:posts});

  });
});

// 新規記事作成画面
app.get(URL_ADMIN + '/article', function(req, res, next) {
  res.render('edit_article', {postId:null, title:'', body:''});
});

// 記事編集画面
// :id は任意の値
app.get(URL_ADMIN + '/article/:id', function(req, res, next) {

  // 指定された記事(id)を取得
  // req.param('id') で URL に含まれる:idを取得
  db.Post.findById(req.param('id'), function(error, article) {
    if (error) return next(error);

    if (!article) return res.send(404); // 記事が無い

    // 既存のtitleとbodyをセット
    return res.render('edit_article', {postId:article.id, title:article.title, body:article.body});
  })
});


// 新規記事作成
app.post(URL_ADMIN +'/article', function(req, res, next) {
  db.Post.createNewArticle(req.session.author_id, req.param('title'), req.param('body'), function(error, article) {
    if (error) return next(error);
    return res.redirect(URL_ARTICLES);
  });
});

// 記事更新
app.post(URL_ADMIN +'/article/:id', function(req, res, next) {

  db.Post.findById(req.param('id'), function(error, article) {
    if (error) return next(error);

    if (!article) return res.send(404); // 記事が無い

    // 新しい値をセット
    article.title = req.param('title');
    article.body = req.param('body');

    // DBに保存
    article.save(function(error) {
      if (error) return next(error);

      return res.redirect(URL_ARTICLES);
    });
  });
});