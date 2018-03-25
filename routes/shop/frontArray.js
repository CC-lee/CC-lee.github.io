var userToken = require('../../middleware/checkUserToken')
var frontApi = require('../../api/frontApi').shop
var shopImage = require('../../middleware/shopImage')
var multer = require('multer')
function url(str) {
  return `/shop/${str}`
}
var nonToken = [
  {
    command: 'post',
    url: url('shopList'),// 商店列表
    middleware: [],
    set: frontApi.shopList
  },
  {
    command: 'post',
    url: url('frontOneItem'),// 获取一件商品
    middleware: [],
    set: frontApi.getOneItem
  }
]
var Token = [
  {
    command: 'post',
    url: url('shopCartInfo'),// 发送购物车信息
    middleware: [userToken],
    set: frontApi.shopCartInfo
  },
  {
    command: 'post',
    url: url('userShopCart'),// 获取购物车列表
    middleware: [userToken],
    set: frontApi.userShopCart
  },
  {
    command: 'post',
    url: url('deleteCartInfo'),// 删除购物车商品
    middleware: [userToken],
    set: frontApi.deleteCartInfo
  },
  {
    command: 'post',
    url: url('createOrder'),// 创建订单
    middleware: [userToken],
    set: frontApi.createOrder
  },
]
var frontArray = nonToken.concat(Token)

module.exports = frontArray