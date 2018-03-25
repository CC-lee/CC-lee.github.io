var frontApi = require('../../api/frontApi').album
var userToken = require('../../middleware/checkUserToken')
function url(str) {
  return `/album/${str}`
}
var nonToken = [
  {
    command: 'post',
    url: url('albumList'),// 获取相册列表
    middleware: [],
    set: frontApi.albumList
  },
  {
    command: 'post',
    url: url('frontOneImage'),// 获取一张图片
    middleware: [],
    set: frontApi.getOneImage
  },
  {
    command: 'post',
    url: url('frontAllComments'),// 获取一张图片的全部评论
    middleware: [],
    set: frontApi.getAllComments
  }
]
var Token = [
  {
    command: 'post',
    url: url('imageComment'),// 发送评论
    middleware: [userToken],
    set: frontApi.imageComment
  },
  {
    command: 'post',
    url: url('imageLike'),// 图片赞
    middleware: [userToken],
    set: frontApi.imageLike
  },
  {
    command: 'post',
    url: url('imageLikeCancel'),// 图片赞取消
    middleware: [userToken],
    set: frontApi.imageLikeCancel
  },
  {
    command: 'post',
    url: url('commentLike'),// 评论点赞
    middleware: [userToken],
    set: frontApi.commentLike
  },
  {
    command: 'post',
    url: url('commentLikeCancel'),// 评论赞取消
    middleware: [userToken],
    set: frontApi.commentLikeCancel
  }
]

var frontArray = nonToken.concat(Token)
module.exports = frontArray