var User = require('../../../lib/mongo').User
var UserList = require('../../../lib/mongo').UserList
var UserOrder = require('../../../lib/mongo').UserOrder
var UserNotify = require('../../../lib/mongo').UserNotify
var UnReadNotify = require('../../../lib/mongo').UnReadNotify
var ImageComment = require('../../../lib/mongo').ImageComment
var ArticleComment = require('../../../lib/mongo').ArticleComment
var MessageComment = require('../../../lib/mongo').MessageComment
var MessageCommentReply = require('../../../lib/mongo').MessageCommentReply
var ArticleCommentReply = require('../../../lib/mongo').ArticleCommentReply

module.exports = {
  // 创建
  // 创建用户
  createUser: (user) => {
    return Promise.all([User.create(user).exec()])
  },
  // 创建用户信息
  userlistCreate: (userlist) => {
    return Promise.all([UserList.create(userlist).exec()])
  },
  // 获取
  // 获取用户账户信息
  getUser: (email) => {
    return User.findOne({ email: email }).exec()
  },
  getUserLists: () => {
    return Promise.all([UserList.find().sort({ _id: -1 }).exec()])
  },
  // 获取订单列表
  getOrderList: (userId) => {
    return Promise.all([UserOrder.find({ user_id: userId }).sort({ create_date: -1 }).exec()])
  },
  // 获取一个订单
  getOrder: (orderId) => {
    return Promise.all([UserOrder.findOne({ _id: orderId })])
  },
  // 获取未读通知数量
  getUnReadNotify: (userId) => {
    return Promise.all([UnReadNotify.count({ receiver_id: userId }).exec()])
  },
  // 获取通知列表
  getNotify: (userId) => {
    return Promise.all([UserNotify.find({ user_id: userId }).sort({ create_date: -1 }).exec()])
  },
  // 更新
  // 更新用户账户信息
  updateUser: (userId, account, userinfo, userlist) => {
    return Promise.all([
      ImageComment.update({ user_id: userId }, { $set: userinfo }).exec(),
      ArticleComment.update({ user_id: userId }, { $set: userinfo }).exec(),
      MessageComment.update({ user_id: userId }, { $set: userinfo }).exec(),
      MessageCommentReply.update({ user_id: userId }, { $set: userinfo }).exec(),
      ArticleCommentReply.update({ user_id: userId }, { $set: userinfo }).exec(),
      UserList.update({ userid: userId }, { $set: userlist }).exec(),
      User.update({ _id: userId }, { $set: account }).exec()
    ])
  },
  // 更新用户列表信息
  updateUserList: (userId, userlist) => {
    return Promise.all([UserList.update({ user_id: userId }, { $set: userlist }).exec()])
  },
  // 更新用户密码
  updatePassword: (userId, password) => {
    return Promise.all([User.update({ _id: userId }, { $set: password }).exec()])
  },
  // 删除
  // 删除一个订单
  deleteOrder: (orderId) => {
    return Promise.all([UserOrder.remove({ _id: orderId }).exec()])
  },
  // 删除一条通知
  deleteNotify: (notifyId) => {
    return Promise.all([UserNotify.remove({ _id: notifyId }).exec()])
  },
  // 清空未读信息
  deleteUnReadNotify: (userId) => {
    return Promise.all([UnReadNotify.remove({ receiver_id: userId }).exec()])
  }
}

