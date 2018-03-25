var User = require('../../../lib/mongo').User
var UserOrder = require('../../../lib/mongo').UserOrder
var UserNotify = require('../../../lib/mongo').UserNotify
var UnReadNotify = require('../../../lib/mongo').UnReadNotify
var ImageComment = require('../../../lib/mongo').ImageComment
var ArticleComment = require('../../../lib/mongo').ArticleComment
var MessageComment = require('../../../lib/mongo').MessageComment
var ArticleLike = require('../../../lib/mongo').ArticleLike
var ArticleCommentLike = require('../../../lib/mongo').ArticleCommentLike
var MessageLike = require('../../../lib/mongo').MessageLike
var MessageCommentLike = require('../../../lib/mongo').MessageCommentLike
var ImageLike = require('../../../lib/mongo').ImageLike
var ImageCommentLike = require('../../../lib/mongo').ImageCommentLike
var MessageCommentReply = require('../../../lib/mongo').MessageCommentReply
var ArticleCommentReply = require('../../../lib/mongo').ArticleCommentReply
var CartInfo = require('../../../lib/mongo').CartInfo

module.exports = {
  // 创建
  // 获取
  // 获取所有用户信息列表
  getUserList: () => {
    return User.find().sort({ create_date: -1 }).exec()
  },
  // 更新
  //
  // 删除
  // 删除用户
  deleteUser: (userId) => {
    return Promise.all([
      User.remove({ _id: userId }).exec(),
      UserOrder.remove({ user_id: userId }).exec(),
      UserNotify.remove({ user_id: userId }).exec(),
      ImageComment.remove({ user_id: userId }).exec(),
      ArticleComment.remove({ user_id: userId }).exec(),
      MessageComment.remove({ user_id: userId }).exec(),
      ArticleLike.remove({ user_id: userId }).exec(),
      ArticleCommentLike.remove({ user_id: userId }).exec(),
      ArticleCommentLike.remove({ target_id: userId }).exec(),
      MessageLike.remove({ user_id: userId }).exec(),
      MessageCommentLike.remove({ user_id: userId }).exec(),
      MessageCommentLike.remove({ target_id: userId }).exec(),
      ImageLike.remove({ user_id: userId }).exec(),
      ImageCommentLike.remove({ user_id: userId }).exec(),
      ImageCommentLike.remove({ target_id: userId }).exec(),
      MessageCommentReply.remove({ user_id: userId }).exec(),
      ArticleCommentReply.remove({ user_id: userId }).exec(),
      MessageCommentReply.remove({ reply_user_id: userId }).exec(),
      ArticleCommentReply.remove({ reply_user_id: userId }).exec(),
      CartInfo.remove({ user_id: userId }).exec(),
      UnReadNotify.remove({ receiver_id: userId }).exec()
    ])
  },
  // 更新所有因删除用户所带来的改变
  updateAll: () => {

  }
}

