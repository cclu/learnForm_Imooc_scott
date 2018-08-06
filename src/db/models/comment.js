// var mongodb = require('../mongodb')
var mongoose = require('mongoose')
var commentSchema = require('../schemas/comment')
var Comment = mongoose.model('comment', commentSchema)

module.exports = Comment