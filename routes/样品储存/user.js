var express = require('express')
var router = express.Router()
var frontApi = require('../api/frontApi').user
var backApi = require('../api/backApi').user
var adminToken = require('../middleware/checkAdminToken')
var userToken = require('../middleware/checkUserToken')
var userImage = require('../middleware/userImage')
var multer = require('multer')
var editStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/user/${req.body._id}temp/`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})
var edit = multer({ storage: editStorage })

function url(str) {
  return `/user/${str}`
}
// 前台
// 创建用户
router.post(url('userRegister'), frontApi.userRegister)
// 用户登录
router.post(url('userLogin'), frontApi.userLogin)
// 获取用户账户信息
router.post(url('getUserAccount'),frontApi.getUserAccount)
// 修改账户信息
router.post(url('modifyUserAccount'), userToken, userImage.editProcess, frontApi.modifyUserAccount)
// 获取所有用户列表
router.get(url('getUserLists'), userToken, frontApi.getUserLists)
// 修改密码
router.post(url('modifyUserPassword'), userToken, frontApi.modifyUserPassword)
// 获取订单列表
router.post(url('getOrderList'), userToken, frontApi.getOrderList)
// 获取一个订单
router.post(url('getOneOrder'), userToken, frontApi.getOneOrder)
// 删除订单
router.post(url('deleteOneOrder'), userToken, frontApi.deleteOneOrder)
// 获取未读通知数量
router.post(url('getNotifyNum'), userToken, frontApi.getNotifyNum)
// 获取通知列表
router.post(url('getNotifyList'), userToken, frontApi.getNotifyList)
// 删除一条通知
router.post(url('deleteOneNotify'), userToken, frontApi.deleteOneNotify)
// 编辑用户保存图片
router.post(url('editSaveImage'), userToken, userImage.editFolder, edit.any(), userImage.editSaveImage)
// 加载编辑文件夹图片
router.post(url('editLoadImage'), userToken, userImage.eidtLoadImage)
// 删除图片
router.post(url('deleteImage'), userToken, userImage.deleteImage)

// 后台
// 用户信息列表
router.get(url('userList'), adminToken, backApi.userList)
// 删除用户
router.post(url('deleteUser'), adminToken, backApi.deleteUser)

module.exports = router
