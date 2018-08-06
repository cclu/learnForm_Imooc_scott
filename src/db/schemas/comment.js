// var mongodb = require('../mongodb')
const mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CommentSchema = new Schema({
  movie: {
    type: ObjectId,
    ref: 'Movie'
  },
  from: {
    type: ObjectId,
    ref: 'User'
  },
  reply: [{
    from: { type: ObjectId, ref: 'User' },
    to: { type: ObjectId, ref: 'User' },
    content: String
  }],
  to: {
    type: ObjectId,
    ref: 'User'
  },
  content: String,
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

CommentSchema.pre('save', function (next) { // 存储之前执行
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

//静态方法 经过model编译后 实例化才能使用
CommentSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) { //
    return this
      .findOne({
        _id: id
      })
      .exec(cb)
  }
}

// var Comment = mongoose.model('Comment', CommentSchema) //生成模型

module.exports = CommentSchema
