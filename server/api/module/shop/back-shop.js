var Item = require('../../../lib/mongo').Item
var ItemPreview = require('../../../lib/mongo').ItemPreview
var CartInfo = require('../../../lib/mongo').CartInfo
var ItemInfo = require('../../../lib/mongo').ItemInfo
var ItemTemp = require('../../../lib/mongo').ItemTemp
var UserOrder = require('../../../lib/mongo').UserOrder

module.exports = {
  // 创建
  // 创建商品
  createItem: (item, { tempId, temp }) => {
    return Promise.all([
      Item.create(item).exec(),
      ItemTemp.update({ _id: tempId }, { $set: temp }).exec()
    ])
  },
  createItemPvIf: ({ preview, info }) => {
    return Promise.all([
      ItemPreview.create(preview).exec(),
      ItemInfo.create(info).exec()
    ])
  },
  // 获取
  // 获取临时数据
  getTemp: () => {
    return ItemTemp.find().sort({ _id: -1 }).exec()
  },
  // 获取商品信息列表
  getItemInfo: () => {
    return ItemInfo.find().sort({ _id: -1 }).exec()
  },
  // 获取商品
  getItem: (itemId) => {
    return Item.findOne({ _id: itemId })
  },
  // 获取用户订单列表
  getOrderList: () => {
    return UserOrder.find().sort({ create_date: -1 }).exec()
  },
  // 获取一个用户订单
  getOrder: (orderId) => {
    return UserOrder.findOne({ _id: orderId })
  },
  // 更新
  // 更新临时数据
  updateTemp: ({ tempId, temp }) => {
    return ItemTemp.update({ _id: tempId }, { $set: temp }).exec()
  },
  // 更新商品
  updateItem: (itemId, { item, preview, info }) => {
    return Promise.all([
      Item.update({ _id: itemId }, { $set: item }).exec(),
      ItemPreview.update({ item_id: itemId }, { $set: preview }).exec(),
      ItemInfo.update({ item_id: itemId }, { $set: info }).exec()
    ])
  },
  // 更新用户订单
  updateOrder: (id, order) => {
    return Promise.all([UserOrder.update({ _id: id }, { $set: order }).exec()])
  },
  // 删除
  // 删除商品
  deleteItem: (itemId) => {
    return Promise.all([
      Item.remove({ _id: itemId }).exec(),
      ItemPreview.remove({ item_id: itemId }).exec(),
      ItemInfo.remove({ item_id: itemId }).exec(),
    ])
  }
}

