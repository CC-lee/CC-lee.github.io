var apimodule = require('../../module')
var backShop = apimodule.backShop
var control = require('../control')
var jetpack = require('fs-jetpack');

class bShop extends control {
  constructor({
    dateid,
    _id,
    item_name,
    unit_price,
    item_img,
    item_detail,
    item_option,
    item_id,
    preview_img,
    main_img,
    total_price,
    create_date,
    update_date,
    timestamp
      }) {
    super({
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, item_id, main_img, preview_img, dateid })
    this.temp = {
      item_name,
      unit_price,
      item_img,
      item_detail,
      item_option
    }
    this.item = {
      item_name,
      unit_price,
      item_img,
      item_detail,
      item_option,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.preview = {
      item_id,
      item_name,
      unit_price,
      preview_img,
      item_detail,
      item_option,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.info = {
      item_id,
      item_name,
      unit_price,
      main_img,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.updateItem = {
      item_name,
      unit_price,
      item_img,
      item_detail,
      item_option,
      update_date: this.update_date
    }
    this.updatePreview = {
      item_name,
      unit_price,
      preview_img,
      item_detail,
      item_option,
      update_date: this.update_date
    }
    this.updateInfo = {
      item_name,
      unit_price,
      main_img,
      update_date: this.update_date
    }
    if (total_price) {
      this.total_price = total_price
      this.updateOrder = {
        total_price: parseInt(total_price)
      }
    }
  }

  getShopTemp(res) {
    backShop.getTemp()
      .then((temp) => {
        this.getres(temp, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  shopTemp(res) {
    backShop.updateTemp({ tempId: this._id, temp: this.temp })
      .then((result) => {
        res.send({
          code: 200,
          message: '保存成功'
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  itemCreate(res) {
    Object.assign(this.temp, { item_name: '', unit_price: '', item_img: [], item_detail: '', item_option: [] })
    backShop.createItem(this.item, { tempId: this._id, temp: this.temp })
      .then((result) => {
        var { _id: itemId } = result[0].ops[0]
        for (var i in this.preview_img) {
          this.preview_img[i] = `http://localhost:3009/uploads/shop/${itemId}/thumbnail/${this.preview_img[i]}`
        }
        jetpack.rename(`uploads/shop/${this.dateid}`, `${itemId}`);
        Object.assign(this.preview, { item_id: `${itemId}`, preview_img: this.preview_img })
        Object.assign(this.info, { item_id: `${itemId}`, main_img: `http://localhost:3009/uploads/shop/${itemId}/mainImg/${this.main_img.thumbname}` })
        backShop.createItemPvIf({ preview: this.preview, info: this.info })
          .then((result) => {
            this.createres(result, res)
          })
          .catch(err => {
            this.fail(res, err)
          })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  shopInfo(res) {
    backShop.getItemInfo()
      .then((info) => {
        this.getres(info, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteItem(res) {
    backShop.deleteItem(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneItem(res) {
    backShop.getItem(this._id)
      .then((item) => {
        this.getres(item, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  editUserOrder(res) {
    backShop.updateOrder(this._id, this.updateOrder)
      .then((result) => {
        this.updateres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  userOrderList(res) {
    backShop.getOrderList()
      .then((orderList) => {
        this.getres(orderList, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  editOneItem(res) {
    Object.assign(this.updateInfo, { main_img: `http://localhost:3009/uploads/shop/${this._id}/mainImg/${this.main_img.thumbname}` })
    backShop.updateItem(this._id, { item: this.updateItem, preview: this.updatePreview, info: this.updateInfo })
      .then((result) => {
        this.updateres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneOrder(res) {
    backShop.getOrder(this._id)
      .then((order) => {
        this.getres(order, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
}

function connectFun(Command, Connect) {
  return async (req, res) => {
    var connect = new Connect(req.body)
    await connect[Command](res)
    connect = null
  }
}

module.exports = {
  // 获取临时商品数据
  getShopTemp: connectFun('getShopTemp', bShop),
  // 更新临时商品数据
  shopTemp: connectFun('shopTemp', bShop),
  // 创建商品
  itemCreate: connectFun('itemCreate', bShop),
  // 获取商店信息列表
  shopInfo: connectFun('shopInfo', bShop),
  // 删除商品
  deleteItem: connectFun('deleteItem', bShop),
  // 获取一个商品
  getOneItem: connectFun('getOneItem', bShop),
  // 编辑用户订单
  editUserOrder: connectFun('editUserOrder', bShop),
  // 用户订单列表
  userOrderList: connectFun('userOrderList', bShop),
  // 编辑商品
  editOneItem: connectFun('editOneItem', bShop),
  // 获取一个订单
  getOneOrder: connectFun('getOneOrder', bShop)
}
