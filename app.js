var express = require('express'),
    http = require('http'),
    path = require('path'),
    db = require('./db');

var app = express();


app.set('port', process.env.PORT || 3003);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

if ('development' == app.get('env')) {
  app.use(express.favicon());
  app.use(express.logger('dev'));
}

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

// ルーティング middleware

app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));


// 環境変数 NODE_ENV から app.get('env') を変更
// $ NODE_ENV=production node app.js
if ('development' == app.get('env')) {
  // dev環境の設定(デフォルト, 指定なし)
  db.debug(true);
  app.set('db', 'localhost/mongodiary_dev');
  app.use(express.errorHandler());

} else if ('production' == app.get('env')) {
  // 本番環境の設定
  app.set('db', 'localhost/mongodiary');
}

// MongoDBに接続
db.connect(app.get('db'));

// listenを呼んで指定されたポートでサーバー起動
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port %s in %s mode', app.get('port'), app.get('env'));
});
