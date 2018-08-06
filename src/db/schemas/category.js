// var mongodb = require('../mongodb')
var mongoose = require('mongoose')

var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CategorySchema = new Schema({
  name: String,
  movies: [{type: ObjectId, ref: 'Movie'}],
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

CategorySchema.pre('save', function (next) { // 存储之前执行
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  next()
})

//静态方法 经过model编译后 实例化才能使用
CategorySchema.statics = {
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

// var Category = mongoose.model('Category', CategorySchema) //生成模型

module.exports = CategorySchema
