var mongoose = require('mongoose');


exports.connect = function(db) {
  mongoose.connect('mongodb://' + db);
};

exports.debug = function(debug) {
  // コンソールにMongoDBへのクエリが表示されるようになる
  mongoose.set('debug', debug);
};

exports.Author = require('./models/author');
exports.Article = require('./models/article');

// exports.Article を
// var db = require('./db');
// db.Article としてエクスポート

