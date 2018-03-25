var User = require('../lib/mongo').User
var Classify = require('../lib/mongo').Classify
var Article = require('../lib/mongo').Article
var Image = require('../lib/mongo').Image
var _async = require('asyncawait/async')
var _await = require('asyncawait/await')
var apimodule = require('./module')
var frontArticle = apimodule.frontArticle
var controller = require('./controller')
var frontClass = controller.frontClass
var backClass = controller.backClass

module.exports = {
  create: function (user) {
    return User.create(user).exec()
  },
  getUserByName: function (name) {
    return User.findOne({ name: name }).exec()
  },
  //  创建分类
  createClass: backClass.classCreate,
  // 删除分类
  removeClass: backClass.removeClass,
  // 编辑分类
  updateClass: backClass.editOneClass,
  // 查询所有分类
  findAllClass: function () {
    return Classify.find()
      .addCreateAt()
      .sort({ _id: -1 })
      .exec()
  },
  // 创建文章
  createArticle: function (params) {
    return Article.create(params).exec()
  },
  // 获取所有文章
  getAllArticles: frontArticle.getAllArticles,
  // 根据classify获取所有文章
  getArticlesByClassify: function (classify) {
    return Article.find({ classify })
      .addCreateAt()
      .sort({ _id: -1 })
      .exec()
  },
  // 获取一篇文章
  getOneArticle(postId) {
    return Article.findOne({ _id: postId })
      .addCreateAt()
      .exec()
  },
  // 删除一篇文章
  removeOneArticle: function (postId) {
    return Article.remove({ _id: postId }).exec()
  },
  // 编辑一篇文章
  updateArticle: function (postId, data) {
    return Article.update({ _id: postId }, { $set: data }).exec()
  },
  //  创建图片
  creatImage: function (file) {
    return Image.create(file).exec()
  },
  // 获取所有图片
  findAllImageID: function () {
    return Image.count({ 'ImageId': { '$gt': -1, '$lt': 24 } }).exec()
  }
}
