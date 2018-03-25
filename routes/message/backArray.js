var adminToken = require('../../middleware/checkAdminToken')
var backApi = require('../../api/backApi').message
var messageImage = require('../../middleware/messageImage')
var upload = require('../../middleware/multerSet')('message', 'create')


function url(str) {
  return `/message/${str}`
}
var nonImage = [
  {
    command: 'get',
    url: url('getMessageTemp'),// 获取临时数据
    middleware: [adminToken],
    set: backApi.getMessageTemp
  },
  {
    command: 'post',
    url: url('createBackNotify'),// 发送通知
    middleware: [adminToken],
    set: backApi.createUserNotify
  },
  {
    command: 'get',
    url: url('adminMessageList'),// 管理留言信息列表
    middleware: [adminToken],
    set: backApi.adminMessageList
  },
  {
    command: 'get',
    url: url('userMessageList'),// 用户留言信息列表
    middleware: [adminToken],
    set: backApi.userMessageList
  },
  {
    command: 'post',
    url: url('getAdminMessage'),// 获取一条管理留言
    middleware: [adminToken],
    set: backApi.getAdminMessage
  },
  {
    command: 'post',
    url: url('backAllComments'),// 留言评论获取
    middleware: [adminToken],
    set: backApi.getAllComments
  },
  {
    command: 'post',
    url: url('deleteOneComment'),// 删除一条留言评论
    middleware: [adminToken],
    set: backApi.deleteOneComment
  },
]
var image = [
  {
    command: 'post',
    url: url('messageTemp'),// 更新临时数据
    middleware: [adminToken, messageImage.tempProcessJudge, messageImage.tempProcess],
    set: backApi.messageTemp
  },
  {
    command: 'post',
    url: url('adminMessageCreate'),// 管理留言创建
    middleware: [adminToken, messageImage.createProcessJudge, messageImage.createProcess],
    set: backApi.adminMessageCreate
  },
  {
    command: 'post',
    url: url('editAdminMessage'),// 管理留言编辑
    middleware: [adminToken],
    set: backApi.editAdminMessage
  },
  {
    command: 'post',
    url: url('messageDelete'),// 留言删除
    middleware: [adminToken, messageImage.deleteAllJudge, messageImage.deleteAllImage],
    set: backApi.messageDelete
  },
  {
    command: 'post',
    url: url('createSaveImage'),// 创建管理者留言保存图片
    middleware: [adminToken, messageImage.createFolderJudge, upload.array('images', 12)],
    set: messageImage.createSaveImage
  },
  {
    command: 'post',
    url: url('createLoadImage'),// 加载草稿文件夹图片
    middleware: [adminToken],
    set: messageImage.createLoadImage
  },
  {
    command: 'post',
    url: url('deleteImage'),// 删除图片
    middleware: [adminToken, messageImage.deleteJudge],
    set: messageImage.deleteImage
  },
]
var backArray = nonImage.concat(image)

module.exports = backArray