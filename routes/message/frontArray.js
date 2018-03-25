var userToken = require('../../middleware/checkUserToken')
var frontApi = require('../../api/frontApi').message
var messageImage = require('../../middleware/messageImage')
var multer = require('multer')

var frontCreate = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/message/${req.headers['userId']}/${req.headers['dater']}`)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg')
  }
})
var frontUpload = multer({ storage: frontCreate })
function url(str) {
  return `/message/${str}`
}

var nonToken = [
  {
    command: 'post',
    url: url('messageList'),// 获取留言列表
    middleware: [],
    set: frontApi.messageList
  },
  {
    command: 'post',
    url: url('getOneMessage'),// // 获取一条留言
    middleware: [],
    set: frontApi.getOneMessage
  },
  {
    command: 'post',
    url: url('getAllComments'),// 获取所有留言评论
    middleware: [],
    set: frontApi.getAllComments
  },
  {
    command: 'post',
    url: url('getMessagesBySearch'),// 根据搜索结果获取留言
    middleware: [],
    set: frontApi.getMessagesBySearch
  }
]
var Token = [
  {
    command: 'post',
    url: url('userMessageCreate'),// 用户留言创建
    middleware: [userToken],
    set: frontApi.userMessageCreate
  },
  {
    command: 'post',
    url: url('createUserNotify'),// 发送通知
    middleware: [userToken],
    set: frontApi.createUserNotify
  },
  {
    command: 'post',
    url: url('messageLikeCancel'),// 留言赞取消
    middleware: [userToken],
    set: frontApi.messageLikeCancel
  },
  {
    command: 'post',
    url: url('messageLike'),// 发送留言赞
    middleware: [userToken],
    set: frontApi.messageLike
  },
  {
    command: 'post',
    url: url('messageComment'),// 发送留言评论
    middleware: [userToken],
    set: frontApi.messageComment
  },
  {
    command: 'post',
    url: url('commentLike'),// 发送留言评论赞
    middleware: [userToken],
    set: frontApi.commentLike
  },
  {
    command: 'post',
    url: url('commentLikeCancel'),// 留言评论赞取消
    middleware: [userToken],
    set: frontApi.commentLikeCancel
  },
  {
    command: 'post',
    url: url('messageReply'),// 留言评论回复
    middleware: [userToken],
    set: frontApi.messageReply
  },
  {
    command: 'post',
    url: url('frontSaveImage'),// 保存图片
    middleware: [userToken, messageImage.fontFolder, frontUpload.any()],
    set: messageImage.frontSaveImage
  },
]
var frontArray = nonToken.concat(Token)

module.exports = frontArray