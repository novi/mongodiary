var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


var Comment = new Schema({
  text:{type:String, require:true},
  createdAt: Date
});

var Post = new Schema({

  //ObjectID(_id)の参照, 参照先のモデルをrefで指定する(populate時などに有効)
  //投稿者, 必須
  author: {type: ObjectId, ref:'Author', required:true},

  title: {type: String, required:true},
  body: {type: String, required:true},

  // 数値(初期値:0)
  likeCount: {type: Number, required:true, default:0},

  //埋め込み型の定義
  comments: [Comment],

  createdAt: Date,
  updatedAt: Date
});

// 保存前に現在時刻を挿入
Post.pre('save', function(next) {
  if(this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

Comment.pre('save', function(next) {
  if(this.isNew) {
    this.createdAt = new Date();
  }
  next();
});

Post.statics.createNewArticle = function(author, title, body, callback) {
  var article = new this({author:author, title:title, body:body});
  article.save(callback);
};


module.exports = mongoose.model('Post', Post);