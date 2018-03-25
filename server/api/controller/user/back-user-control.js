var apimodule = require('../../module')
var backUser = apimodule.backUser
var control = require('../control')

class bUser extends control {
  constructor({
        _id,
    user_id,
    user_avatar,
    user_name,
    create_date,
    update_date,
    timestamp
      }) {
    super({
      user_id,
      user_avatar,
      user_name,
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id })
  }

  userList(res) {
    backUser.getUserList()
      .then((userList) => {
        this.getres(userList, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteUser(res) {
    backUser.deleteUser(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
}

module.exports = {
  // 用户信息列表
  userList: (req, res) => {
    var users = new bUser(req.body)
    users.userList(res)
  },
  // 删除用户
  deleteUser: (req, res) => {
    var users = new bUser(req.body)
    users.deleteUser(res)
  }
}
