var Admin = require('../../../lib/mongo').Admin
var Message = require('../../../lib/mongo').Message
var ArticleTemp = require('../../../lib/mongo').ArticleTemp
var MessageTemp = require('../../../lib/mongo').MessageTemp
var ImageTemp = require('../../../lib/mongo').ImageTemp
var ItemTemp = require('../../../lib/mongo').ItemTemp

module.exports = {
  // 创建
  // 创建一个管理账号
  createAdmin: ({ admin, articleTemp, messageTemp, imageTemp, itemTemp }) => {
    return Promise.all([
      Admin.create(admin).exec(),
      ArticleTemp.create(articleTemp).exec(),
      MessageTemp.create(messageTemp).exec(),
      ImageTemp.create(imageTemp).exec(),
      ItemTemp.create(itemTemp).exec()
    ])
  },
  // 获取
  // 获取一个管理账号
  getAdmin: (email) => {
    var obj = { 'email': email }
    return Admin.findOne(obj).exec()
  },
  // 更新
  // 更新一个管理账号
  updateAdmin: (adminId, { admin, message }) => {
    return Promise.all([
      Admin.update({ _id: `${adminId}` }, { $set: admin }).exec(),
      Message.update({ user_id: `${adminId}` }, { $set: message }).exec()
    ])
  }
  // 删除
}
