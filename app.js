var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var serveStatic = require('serve-static')
var morgan = require('morgan')
var fs = require('fs')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)
var mongoose = require('mongoose')

var port = process.env.PORT || 3000
var app = express()

var dbUrl = 'mongodb://localhost:27017/imooc'
mongoose.connect(dbUrl)


// models loading 
var models_path = __dirname + '/src/db/models'

var wark = function (path) {
  fs
    .readdirSync(path)
    .forEach(function (file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        wark(newPath)
      }
    })
}
wark(models_path)


app.set('views', path.join(__dirname,'./src/views/pages'))
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({extended: true})) // 格式化
app.use(bodyParser.json())
app.use(cookieParser())

app.use(session({
  secret: 'imooc',
  resave: true,
  saveUninitialized: true,
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))

if ('development' === app.get('env')) {
  app.set('showStackError', true)
  app.use(morgan(':method :url :status'))
  app.locals.pretty = true
  mongoose.set('debug', true)
}

require('./route/routes')(app)

app.use(serveStatic(path.join(__dirname, 'static')))
app.locals.moment = require('moment')
app.listen(port)

console.log('imooc started on port ' + port)
 