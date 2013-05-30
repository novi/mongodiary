var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;


///// Author のスキーマ定義 /////
var Author = new Schema({

  // ユニークindexを張る(重複は許可しない)
  email: {type: String, required: true, index: {unique:true}},

  // required->必須(null or 値)
  userName: {type: String, require:true},
  password: {type: String, require:true},

  // オプション無しで値無しも許可できる
  createdAt: Date

});

// 保存前に新規データなら createdAt に現在時刻を挿入
Author.pre('save', function(next) {
  if(this.isNew) {
    this.createdAt = new Date();
  }
  next();
});


// スキーマAuthorをAuthorモデルとして登録
// そして、Authorモデルをこのモジュールにexport
module.exports = mongoose.model('Author', Author);