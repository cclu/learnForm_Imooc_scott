var User = require('../db/models/user')

 // sinup
exports.signup = function (req, res) {
  var _user = req.body.user

  User.findOne({
    name: _user.name
  }, function (err, user) {
    if (err) {
      console.log(err)
    }
    if (user) {
      // res.json({message: '用户名重复', result: 0 })
      return res.redirect('/login')
    } else {
      var user = new User(_user)

      user.save(function (err, user) {
        if (err) {
          console.log(err)
        }
        console.log(user)
        return res.redirect('/login')
      })
    }
  })

}

 // signin
exports.signin = function (req, res) {
  var _user = req.body.user
  var name = _user.name
  var password = _user.password
  User.findOne({
    name: name
  }, function (err, user) {
    if (err) {
      console.log(err)
    }

    if (!user) {
      console.log('no user')
      return res.redirect('/register')
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        console.log(err)
      }
      if (isMatch) {
        req.session.user = user
        console.log('success')
        return res.redirect('/')
      } else {
        console.log('Password is not matched')
        return res.redirect('/login')
      }
    })
  })
}

exports.logout = function (req, res) {
  delete req.session.user
  // delete app.locals.user
  return res.redirect('/')
}

// list page
exports.list = function (req, res) {
  User.fetch(function (err, users) {
    if (err) {
      console.log(err)
    }
    res.render('users', {
      title: 'imooc 用户列表',
      users: users
    })
  })
}
// showLogin page
exports.showLogin = function (req, res) {

  res.render('login', {
    title: 'imooc 登录'
  })
}
// showRegister page
exports.showRegister = function (req, res) {
  res.render('register', {
    title: 'imooc 注册'
  })
}

 // midWare for user
exports.loginRequired = function (req, res, next) {
  var user = req.session.user
  if (!user) {
    return res.redirect('/login')
  }
  next()
}

exports.adminRequired = function (req, res, next) {
  var user = req.session.user
  if (user.role <= 10) {
    return res.redirect('/login')
  }
  next()
}