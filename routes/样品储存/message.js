var express = require('express')
var router = express.Router()
var frontApi = require('../api/frontApi').message
var backApi = require('../api/backApi').message
var messageImage = require('../middleware/messageImage')
var multer = require('multer')
var adminToken = require('../middleware/checkAdminToken')
var userToken = require('../middleware/checkUserToken')
var createStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/message/temp')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})
var upload = multer({ storage: createStorage })
var frontCreate = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/message/${req.headers['setting']}/${req.headers['dater']}`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})
var frontUpload = multer({ storage: frontCreate })

function url(str) {
  return `/message/${str}`
}
// 前台
// 用户留言创建
router.post(url('userMessageCreate'), userToken, frontApi.userMessageCreate)
// 发送通知
router.post(url('createFrontNotify'), userToken, frontApi.createUserNotify)
// 获取留言列表
router.post(url('messageList'), frontApi.messageList)
// 发送留言赞
router.post(url('messageLike'), userToken, frontApi.messageLike)
// 留言赞取消
router.post(url('messageLikeCancel'), frontApi.messageLikeCancel)
// 获取留言预览列表
router.post(url('messagePreview'), frontApi.getPreview)
// 获取一条留言
router.post(url('getOneMessage'), frontApi.getOneMessage)
// 获取所有留言评论
router.post(url('frontAllComments'), frontApi.getAllComments)
// 发送留言评论
router.post(url('messageComment'), userToken, frontApi.messageComment)
// 发送留言评论赞
router.post(url('commentLike'), userToken, frontApi.commentLike)
// 留言评论赞取消
router.post(url('commentLikeCancel'), userToken, frontApi.commentLikeCancel)
// 留言评论回复
router.post(url('messageReply'), userToken, frontApi.messageReply)
// 根据搜索结果获取留言
router.get(url('getMessagesBySearch'), frontApi.getMessagesBySearch)
// 保存图片
router.post(url('frontSaveImage'), userToken, messageImage.fontFolder, frontUpload.any(), messageImage.frontSaveImage)
// 后台
// 获取临时数据
router.get(url('getMessageTemp'), adminToken, backApi.getMessageTemp)
// 更新临时数据
router.post(url('messageTemp'), adminToken, backApi.messageTemp)
// 管理留言创建
router.post(url('adminMessageCreate'), adminToken, backApi.adminMessageCreate)
// 发送通知
router.post(url('createBackNotify'), adminToken, backApi.createUserNotify)
// 管理留言信息列表
router.get(url('adminMessageList'), adminToken, backApi.adminMessageList)
// 用户留言信息列表
router.get(url('userMessageList'), adminToken, backApi.userMessageList)
// 留言删除
router.post(url('messageDelete'), adminToken, messageImage.deleteAllImage, backApi.messageDelete)
// 获取一条管理留言
router.post(url('getAdminMessage'), adminToken, backApi.getAdminMessage)
// 管理留言编辑
router.post(url('editAdminMessage'), adminToken, backApi.editAdminMessage)
// 留言评论获取
router.post(url('backAllComments'), adminToken, backApi.getAllComments)
// 删除一条留言评论
router.post(url('deleteOneComment'), adminToken, backApi.deleteOneComment)
// 创建管理者留言保存图片
router.post(url('createSaveImage'), adminToken, messageImage.createFolder, upload.any(), messageImage.createSaveImage)
// 加载草稿文件夹图片
router.get(url('createLoadImage'), adminToken, messageImage.createLoadImage)
// 删除图片
router.post(url('deleteImage'), adminToken, messageImage.deleteImage)
// 删除所有图片
router.post(url('deleteAllImage'), adminToken, messageImage.deleteAllImage)

module.exports = router
