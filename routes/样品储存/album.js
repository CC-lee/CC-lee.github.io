var express = require('express')
var router = express.Router()
var api = require('../api')
var frontApi = require('../api/frontApi').album
var backApi = require('../api/backApi').album
var albumImage = require('../middleware/albumImage')
var multer = require('multer')
var adminToken = require('../middleware/checkAdminToken')
var userToken = require('../middleware/checkUserToken')
var createStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/album/temp')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})
var upload = multer({ storage: createStorage })

function url(str) {
  return `/album/${str}`
}
// 前台
// 获取相册列表
router.post(url('albumList'), frontApi.albumList)
// 获取一张图片
router.post(url('frontOneImage'), frontApi.getOneImage)
// 获取一张图片的全部评论
router.post(url('frontAllComments'), frontApi.getAllComments)
// 发送评论
router.post(url('imageComment'), userToken, frontApi.imageComment)
// 图片赞
router.post(url('imageLike'), userToken, frontApi.imageLike)
// 图片赞取消
router.post(url('imageLikeCancel'), userToken, frontApi.imageLikeCancel)
// 评论点赞
router.post(url('commentLike'), userToken, frontApi.commentLike)
// 评论赞取消
router.post(url('commentLikeCancel'), userToken, frontApi.commentLikeCancel)

// 后台
// 获取临时图片数据
router.get(url('getImageTemp'), adminToken, backApi.getImageTemp)
// 更新临时图片数据
router.post(url('imageTemp'), adminToken, backApi.imageTemp)
// 创建图片
router.post(url('imageCreate'), adminToken, backApi.imageCreate)
// 获取相册信息列表
router.get(url('albumInfo'), adminToken, backApi.albumInfo)
// 图片删除
router.post(url('imageDelete'), adminToken, albumImage.deleteAllImage, backApi.imageDelete)
// 获取一张图片
router.post(url('backOneImage'), adminToken, backApi.getOneImage)
// 更新一张图片
router.post(url('editOneImage'), adminToken, backApi.editOneImage)
// 获取一张图片的全部评论
router.post(url('backAllComments'), adminToken, backApi.getAllComments)
// 删除一条评论
router.post(url('deleteOneComment'), adminToken, backApi.deleteOneComment)
// 创建相册图片保存图片
router.post(url('createSaveImage'), adminToken, albumImage.createFolder, upload.any(), albumImage.createSaveImage)
// 加载草稿文件夹图片
router.get(url('createLoadImage'), adminToken, albumImage.createLoadImage)
// 删除图片
router.post(url('deleteImage'), adminToken, albumImage.deleteImage)
// 删除所有图片
router.post(url('deleteImage'), adminToken, albumImage.deleteAllImage)

module.exports = router
