var Item = require('../../../lib/mongo').Item
var ItemPreview = require('../../../lib/mongo').ItemPreview
var CartInfo = require('../../../lib/mongo').CartInfo
var UserOrder = require('../../../lib/mongo').UserOrder

module.exports = {
  // 创建
  // 创建购物车信息
  createCartInfo: (itemCart) => {
    return Promise.all([CartInfo.create(itemCart).exec()])
  },
  // 创建用户订单
  createOrder: (order, userId) => {
    return Promise.all([
      UserOrder.create(order).exec(),
      CartInfo.remove({ user_id: userId }).exec(),
    ])
  },
  // 获取
  // 获取商品预览, 带分页
  getPreview: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        ItemPreview.find().sort({ create_date: -1 }).skip(skip).limit(limit).exec(),
        ItemPreview.count().exec()
      ])
    } else {
      return ItemPreview.find().sort({ create_date: -1 }).exec()
    }
  },
  // 获取一件商品
  getItem: (itemId) => {
    return Item.findOne({ _id: itemId }).exec()
  },
  // 获取购物车列表
  getCartInfo: (userId) => {
    return CartInfo.find({ user_id: userId }).sort({ create_date: -1 }).exec()
  },
  searchCart: (userId, itemId) => {
    return CartInfo.find({ user_id: userId, item_id: itemId }).exec()
  },
  // 更新
  // 更新购物车信息
  updateCartInfo: (_id, info) => {
    return Promise.all([CartInfo.update({ _id: _id }, { $set: info }).exec()])
  },
  // 删除
  // 删除购物车商品
  deleteCartInfo: (_id) => {
    return Promise.all([CartInfo.remove({ _id: _id }).exec()])
  }
}

