var jwt = require('jsonwebtoken')
module.exports = function (account) {
  var { email, name, password } = account
  var expiry = new Date();
  const salt = 'NicholasLeeBlog';
  expiry.setDate(expiry.getDate() + 7);//有效期设置为七天
  const token = jwt.sign({
    email: `${email}`,
    name: `${name}`,
    password: `${password}`,
    exp: parseInt(expiry.getTime() / 1000)//除以1000以后表示的是秒数
  },salt)
  return token;
}
