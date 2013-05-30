var mongoose = require('mongoose');


exports.connect = function(db) {
  mongoose.connect('mongodb://' + db);
};

exports.debug = function(debug) {
  mongoose.set('debug', debug);
};

exports.Author = require('./models/author');
exports.Post = require('./models/post');

