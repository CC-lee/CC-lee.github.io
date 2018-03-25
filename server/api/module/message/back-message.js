var Message = require('../../../lib/mongo').Message
var MessageComment = require('../../../lib/mongo').MessageComment
var MessageCommentReply = require('../../../lib/mongo').MessageCommentReply
var MessageLike = require('../../../lib/mongo').MessageLike
var MessageCommentLike = require('../../../lib/mongo').MessageCommentLike
var MessagePreview = require('../../../lib/mongo').MessagePreview
var MessageInfo = require('../../../lib/mongo').MessageInfo
var MessageTemp = require('../../../lib/mongo').MessageTemp
var UserNotify = require('../../../lib/mongo').UserNotify
var UnReadNotify = require('../../../lib/mongo').UnReadNotify

module.exports = {
  // 创建
  // 创建留言
  createMessage: (message, { tempId, temp }) => {
    return Promise.all([
      Message.create(message).exec(),
      MessageTemp.update({ _id: tempId }, { $set: temp }).exec()
    ])
  },
  // 创建预览与信息
  createMessagePvIf: ({ preview, info }) => {
    return Promise.all([
      MessagePreview.create(preview).exec(),
      MessageInfo.create(info).exec()
    ])
  },
  // 创建用户通知
  createUserNotify: ({ notify, unRead }) => {
    return Promise.all([
      UserNotify.create(notify).exec(),
      UnReadNotify.create(unRead).exec()
    ])
  },
  // 获取
  // 获取临时数据
  getTemp: () => {
    return MessageTemp.find().sort({ _id: -1 }).exec()
  },
  // 获取管理留言信息列表
  getAdminInfo: () => {
    return MessageInfo.find({ message_type: 'admin' }).sort({ create_date: -1 }).exec()
  },
  // 获取用户留言信息列表
  getUserInfo: () => {
    return MessageInfo.find({ message_type: 'user' }).sort({ create_date: -1 }).exec()
  },
  // 获取一条留言
  getMessage: (messageId) => {
    return Message.findOne({ _id: messageId })
  },
  // 获取评论
  getComment: (messageId) => {
    return MessageComment.find({ message_id: messageId }).sort({ time: -1 }).exec()
  },
  // 获取回复
  getReply: (commentId) => {
    return MessageCommentReply.find({ comment_id: `${commentId}` }).sort({ time: -1 }).exec()
  },
  // 计算评论数
  countComments: (messageId) => {
    return Promise.all([
      MessageComment.count({ message_id: messageId }).exec(),
      MessageCommentReply.count({ message_id: messageId }).exec()
    ])
  },
  // 更新
  // 更新留言临时数据
  updateTemp: ({ tempId, temp }) => {
    return MessageTemp.update({ _id: tempId }, { $set: temp }).exec()
  },
  // 更新留言
  updateMessage: (messageId, { message, preview, info }) => {
    return Promise.all([
      Message.update({ _id: messageId }, { $set: message }).exec(),
      MessagePreview.update({ message_id: messageId }, { $set: preview }).exec(),
      MessageInfo.update({ message_id: messageId }, { $set: info }).exec()
    ])
  },
  updateCommentNum: (messageId, num) => {
    return Promise.all([
      Message.update({ _id: messageId }, { $set: num }).exec(),
      MessageInfo.update({ message_id: messageId }, { $set: num }).exec()
    ])
  },
  // 更新评论数
  // 删除
  // 删除留言
  deleteMessage: (messageId) => {
    return Promise.all([
      Message.remove({ _id: messageId }).exec(),
      MessageComment.remove({ message_id: messageId }).exec(),
      MessageLike.remove({ message_id: messageId }).exec(),
      MessageCommentLike.remove({ message_id: messageId }).exec(),
      MessageCommentReply.remove({ message_id: messageId }).exec(),
      MessagePreview.remove({ message_id: messageId }).exec(),
      MessageInfo.remove({ message_id: messageId }).exec(),
    ])
  },
  // 删除评论
  deleteComment: (commentId, messageId, num) => {
    return Promise.all([
      MessageComment.remove({ _id: commentId }).exec(),
      MessageCommentLike.remove({ comment_id: commentId }).exec(),
      MessageCommentReply.remove({ comment_id: commentId }).exec()
    ])
  }
}
