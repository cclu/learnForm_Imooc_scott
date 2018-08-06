var Movie = require('../db/models/movie')
var Category = require('../db/models/category')

// index page
exports.index = function (req, res) {
  console.log(req.session.user)
  Category
  .find({})
  .populate({path:'movies', options: {limit: 5}})
  .exec(function(err, categories) {
    console.log(categories)
    if (err) {
      console.log(err)
    }
    res.render('index', {
      title: 'imooc 首页',
      categories: categories
    })
  })
}

exports.search = function (req,res) {
  var catId = req.query.cat
  var searchName = req.query.q
  var page = parseInt(req.query.p, 10) || 0
  var count = 2
  var index = page * count
  
  if (catId) {
    Category
    .find({ _id: catId })
    .populate({
      path: 'movies',
      select: 'title poster'
    })
    .exec(function (err, categories) {
      if (err) {
        console.log(err)
      }
      var category = categories[0] || {}
      var movies = category.movies || []
      var results = movies.slice(index, index + count)
      console.log(page + 1 );
      
      res.render('results', {
        title: 'imooc 结果列表页面',
        keyword: category.name,
        currentPage: (page + 1),
        query: "cat="+catId,
        totalPage: Math.ceil(movies.length / count),
        movies: results
      })
    })
    
  }else {
    Movie.find({
      title: new RegExp(searchName + '.*', 'i')
    })
    .exec(function (err, movies) {
      if (err) {
        console.log(err)
      }
      var results = movies.slice(index, index + count)
      console.log(page + 1);

      res.render('results', {
        title: 'imooc 结果列表页面',
        keyword: searchName,
        currentPage: (page + 1),
        query: "q=" + catId,
        totalPage: Math.ceil(movies.length / count),
        movies: results
      })
    })
  }
}