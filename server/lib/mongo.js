var Mongolass = require('mongolass')
var mongolass = new Mongolass()
mongolass.connect('mongodb://localhost:27017/NicholasBlog')
var moment = require('moment')
var objectIdToTimestamp = require('objectid-to-timestamp')
var admin = require('./module/admin-mongo')
var article = require('./module/article-mongo')
var classify = require('./module/class-mongo')
var message = require('./module/message-mongo')
var album = require('./module/album-mongo')
var shop = require('./module/shop-mongo')
var user = require('./module/user-mongo')
// 根据_id生成时间戳
mongolass.plugin('addCreateAt', {
  // 只要查询所有条件，那么一定会有最终结果
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm:ss')
    })
    return results
  },
  // 单个查询有可能是null，所以要加if
  afterFindOne: function (result) {
    if (result) {
      result.created_at = result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm:ss')
    }
    return result
  }
})
module.exports = {
  // 管理
  Admin: mongolass.model('Admin', admin.AdminInfo),
  // 文章
  // 文章
  Article: mongolass.model('Article', article.Article),
  // 文章草稿数据
  ArticleTemp: mongolass.model('ArticleTemp', article.ArticleTemp),
  // 文章赞
  ArticleLike: mongolass.model('ArticleLike', article.ArticleLike),
  // 文章预览
  ArticlePreview: mongolass.model('ArticlePreview', article.ArticlePreview),
  // 文章列表信息
  ArticleInfo: mongolass.model('ArticleInfo', article.ArticleInfo),
  // 文章评论
  ArticleComment: mongolass.model('ArticleComment', article.ArticleComment),
  // 文章评论赞
  ArticleCommentLike: mongolass.model('ArticleCommentLike', article.ArticleCommentLike),
  // 文章评论回复
  ArticleCommentReply: mongolass.model('ArticleCommentReply', article.ArticleCommentReply),

  // 分类
  // 分类
  Classify: mongolass.model('Classify', classify.Classify),

  // 留言板
  // 留言
  Message: mongolass.model('Message', message.Message),
  // 留言评论
  MessageComment: mongolass.model('MessageComment', message.MessageComment),
  // 留言回复
  MessageCommentReply: mongolass.model('MessageCommentReply', message.MessageCommentReply),
  // 留言赞
  MessageLike: mongolass.model('MessageLike', message.MessageLike),
  // 留言评论赞
  MessageCommentLike: mongolass.model('MessageCommentLike', message.MessageCommentLike),
  // 留言预览
  MessagePreview: mongolass.model('MessagePreview', message.MessagePreview),
  // 留言列表信息
  MessageInfo: mongolass.model('MessageInfo', message.MessageInfo),
  // 管理留言草稿数据
  MessageTemp: mongolass.model('MessageTemp', message.MessageTemp),

  // 相册
  // 图片
  Image: mongolass.model('Image', album.Image),
  // 图片评论
  ImageComment: mongolass.model('ImageComment', album.ImageComment),
  // 图片点赞
  ImageLike: mongolass.model('ImageLike', album.ImageLike),
  // 图片评论点赞
  ImageCommentLike: mongolass.model('ImageCommentLike', album.ImageCommentLike),
  // 图片预览
  ImagePreview: mongolass.model('ImagePreview', album.ImagePreview),
  // 图片列表信息
  ImageInfo: mongolass.model('ImageInfo', album.ImageInfo),
  // 图片草稿数据
  ImageTemp: mongolass.model('ImageTemp', album.ImageTemp),

  // 商店
  // 商品
  Item: mongolass.model('Item', shop.Item),
  // 商品预览
  ItemPreview: mongolass.model('ItemPreview', shop.ItemPreview),
  // 购物车
  CartInfo: mongolass.model('CartInfo', shop.CartInfo),
  // 商品列表信息
  ItemInfo: mongolass.model('ItemInfo', shop.ItemInfo),
  // 商品草稿数据
  ItemTemp: mongolass.model('ItemTemp', shop.ItemTemp),

  // 用户
  // 用户账号
  User: mongolass.model('User', user.User),
  // 用户信息
  UserList: mongolass.model('UserList', user.UserList),
  // 用户订单
  UserOrder: mongolass.model('UserOrder', user.UserOrder),
  // 用户通知
  UserNotify: mongolass.model('UserNotify', user.UserNotify),
  // 未读通知
  UnReadNotify: mongolass.model('UnReadNotify', user.UnReadNotify)
}
