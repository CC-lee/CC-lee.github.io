var adminToken = require('../../middleware/checkAdminToken')
var backApi = require('../../api/backApi').article
var articleImage = require('../../middleware/articleImage')
var path = require('path')
function url(str) {
  return `/article/${str}`
}
var nonImage = [
  {
    command: 'post',
    url: url('getArticleTemp'),// 获取草稿数据
    middleware: [adminToken],
    set: backApi.getArticleTemp
  },
  {
    command: 'get',
    url: url('articleInfo'),//获取文章信息列表
    middleware: [adminToken],
    set: backApi.articleInfo
  },
  {
    command: 'post',
    url: url('backAllComments'),// 获取一篇文章的所有评论
    middleware: [adminToken],
    set: backApi.getAllComments
  },
  {
    command: 'post',
    url: url('deleteOneComment'),// 删除一条评论
    middleware: [adminToken],
    set: backApi.deleteOneComment
  }
];

var image = [
  {
    command: 'post',
    url: url('articleTemp'),// 更新草稿数据
    middleware: [adminToken, articleImage.tempProcessJudge, articleImage.tempProcess],
    set: backApi.articleTemp
  },
  {
    command: 'post',
    url: url('articleCreate'),// 创建文章
    middleware: [adminToken, articleImage.createProcessJudge, articleImage.createProcess],
    set: backApi.articleCreate
  },
  {
    command: 'post',
    url: url('articledelete'),// 文章删除
    middleware: [adminToken, articleImage.deleteAllJudge, articleImage.deleteAllImage],
    set: backApi.articledelete
  },
  {
    command: 'post',
    url: url('backOneArticle'),// 获取一篇文章
    middleware: [adminToken],
    set: backApi.getOneArticle
  },
  {
    command: 'post',
    url: url('editOneArticle'),// 更新文章
    middleware: [adminToken, articleImage.editProcessJudge, articleImage.editProcess],
    set: backApi.editOneArticle
  },
  {
    command: 'post',
    url: url('createSaveImage'),// 创建文章保存图片
    middleware: [adminToken],
    set: articleImage.createSaveImage
  },
  {
    command: 'post',
    url: url('editSaveImage'), // 编辑文章保存图片
    middleware: [adminToken],
    set: articleImage.editSaveImage
  },
  {
    command: 'post',
    url: url('createLoadImage'),// 加载草稿文件夹图片
    middleware: [adminToken],
    set: articleImage.createLoadImage
  },
  {
    command: 'post',
    url: url('eidtLoadImage'),// 加载草稿文件夹图片
    middleware: [adminToken],
    set: articleImage.eidtLoadImage
  },
  {
    command: 'post',
    url: url('deleteImage'),// 删除图片
    middleware: [adminToken, articleImage.deleteJudge],
    set: articleImage.deleteImage
  }
];

var backArray = nonImage.concat(image)

module.exports = backArray