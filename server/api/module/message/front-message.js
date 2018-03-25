var Message = require('../../../lib/mongo').Message
var MessageComment = require('../../../lib/mongo').MessageComment
var MessageCommentReply = require('../../../lib/mongo').MessageCommentReply
var MessageLike = require('../../../lib/mongo').MessageLike
var MessageCommentLike = require('../../../lib/mongo').MessageCommentLike
var MessagePreview = require('../../../lib/mongo').MessagePreview
var MessageInfo = require('../../../lib/mongo').MessageInfo
var UserNotify = require('../../../lib/mongo').UserNotify
var UnReadNotify = require('../../../lib/mongo').UnReadNotify

module.exports = {
  // 创建
  // 创建留言
  createMessage: (message) => {
    return Promise.all([Message.create(message).exec()])
  },
  // 创建预览与信息
  createMessagePvIf: ({ preview, info }) => {
    return Promise.all([
      MessagePreview.create(preview).exec(),
      MessageInfo.create(info).exec()
    ])
  },
  // 创建用户通知
  createUserNotify: (notify, unRead) => {
    return Promise.all([
      UnReadNotify.create(unRead).exec(),
      UserNotify.create(notify).exec()
    ])
  },
  // 创建评论
  createComment: (comment) => {
    return Promise.all([
      MessageComment.create(comment).exec()
    ])
  },
  // 创建回复
  createReply: (reply) => {
    return Promise.all([
      MessageCommentReply.create(reply).exec()
    ])
  },
  // 创建留言赞
  createLike: (like) => {
    return Promise.all([
      MessageLike.create(like).exec()
    ])
  },
  // 创建评论赞
  createCommentLike: (commentLike) => {
    return Promise.all([
      MessageCommentLike.create(commentLike).exec()
    ])
  },
  // 获取
  // 获取所有部分留言预览
  getPreview: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        MessagePreview.find().sort({ create_date: -1 }).skip(skip).limit(limit).exec(),
        MessagePreview.count().exec()
      ])
    } else {
      return MessagePreview.find().sort({ create_date: -1 }).exec()
    }
  },
  // 获取所有留言集合，带分页
  getAllMessage: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        Message.find().sort({ create_date: -1 }).skip(skip).limit(limit).exec(),
        Message.count().exec()
      ])
    } else {
      return Message.find().sort({ _id: -1 }).exec()
    }
  },
  // 获取留言
  getMessage: (messageId) => {
    return Message.findOne({ _id: messageId })
  },
  // 根据关键字获取留言集合,带分页
  getMessagesBySearch: (key, page, limit) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        Message.find({ key }).sort({ create_date: -1 }).skip(skip).limit(limit).exec(),
        Message.count().exec()
      ])
    } else {
      return Message.find({ key }).sort({ _id: -1 }).exec()
    }
  },
  // 获取评论
  getComment: (messageId) => {
    return MessageComment.find({ message_id: messageId }).sort({ _id: -1 }).exec()
  },
  // 获取回复
  getReply: (commentId) => {
    return MessageCommentReply.find({ comment_id: `${commentId}` }).sort({ _id: -1 }).exec()
  },
  // 获取留言赞
  getLike: (userid, messageId) => {
    if (messageId) {
      return MessageLike.find({ user_id: userid, message_id: messageId }).exec()
    } else {
      return MessageLike.find({ user_id: userid }).exec()
    }
  },
  // 获取评论赞
  getCommentLike: (userid) => {
    return MessageCommentLike.find({ user_id: userid }).exec()
  },
  // 计算评论数
  countComments: (messageId) => {
    return Promise.all([
      MessageComment.count({ message_id: messageId }).exec(),
      MessageCommentReply.count({ message_id: messageId }).exec()
    ])
  },
  // 计算赞数
  countLikes: (messageId) => {
    return MessageLike.count({ message_id: messageId }).exec()
  },
  // 计算评论赞数
  countCommentLikes: (commentId) => {
    return MessageCommentLike.count({ comment_id: commentId }).exec()
  },
  // 更新
  // 更新评论数
  updateCommentNum: (messageId, num) => {
    return Promise.all([
      Message.update({ _id: messageId }, { $set: num }).exec(),
      MessageInfo.update({ message_id: messageId }, { $set: num }).exec()
    ])
  },
  // 更新留言赞数
  updateLikeNum: (messageId, num) => {
    return Promise.all([
      Message.update({ _id: messageId }, { $set: num }).exec(),
      MessageInfo.update({ message_id: messageId }, { $set: num }).exec()
    ])
  },
  // 更新留言评论赞数
  updateCommentLikeNum: (commentId, num) => {
    return Promise.all([MessageComment.update({ _id: commentId }, { $set: num }).exec()])
  },
  // 删除
  // 删除赞
  deleteLike: ({ messageId, userId }) => {
    return MessageLike.remove({ message_id: messageId, user_id: userId }).exec()
  },
  // 删除评论赞
  deleteCommentLike: ({ commentId, userId }) => {
    return Promise.all([
      MessageCommentLike.remove({ comment_id: commentId, user_id: userId }).exec()
    ])
  }
}
