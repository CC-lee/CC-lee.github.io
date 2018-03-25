var express = require('express')
var router = express.Router()
var frontApi = require('../api/frontApi').shop
var backApi = require('../api/backApi').shop
var shopImage = require('../middleware/shopImage')
var multer = require('multer')
var adminToken = require('../middleware/checkAdminToken')
var userToken = require('../middleware/checkUserToken')
var createStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/shop/temp')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})
var upload = multer({ storage: createStorage })
var editStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(req.body);
    cb(null, `uploads/shop/${req.body._id}edit/`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})
var edit = multer({ storage: editStorage })

function url(str) {
  return `/shop/${str}`
}
// 前台
// 商店列表
router.post(url('shopList'), frontApi.shopList)
// 获取一件商品
router.post(url('frontOneItem'), frontApi.getOneItem)
// 发送购物车信息
router.post(url('shopCartInfo'), userToken, frontApi.shopCartInfo)
// 获取购物车列表
router.post(url('userShopCart'), userToken, frontApi.userShopCart)
// 删除购物车商品
router.post(url('deleteCartInfo'), userToken, frontApi.deleteCartInfo)
// 创建订单
router.post(url('createOrder'), userToken, frontApi.createOrder)

//后台
// 获取临时商品数据
router.get(url('getShopTemp'), adminToken, backApi.getShopTemp)
// 更新临时商品数据
router.post(url('shopTemp'), adminToken, backApi.shopTemp)
// 创建商品
router.post(url('itemCreate'), adminToken, shopImage.createProcess, backApi.itemCreate)
// 获取商店信息列表
router.get(url('shopInfo'), adminToken, backApi.shopInfo)
// 删除商品
router.post(url('deleteItem'), adminToken, shopImage.deleteAllImage, backApi.deleteItem)
// 获取一个商品
router.post(url('backOneItem'), adminToken, backApi.getOneItem)
// 编辑商品
router.post(url('editOneItem'), adminToken, shopImage.editProcess, backApi.editOneItem)
// 用户订单列表
router.get(url('userOrderList'), adminToken, backApi.userOrderList)
// 获取一个订单
router.post(url('getOneOrder'), adminToken, backApi.getOneOrder)
// 编辑用户订单
router.post(url('editUserOrder'), adminToken, backApi.editUserOrder)
// 创建商品保存图片
router.post(url('createSaveImage'), adminToken, shopImage.createFolder, upload.any(), shopImage.createSaveImage)
// 编辑商品保存图片
router.post(url('editSaveImage'), adminToken, edit.any(), shopImage.editSaveImage)
// 加载草稿文件夹图片
router.get(url('createLoadImage'), adminToken, shopImage.createLoadImage)
// 加载编辑文件夹图片
router.post(url('editLoadImage'), adminToken, shopImage.editLoadImage)
// 删除图片
router.post(url('deleteImage'), adminToken, shopImage.deleteImage)
// 删除所有图片
router.post(url('deleteAllImage'), adminToken, shopImage.deleteAllImage)

module.exports = router

