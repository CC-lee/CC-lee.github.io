var apimodule = require('../../module')
var sha1 = require('sha1')
var admin = apimodule.admin
var createToken = require('../../../middleware/createToken')
var control = require('../control')

class Admin extends control {
  constructor({
    _id,
    admin_name,
    gender,
    email,
    avatar,
    password,
    create_date,
    update_date
   }) {
    super({
      create_date,
      update_date,
    })
    Object.assign(this, { _id, email, admin_name, avatar })
    this.profile = {
      admin_name,
      gender,
      email,
      avatar,
      create_date: this.create_date,
      update_date: this.update_date
    }
    this.updateProfile = {
      admin_name,
      gender,
      email,
      avatar,
      update_date: this.update_date
    }
    this.updateMessage = {
      user_name: this.admin_name,
      user_avatar: this.avatar
    }
    this.account = {
      email,
      name: admin_name
    }
    if (password) {
      Object.assign(this, { password: sha1(password) })
      Object.assign(this.profile, { password: sha1(password) })
      Object.assign(this.updateProfile, { password: sha1(password) })
      Object.assign(this.account, { password: sha1(password) })
    }
    this.articleTemp = {}
    this.messageTemp = {}
    this.imageTemp = {}
    this.itemTemp = {}
  }
  adminLogin(res) {
    admin.getAdmin(this.email)
      .then((profile) => {
        let { email, admin_name, password } = profile
        if (password == this.password) {
          var account = {
            email,
            name: admin_name,
            password: this.password
          }
          res.send({
            code: 200,
            token: createToken(account)
          })
        } else {
          res.send({
            code: -200,
            message: '登录错误'
          })
        }
      })
      .catch(err => {
        res.send({
          code: -200,
          message: err.toString()
        })
      })
  }
  adminRegister(res) {
    admin.createAdmin({ admin: this.profile, articleTemp: {}, messageTemp: {}, imageTemp: {}, itemTemp: {} })
      .then((result) => {
        res.send({
          // 创建用户成功
          code: 200,
          token: createToken(this.account)
        })
      })
      .catch(err => {
        // 操作数据库的时候发生错误
        if (err.message.match('E11000 duplicate key')) {
          return res.json({
            code: -200,
            message: '用户名重复'
          })
        }
        // 服务器发生错误（例如status:）
        return res.json({
          code: -200,
          message: err.toString()
        })
      })
  }
  adminProfile(res) {
    admin.getAdmin(this.email)
      .then((profile) => {
        if (profile) {
          var { _id, admin_name, avatar, email, gender } = profile
          res.send({
            code: 200,
            profile: { _id, admin_name, avatar, email, gender }
          })
        } else {
          throw new Error('找不到该用户')
        }
      })
      .catch(err => {
        res.send({
          code: -200,
          message: err.toString()
        })
      })
  }
  modifyProfile(res) {
    admin.updateAdmin(this._id, { admin: this.updateProfile, message: this.updateMessage })
      .then((result) => {
        var { ok, n } = result.slice(-1)[0].result
        if (ok && n > 0) {
          if (this.account.password) {
            res.send({
              code: 200,
              message: '编辑成功',
              token: createToken(this.account)
            })
          } else {
            res.send({
              code: 200,
              message: '编辑成功'
            })
          }
        } else {
          throw new Error('编辑失败');
        }
      })
      .catch(err => {
        res.send({
          code: -200,
          message: err.toString()
        })
      })
  }
}

module.exports = {
  // 验证登录信息
  adminLogin: async (req, res) => {
    var adminer = new Admin(req.body)
    await adminer.adminLogin(res)
    adminer = null
  },
  // 创建注册信息
  adminRegister: async (req, res) => {
    var adminer = new Admin(req.body)
    await adminer.adminRegister(res)
    adminer = null
  },
  // 获取账号信息
  adminProfile: async (req, res) => {
    var adminer = new Admin(req.body)
    await adminer.adminProfile(res)
    adminer = null
  },
  // 修改账号信息
  modifyProfile: async (req, res) => {
    var adminer = new Admin(req.body)
    await adminer.modifyProfile(res)
    adminer = null
  }
}
