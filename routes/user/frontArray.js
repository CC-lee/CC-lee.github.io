var userToken = require('../../middleware/checkUserToken')
var frontApi = require('../../api/frontApi').user
var userImage = require('../../middleware/userImage')
var multer = require('multer')
function url(str) {
  return `/user/${str}`
}
var editStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/user/${req.body._id}temp/`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})
var edit = multer({ storage: editStorage })
var nonToken = [
  {
    command: 'post',
    url: url('userRegister'),// 创建用户
    middleware: [],
    set: frontApi.userRegister
  },
  {
    command: 'post',
    url: url('userLogin'),// 用户登录
    middleware: [],
    set: frontApi.userLogin
  },
]
var Token = [
  {
    command: 'post',
    url: url('getUserAccount'),// 获取用户账户信息
    middleware: [userToken],
    set: frontApi.getUserAccount
  },
  {
    command: 'post',
    url: url('modifyUserAccount'),// 修改账户信息
    middleware: [userToken, userImage.editProcess],
    set: frontApi.modifyUserAccount
  },  {
    command: 'post',
    url: url('modifyUserPassword'),// 修改密码
    middleware: [userToken],
    set: frontApi.modifyUserPassword
  },
  {
    command: 'post',
    url: url('getOrderList'),// 获取订单列表
    middleware: [userToken],
    set: frontApi.getOrderList
  },
  {
    command: 'post',
    url: url('getOneOrder'),// 获取一个订单
    middleware: [userToken],
    set: frontApi.getOneOrder
  },
  {
    command: 'post',
    url: url('deleteOneOrder'),// 删除订单
    middleware: [userToken],
    set: frontApi.deleteOneOrder
  },
  {
    command: 'post',
    url: url('getNotifyNum'),// 获取未读通知数量
    middleware: [userToken],
    set: frontApi.getNotifyNum
  },
  {
    command: 'post',
    url: url('getNotifyList'),// 获取通知列表
    middleware: [userToken],
    set: frontApi.getNotifyList
  },
  {
    command: 'post',
    url: url('deleteUnReadNotify'),  // 删除未读通知
    middleware: [userToken],
    set: frontApi.deleteUnReadNotify
  },
  {
    command: 'post',
    url: url('deleteOneNotify'),// 删除一条通知
    middleware: [userToken],
    set: frontApi.deleteOneNotify
  },
  {
    command: 'post',
    url: url('editSaveImage'),// 编辑用户保存图片
    middleware: [userToken, userImage.editFolder, edit.any()],
    set: userImage.editSaveImage
  },
  {
    command: 'post',
    url: url('eidtLoadImage'),// 加载编辑文件夹图片
    middleware: [userToken],
    set: userImage.eidtLoadImage
  },
  {
    command: 'post',
    url: url('deleteImage'),// 删除图片
    middleware: [userToken],
    set: userImage.deleteImage
  }
]
var frontArray = Token

module.exports = frontArray