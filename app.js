var express = require('express'),
    http = require('http'),
    path = require('path'),
    db = require('./db');

var app = express(); // Expressのapp作成


// app の設定
app.set('port', process.env.PORT || 3003);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// dev環境でのみ(envについては下記参照)
if ('development' == app.get('env')) {
  app.use(express.favicon());
  app.use(express.logger('dev'));
}

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

// メインのルーティング Middleware

  app.use(require('./routes/index'));
  app.use(require('./routes/article'));

  // adminAppとしてadminのAppをここの|app|のMiddlewareとして登録する
  // appもMiddlewareの一つとして使えるのがExpressの設計のよいところ
  var adminApp = require('./routes/admin');
  app.use(adminApp);


app.use(require('stylus').middleware(__dirname + '/public')); // Stylus用のMiddleware
app.use(express.static(path.join(__dirname, 'public'))); // public以下のファイルをレスポンスするMiddleware


// 環境変数 NODE_ENV は app.get('env') として扱える
//
// $ node app.js
// -> 'development' == app.get('env')
//
// $ NODE_ENV=production node app.js
// -> 'production' == app.get('env')
//
if ('development' == app.get('env')) {
  db.debug(true);
  app.set('db', 'localhost/mongodiary_dev');
  app.use(express.errorHandler());

}

if ('production' == app.get('env')) {
  // 本番環境の設定
  app.set('db', 'localhost/mongodiary');
}

// MongoDBに接続
db.connect(app.get('db'));

// listenを呼んで指定されたポートでサーバー起動
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port %s in %s mode', app.get('port'), app.get('env'));
});


// listenするとサーバーが起動する
// 本来はプログラムの最後を抜けるとNodeが終了するが、listenしている(socketが存在する)間は終了しない
console.log('listen');
