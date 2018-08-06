var mongoose = require('mongoose')
var bcrypt = require('bcrypt')
var SALT_WORK_FACTOR = 10

var Schema = mongoose.Schema
var UserSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: Number,
    default: 0
  }, // 0:normal user; 1:verified user; 2:professional user; >10:admin; >50: super admin
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

UserSchema.pre('save', function (next) { // 存储之前执行
  var user = this
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)
    
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)
      user.password = hash
       next()
    })
  })
  // next()
})

UserSchema.methods = {
  comparePassword: function(_password, cb) {
    bcrypt.compare(_password, this.password, function (err, isMatch) {
      if (err) return cb(err)
      console.log(isMatch)
      cb(null , isMatch)
    })
  }
}

//静态方法 经过model编译后 实例化才能使用
UserSchema.statics = {
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

// var User = mongodb.mongoose.model('User', UserSchema) //生成模型

module.exports = UserSchema
