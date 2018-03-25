var Article = require('../../../lib/mongo').Article
var ArticleTemp = require('../../../lib/mongo').ArticleTemp
var ArticleLike = require('../../../lib/mongo').ArticleLike
var ArticlePreview = require('../../../lib/mongo').ArticlePreview
var ArticleInfo = require('../../../lib/mongo').ArticleInfo
var ArticleComment = require('../../../lib/mongo').ArticleComment
var ArticleCommentLike = require('../../../lib/mongo').ArticleCommentLike
var ArticleCommentReply = require('../../../lib/mongo').ArticleCommentReply

module.exports = {
  // 创建
  // 创建文章
  createArticle: (article, { tempId, temp }) => {
    return Promise.all([
      Article.create(article).exec(),
      ArticleTemp.update({ _id: tempId }, { $set: temp }).exec()
    ])
  },
  // 创建预览与信息
  createArticlePvIf: ({ preview, info }) => {
    return Promise.all([
      ArticlePreview.create(preview).exec(),
      ArticleInfo.create(info).exec()
    ])
  },
  // 获取
  // 获取临时数据
  getTemp: () => {
    return ArticleTemp.find().exec()
  },
  // 获取文章信息列表
  getInfo: () => {
    return ArticleInfo.find().sort({ update_date: -1 }).exec()
  },
  // 获取一篇文章
  getArticle: (articleId) => {
    var obj = { '_id': articleId }
    return Article.findOne(obj)
  },
  // 获取评论
  getComment: (articleId) => {
    return ArticleComment.find({ article_id: articleId }).sort({ time: -1 }).exec()
  },
  // 获取回复
  getReply: (commentId) => {
    return ArticleCommentReply.find({ comment_id: `${commentId}` }).sort({ time: -1 }).exec()
  },
  // 计算评论数
  countComments: (articleId) => {
    return Promise.all([
      ArticleComment.count({ article_id: articleId }).exec(),
      ArticleCommentReply.count({ article_id: articleId }).exec()
    ])
  },
  // 更新
  // 更新文章临时数据
  updateTemp: ({ tempId, temp }) => {
    var obj = {}
    var ids = '_id'
    obj[ids] = tempId
    return ArticleTemp.update(obj, { $set: temp }).exec()
  },
  // 更新文章
  updateArticle: (articleId, { article, preview, info }) => {
    return Promise.all([
      Article.update({ _id: articleId }, { $set: article }).exec(),
      ArticleInfo.update({ article_id: articleId }, { $set: info }).exec(),
      ArticlePreview.update({ article_id: articleId }, { $set: preview }).exec()
    ])
  },
  // 更新评论数
  updateCommentNum: (articleId, num) => {
    return Promise.all([
      Article.update({ _id: articleId }, { $set: num }).exec(),
      ArticlePreview.update({ article_id: articleId }, { $set: num }).exec(),
      ArticleInfo.update({ article_id: articleId }, { $set: num }).exec()
    ])
  },
  // 删除
  // 删除文章
  deleteArticle: (articleId) => {
    return Promise.all([
      Article.remove({ _id: articleId }).exec(),
      ArticleComment.remove({ article_id: articleId }).exec(),
      ArticleLike.remove({ article_id: articleId }).exec(),
      ArticleCommentLike.remove({ article_id: articleId }).exec(),
      ArticleCommentReply.remove({ article_id: articleId }).exec(),
      ArticlePreview.remove({ article_id: articleId }).exec(),
      ArticleInfo.remove({ article_id: articleId }).exec()
    ])
  },
  // 删除评论
  deleteComment: (commentId) => {
    return Promise.all([
      ArticleComment.remove({ _id: commentId }).exec(),
      ArticleCommentLike.remove({ comment_id: commentId }).exec(),
      ArticleCommentReply.remove({ comment_id: commentId }).exec(),
    ])
  }
}

