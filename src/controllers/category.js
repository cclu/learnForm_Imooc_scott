var Category = require('../db/models/category')
var _ = require('underscore')

// list page
exports.list = function (req, res) {
  Category.fetch(function (err, categories) {
    if (err) {
      console.log(err)
    }
    res.render('category_list', {
      title: 'imooc 后台分类列表页',
      categories: categories
    })
  })
}

//list delete Category
exports.del = function (req, res) {
  var id = req.params.id
  console.log(req.params)
  if (id) {
    Category.remove({
      _id: id
    }, function (err, Category) {

      res.json({
        success: 1
      })

    })
  }
}

// admin page
exports.new = function (req, res) {
  res.render('categoryAdmin', {
    title: 'imooc 后台分类录入页',
    category: {}
  })
}

//admin update Category
exports.update = function (req, res) {
  var id = req.params.id
  if (id) {
    Category.findById(id, function (err, category) {
      if (err) {
        console.log(err)
      }
      res.render('categoryAdmin', {
        title: 'imooc 后台更新页',
        category: category
      })
    })
  }
}

//admin post Category
exports.save = function (req, res) {
  var _id = req.body.category._id
  var CategoryObj = req.body.category
  var _Category = {}
  if (_id !== 'undefined') {
    Category.findById(_id, function (err, category) {
      if (err) {
        console.log(err)
      }
      _Category = _.extend(Category, CategoryObj)
      _Category.save(function (err, category) {
        if (err) {
          console.log(err)
        }
        res.redirect('/admin/category/list/')
      })
    })
  } else {
    _Category = new Category({
      name: CategoryObj.name,
    })
    _Category.save(function (err, category) {
      if (err) {
        console.log(err)
      }
      res.redirect('/admin/category/list/')
    })
  }
}