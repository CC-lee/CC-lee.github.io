var apimodule = require('../api/module')
var admin = apimodule.admin
const salt = 'NicholasLeeBlog';
// ????验证token中间件
var jwt = require('jsonwebtoken')
module.exports = function (req, res, next) {
  if (req.headers['authorization']) {
    var { email, name, password, exp } = jwt.decode(req.headers['authorization'], salt);
    admin.getAdmin(email)
      .then((profile) => {
        if (profile.password == password) {
          if (exp <= Date.now() / 1000) {
            return res.send({
              code: 401,
              message: "授权已经过期，请重新登陆"
            })
          } else {
            next()
          }
        } else {
          return res.send({
            code: 401,
            message: "密码错误，请重新登陆"
          })
        }
      })
  } else {
    return res.send({
      code: 401,
      message: "请登陆"
    })
  }
}
