var adminToken = require('../../middleware/checkAdminToken')
var backApi = require('../../api/backApi').shop
var shopImage = require('../../middleware/shopImage')
var multer = require('multer')
var upload = require('../../middleware/multerSet')('shop', 'create')
var edit = require('../../middleware/multerSet')('shop', 'edit')
function url(str) {
  return `/shop/${str}`
}

var nonImage = [
  {
    command: 'get',
    url: url('getShopTemp'),// 获取临时商品数据
    middleware: [adminToken],
    set: backApi.getShopTemp
  },
  {
    command: 'get',
    url: url('shopInfo'),// 获取商店信息列表
    middleware: [adminToken],
    set: backApi.shopInfo
  },
  {
    command: 'post',
    url: url('backOneItem'),// 获取一个商品
    middleware: [adminToken],
    set: backApi.getOneItem
  },
  {
    command: 'get',
    url: url('userOrderList'),// 用户订单列表
    middleware: [adminToken],
    set: backApi.userOrderList
  },
  {
    command: 'post',
    url: url('getOneOrder'),// 获取一个订单
    middleware: [adminToken],
    set: backApi.getOneOrder
  },
  {
    command: 'post',
    url: url('editUserOrder'),// 编辑用户订单
    middleware: [adminToken],
    set: backApi.editUserOrder
  }
]
var image = [
  {
    command: 'post',
    url: url('shopTemp'),// 更新临时商品数据
    middleware: [adminToken, shopImage.tempProcessJudge, shopImage.tempProcess],
    set: backApi.shopTemp
  },
  {
    command: 'post',
    url: url('itemCreate'),// 创建商品
    middleware: [adminToken, shopImage.createProcessJudge, shopImage.createProcess],
    set: backApi.itemCreate
  },
  {
    command: 'post',
    url: url('deleteItem'),// 删除商品
    middleware: [adminToken, shopImage.deleteAllJudge, shopImage.deleteAllImage],
    set: backApi.deleteItem
  },
  {
    command: 'post',
    url: url('editOneItem'),/// 编辑商品
    middleware: [adminToken, shopImage.editProcessJudge, shopImage.editProcess],
    set: backApi.editOneItem
  },
  {
    command: 'post',
    url: url('createSaveImage'),// 创建商品保存图片
    middleware: [adminToken, shopImage.createFolderJudge, upload.any()],
    set: shopImage.createSaveImage
  },
  {
    command: 'post',
    url: url('editSaveImage'),// 编辑商品保存图片
    middleware: [adminToken, shopImage.editFolderJudge, edit.any()],
    set: shopImage.editSaveImage
  },
  {
    command: 'post',
    url: url('createLoadImage'),// 加载草稿文件夹图片
    middleware: [adminToken],
    set: shopImage.createLoadImage
  },
  {
    command: 'post',
    url: url('editLoadImage'),// 加载编辑文件夹图片
    middleware: [adminToken],
    set: shopImage.editLoadImage
  },
  {
    command: 'post',
    url: url('deleteImage'),// 删除图片
    middleware: [adminToken, shopImage.deleteJudge],
    set: shopImage.deleteImage
  },
]
var backArray = nonImage.concat(image)

module.exports = backArray