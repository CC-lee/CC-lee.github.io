var apimodule = require('../../module')
var frontUser = apimodule.frontUser
var control = require('../control')
var sha1 = require('sha1')
var createToken = require('../../../middleware/createToken')

class fUser extends control {
  constructor({
    _id,
    email,
    password,
    passwordResetToken,
    passwordResetExpires,
    facebook,
    twitter,
    google,
    github,
    instagram,
    linkedin,
    steam,
    tokens,
    gender,
    location,
    website,
    user_id,
    user_avatar,
    user_name,
    create_date,
    update_date,
    timestamp,
    type,
      }) {
    super({
      user_id,
      user_avatar,
      user_name,
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, email })
    if (password) {
      Object.assign(this, { password: sha1(password) })
    }
    if (type) {
      if (type == 'register') {
        this.user = {
          email,
          user_name,
          password: sha1(password),
          gender,
          location,
          user_avatar,
          create_date: this.create_date,
          update_date: this.update_date,
          timestamp: this.timestamp
        }
      } else {
        this.user = {
          email,
          password,
          passwordResetToken,
          passwordResetExpires,
          facebook,
          twitter,
          google,
          github,
          instagram,
          linkedin,
          steam,
          tokens,
          profile: {
            user_name: this.user_name,
            gender,
            location,
            user_avatar: this.user_avatar
          },
          create_date: this.create_date,
          update_date: this.update_date,
          timestamp: this.timestamp
        }
      }
    }

    this.account = {
      user_name: this.user_name,
      gender,
      location,
      user_avatar: this.user_avatar,
      update_date: this.update_date
    }
    this.userinfo = {
      user_avatar: this.user_avatar,
      user_name: this.user_name
    }
    this.userlist = {
      avatar: this.user_avatar,
      name: this.user_name
    }

  }

  userRegister(res) {
    frontUser.createUser(this.user)
      .then((result) => {
        var { _id: userId } = result[0].ops[0]
        var userlist = {
          userid: `${userId}`,
          email: this.email,
          avatar: this.user_avatar,
          name: this.user_name
        }
        frontUser.userlistCreate(userlist)
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

  userLogin(res) {
    frontUser.getUser(this.email)
      .then((user) => {
        let { _id, email, user_name, password, gender, location, user_avatar } = user
        if (password == this.password) {
          var account = {
            email,
            name: user_name,
            password: this.password
          }
          var profile = {
            _id, email, user_name, gender, location, user_avatar
          }
          res.send({
            code: 200,
            token: createToken(account),
            profile: profile
          })
        } else {
          res.send({
            code: -200,
            message: '登录错误'
          })
        }
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getUserLists(res) {
    frontUser.getUserLists()
      .then((userLists) => {
        this.getres(userLists[0], res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getNotifyNum(res) {
    frontUser.getUnReadNotify(this._id)
      .then((num) => {
        this.getres(num, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getNotifyList(res) {
    frontUser.getNotify(this._id)
      .then((notify) => {
        this.getres(notify, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteOneNotify(res) {
    frontUser.deleteNotify(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOrderList(res) {
    frontUser.getOrderList(this.user_id)
      .then((orderList) => {
        this.getres(orderList, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  modifyUserPassword(res) {
    frontUser.updatePassword(this._id, { password: this.password })
      .then((result) => {
        var { ok, n } = result.slice(-1)[0].result
        if (ok && n > 0) {
          var account = {
            email: this.email,
            name: this.user_name,
            password: this.password
          }
          res.send({
            code: 200,
            token: createToken(account),
            message: '编辑成功'
          })
        }
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  modifyUserAccount(res) {
    frontUser.updateUser(this._id, this.account, this.userinfo, this.userlist)
      .then((result) => {
        this.updateres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getUserAccount(res) {
    frontUser.getUser(this.email)
      .then((account) => {
        let { _id, email, user_name, password, gender, location, user_avatar } = account
        var profile = {
          _id, email, user_name, gender, location, user_avatar
        }
        this.getres(profile, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneOrder(res) {
    frontUser.getOrder(this._id)
      .then((order) => {
        this.getres(order, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteOneOrder(res) {
    frontUser.deleteOrder(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteUnReadNotify(res) {
    frontUser.deleteUnReadNotify(this._id)
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
  // 创建用户
  userRegister: connectFun('userRegister', fUser),

  // 用户登录
  userLogin: connectFun('userLogin', fUser),

  // 获取所有用户列表
  getUserLists:connectFun('getUserLists', fUser),

  // 获取未读通知数量
  getNotifyNum: connectFun('getNotifyNum', fUser),

  // 获取通知列表
  getNotifyList: connectFun('getNotifyList', fUser),
  // 删除一条通知
  deleteOneNotify: connectFun('deleteOneNotify', fUser),

  // 获取订单列表
  getOrderList: connectFun('getOrderList', fUser),

  // 修改密码
  modifyUserPassword: connectFun('modifyUserPassword', fUser),

  // 修改账户信息
  modifyUserAccount: connectFun('modifyUserAccount', fUser),

  // 获取用户账户信息
  getUserAccount: connectFun('getUserAccount', fUser),

  // 获取一个订单
  getOneOrder: connectFun('getOneOrder', fUser),

  // 删除订单
  deleteOneOrder:connectFun('deleteOneOrder', fUser),
  // 清空未读信息
  deleteUnReadNotify: connectFun('deleteUnReadNotify', fUser)

}
