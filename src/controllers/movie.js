var Movie = require('../db/models/movie')
var Comment = require('../db/models/comment')
var Category = require('../db/models/category')
var _ = require('underscore')
var fs = require('fs')
var path = require('path')

// list page
exports.list = function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err)
    }
    res.render('list', {
      title: 'imooc 列表页',
      movies: movies
    })
  })
}

//list delete movie
exports.del = function (req, res) {
  var id = req.params.id
  console.log(req.params)
  if (id) {
    Movie.remove({
      _id: id
    }, function (err, movie) {

      res.json({
        success: 1
      })

    })
  }
}

// detail page
exports.detail = function (req, res) {
  var id = req.params.id
  Movie.update({_id: id}, {$inc: {pv: 1}}, function (err) {
    if (err) {
      console.log(err)
    }
  })
  Movie.findById(id, function (err, movie) {
    Comment
      .find({movie: id})
      .populate('from','name')
      .populate('reply.from reply.to','name')
      .exec(function (err, comments) {
        if (err) {
          console.log(err)
        }
        res.render('detail', {
          title: 'imooc ' + movie.title,
          movie: movie,
          comments: comments
        })
      })
  })
}

// admin page
exports.new = function (req, res) {
  Category.find({}, function (err, categories) {
    if (err) {
      console.log(err)
    }
    res.render('admin', {
      title: 'imooc 后台录入页',
      categories: categories,
      movie: {}
    })
  })
}

//admin update movie
exports.update = function (req, res) {
  var id = req.params.id

  if (id) {
    Movie.findById(id, function (err, movie) {
      Category.find({}, function (err, categories) {
        if (err) {
          console.log(err)
        }
        res.render('admin', {
          title: 'imooc 后台更新页',
          movie: movie,
          categories: categories
        })
      })
    })
  }
}

exports.savePoster = function (req, res, next) {
  var postData = req.files.uploadPoster
  var filePath = postData.path
  var originalFilename = postData.originalFilename
  console.log( req.files)
  if (originalFilename) {
    fs.readFile(filePath, function (err, data) {
      var timestamp = Date.now()
      var type = postData.type.split('/')[1]
      var poster = timestamp + '.' + type
      var newPath = path.join(__dirname, '../../', '/static/upload/' + poster)

      fs.writeFile(newPath, data,function (err) {
        req.poster = poster
        next()
      })
    })
  }else {
    next()
  }
}

//admin post movie
exports.save = function (req, res) {
  var _id = req.body.movie._id
  var movieObj = req.body.movie
  var _movie = {}
  
  if (req.poster) {
    movieObj.poster = req.poster
  }

  if (_id) {
    Movie.findById(_id, function (err, movie) {
      if (err) {
        console.log(err)
      }
      _movie = _.extend(movie, movieObj)
      _movie.save(function (err, movie) {
        if (err) {
          console.log(err)
        }
        res.redirect('/movie/' + movie._id)
      })
    })
  } else {
    _movie = new Movie(movieObj)
    var categoryId = movieObj.category
    var categoryName = movieObj.categoryName
    _movie.save(function (err, movie) {
      if (err) {
        console.log(err)
      }
      if (categoryId) {
        Category.findById(categoryId, function (err, category) {
          category.movies.push(movie._id)
          category.save(function (err, category) {
            res.redirect('/movie/' + movie._id)
          })
        })
      }
      else if (categoryName) {
        let category = new Category({
          name: categoryName,
          movies: [movie._id]
        })
        category.save(function (err, category) {
          movie.category = category._id
          movie.save(function (err, movie) {
            res.redirect('/movie/' + movie._id)
          })
        })
      }
    })
  }
}