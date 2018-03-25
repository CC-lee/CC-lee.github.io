var express = require('express')
var checkToken = require('../middleware/checkAdminToken')
var router = express.Router()
var backApi = require('../api/backApi').admin
var adminImage = require('../middleware/adminImage')
var multer = require('multer')
var editStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/admin/${req.headers.dateid}temp/`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})
var edit = multer({ storage: editStorage })
function url(str) {
  return `/admin/${str}`
}
// 验证
router.get('/admin', checkToken, function (req, res, next) {
  res.send({
    type: true,
    name: 'dailu'
  })
})
// 注册
router.post(url('register'), backApi.adminRegister)
// 登录
router.post(url('login'), backApi.adminLogin)
// 获取管理账号信息
router.post(url('profile'), checkToken, backApi.adminProfile)
// 修改管理账号信息
router.post(url('modifyProfile'), checkToken, adminImage.editProcess, backApi.modifyProfile)
// 编辑资料保存图片
router.post(url('editSaveImage'), checkToken, adminImage.editFolder, edit.any(), adminImage.editSaveImage)
// 加载编辑文件夹图片
router.get(url('editLoadImage'), checkToken, adminImage.eidtLoadImage)
// 加载头像图片
router.get(url('avatar'), checkToken, adminImage.loadAvatar)

module.exports = router
