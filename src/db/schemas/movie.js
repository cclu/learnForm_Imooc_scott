// var mongodb = require('../mongodb')
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
  doctor: String,
  title: String,
  language: String,
  country: String,
  year: Number,
  summary: String,
  flash: String,
  poster: String,
  pv: {
    type: Number,
    default: 0
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
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

MovieSchema.pre('save', function (next) { // 存储之前执行
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else {
    this.meta.updateAt = Date.now()
  }

  next()
})

//静态方法 经过model编译后 实例化才能使用
MovieSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) { //
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

// var Movie = mongoose.model('Movie', MovieSchema) //生成模型

module.exports = MovieSchema
