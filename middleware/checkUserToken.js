var apimodule = require('../api/module')
var frontUser = apimodule.frontUser
var backUser = apimodule.backUser
const salt = 'NicholasLeeBlog';
// ????验证token中间件
var jwt = require('jsonwebtoken')
module.exports = function (req, res, next) {
  if (req.headers['authorization']) {
    var { email, name, password, exp } = jwt.decode(req.headers['authorization'], salt);
    frontUser.getUser(email)
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
      .catch(err => {
        (res, err) => {
          res.send({
            code: -200,
            message: err.toString()
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
