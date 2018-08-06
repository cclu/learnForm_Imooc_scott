var Comment = require('../db/models/comment')
var _ = require('underscore')

// post comment
exports.save = function (req, res) {
  var _comment = req.body.comment
  var movieId = _comment.movie
  var comment = new Comment(_comment)

  if (_comment.cid) { // 评论回复
    console.log(_comment)
    Comment.findById(_comment.cid, function (err, comment) {
      console.log(comment)
      var reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      }
      comment.reply.push(reply)

      comment.save(function (err, comment) {
        if (err) {
          console.log(err)
        }
        res.redirect('/movie/' + movieId)
      })
    })
  }
  else {
    var comment = new Comment(_comment)
      comment.save(function (err, comment) {
        if (err) {
          console.log(err)
        }
        res.redirect('/movie/' + movieId)
      })

  }
}
