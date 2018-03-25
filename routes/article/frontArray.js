var userToken = require('../../middleware/checkUserToken')
var frontApi = require('../../api/frontApi').article
function url(str) {
  return `/article/${str}`
}
var nonToken = [
  {
    command: 'post',
    url: url('articlePreview'),// 获取文章预览列表
    middleware: [],
    set: frontApi.articlePreview
  },
  {
    command: 'post',
    url: url('frontOneArticle'),// 获取一篇文章
    middleware: [],
    set: frontApi.getOneArticle
  },
  {
    command: 'post',// 获取所有评论
    url: url('frontAllComments'),
    middleware: [],
    set: frontApi.getAllComments
  },
  {
    command: 'get',
    url: url('getArticlesBySearch'),// 根据搜索结果获取文章
    middleware: [],
    set: frontApi.getArticlesBySearch
  }
]

var Token = [
  {
    command: 'post',
    url: url('articleLike'),// 发送文章赞
    middleware: [userToken],
    set: frontApi.articleLike
  },
  {
    command: 'post',
    url: url('articleLikeCancel'),// 取消文章赞
    middleware: [userToken],
    set: frontApi.articleLikeCancel
  },
  {
    command: 'post',
    url: url('articleComment'),// 发送评论
    middleware: [userToken],
    set: frontApi.articleComment
  },
  {
    command: 'post',
    url: url('commentLike'),// 发送评论点赞
    middleware: [userToken],
    set: frontApi.commentLike
  },
  {
    command: 'post',
    url: url('commentLikeCancel'),// 取消评论点赞
    middleware: [userToken],
    set: frontApi.commentLikeCancel
  },
  {
    command: 'post',// 发送回复
    url: url('articleReply'),
    middleware: [userToken],
    set: frontApi.articleReply
  }
]

var frontArray = nonToken.concat(Token)

module.exports = frontArray