var express = require('express')
var router = express.Router()
var api = require('../api')
var frontApi = require('../api/frontApi').article
var backApi = require('../api/backApi').article
var articleImage = require('../middleware/articleImage')
var adminToken = require('../middleware/checkAdminToken')
var userToken = require('../middleware/checkUserToken')

function url(str) {
  return `/article/${str}`
}
// 前台
// 获取文章预览列表
router.post(url('articlePreview'), frontApi.articlePreview)
// 发送文章赞
router.post(url('articleLike'), userToken, frontApi.articleLike)
// 取消文章赞
router.post(url('articleLikeCancel'), userToken, frontApi.articleLikeCancel)
// 获取一篇文章
router.post(url('frontOneArticle'), frontApi.getOneArticle)
// 获取所有评论
router.post(url('frontAllComments'), frontApi.getAllComments)
// 发送评论
router.post(url('articleComment'), userToken, frontApi.articleComment)
// 发送评论点赞
router.post(url('commentLike'), userToken, frontApi.commentLike)
// 取消评论点赞
router.post(url('commentLikeCancel'), userToken, frontApi.commentLikeCancel)
// 发送回复
router.post(url('articleReply'), userToken, frontApi.articleReply)
// 根据搜索结果获取文章
router.get(url('getArticlesBySearch'), frontApi.getArticlesBySearch)

// 后台
// 获取草稿数据
router.get(url('getArticleTemp'), adminToken, backApi.getArticleTemp)
// 更新草稿数据
router.post(url('articleTemp'), adminToken, backApi.articleTemp)
// 创建文章
router.post(url('articleCreate'), adminToken, backApi.articleCreate)
//获取文章信息列表
router.get(url('articleInfo'), adminToken, backApi.articleInfo)
// 文章删除
router.post(url('articledelete'), adminToken, articleImage.deleteAllImage, backApi.articledelete)
// 获取一篇文章
router.post(url('backOneArticle'), adminToken, articleImage.eidtLoadImage, backApi.getOneArticle)
// 更新文章
router.post(url('editOneArticle'), adminToken, articleImage.editProcess, backApi.editOneArticle)
// 编辑临时更新
router.post(url('editOneTemp'), adminToken, backApi.editOneTemp)
// 获取一篇文章的所有评论
router.post(url('backAllComments'), adminToken, backApi.getAllComments)
// 删除一条评论
router.post(url('deleteOneComment'), adminToken, backApi.deleteOneComment)
// 创建文章保存图片
router.post(url('createSaveImage'), adminToken, articleImage.createFolder, articleImage.createSaveImage)
// 编辑文章保存图片
router.post(url('eidtSaveImage'), adminToken, articleImage.editFolder, articleImage.editSaveImage)
// 加载草稿文件夹图片
router.get(url('createLoadImage'), adminToken, articleImage.createLoadImage)
// 加载编辑文件夹
router.get(url('loadImage'), adminToken, articleImage.eidtLoadImage)
// 删除图片
router.post(url('deleteImage'), adminToken, articleImage.deleteImage)
// 删除所有图片
router.post(url('deleteAllImage'), adminToken, articleImage.deleteAllImage)


module.exports = router
