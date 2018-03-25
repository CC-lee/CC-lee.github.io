var apimodule = require('../../module')
var backClass = apimodule.backClass
var control = require('../control')

class bClass extends control {
  constructor({
    _id,
    classify,
    create_date,
    update_date,
    timestamp
      }) {
    super({
      create_date,
      update_date,
      timestamp
    })
    this.classify = {
      classify,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.updateClassify = {
      classify,
      update_date: this.update_date
    }
    Object.assign(this, { _id })
  }

  classList(res) {
    backClass.getAllClass()
      .then((list) => {
        this.getres(list, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneClass(res) {
    backClass.getOneClass(this._id)
      .then((classify) => {
        this.getres(classify, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  classCreate(res) {
    backClass.createClass(this.classify)
      .then((result) => {
        this.createres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  editOneClass(res) {
    backClass.updateClass(this._id, this.updateClassify)
      .then((result) => {
        this.updateres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  removeClass(res) {
    backClass.removeClass(this._id)
      .then((result) => {
        this.deleteres(result, res)
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
  // 获取所有分类
  classList: connectFun('classList', bClass),
  // 创建分类
  classCreate: connectFun('classCreate', bClass),
  // 获取一个分类
  getOneClass: connectFun('getOneClass', bClass),
  // 编辑分类
  editOneClass: connectFun('editOneClass', bClass),
  // 删除分类
  removeClass: connectFun('removeClass', bClass),
}
