var Index = require('../src/controllers/index')
var Movie = require('../src/controllers/movie')
var User = require('../src/controllers/user')
var Comment = require('../src/controllers/comment')
var Category = require('../src/controllers/category')

var multiparty = require('connect-multiparty')
var multipartyMiddleware = multiparty()

module.exports = function (app) {
  app.use(function (req, res, next) {
    var _user = req.session.user
    app.locals.user = _user
    return next()
  })

  // Index
  app.get('/', Index.index)

  //User
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/logout', User.logout)
  app.get('/login', User.showLogin)
  app.get('/register', User.showRegister)
  app.get('/admin/users', User.loginRequired, User.adminRequired, User.list)

  // Movie
  app.get('/movie/:id', Movie.detail)
  app.get('/admin/movie/list', User.loginRequired, User.adminRequired, Movie.list)
  app.delete('/admin/movie/list', User.loginRequired, User.adminRequired, Movie.del)
  app.post('/admin/movie', multipartyMiddleware, User.loginRequired, User.adminRequired, Movie.savePoster, Movie.save)
  app.get('/admin/movie/update/:id', User.loginRequired, User.adminRequired, Movie.update)
  app.get('/admin/movie/new', User.loginRequired, User.adminRequired, Movie.new)

  // comment
  app.post('/user/comment', User.loginRequired, Comment.save)
 
  // category
  app.get('/admin/category/new', User.loginRequired, User.adminRequired, Category.new)
  app.post('/admin/category', User.loginRequired, User.adminRequired, Category.save)
  app.get('/admin/category/list', User.loginRequired, User.adminRequired, Category.list)

  // results
  app.get('/results', Index.search)
}
