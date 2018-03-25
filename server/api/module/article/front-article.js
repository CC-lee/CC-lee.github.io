var Article = require('../../../lib/mongo').Article
var ArticleLike = require('../../../lib/mongo').ArticleLike
var ArticlePreview = require('../../../lib/mongo').ArticlePreview
var ArticleInfo = require('../../../lib/mongo').ArticleInfo
var ArticleComment = require('../../../lib/mongo').ArticleComment
var ArticleCommentLike = require('../../../lib/mongo').ArticleCommentLike
var ArticleCommentReply = require('../../../lib/mongo').ArticleCommentReply

module.exports = {
  // 创建
  // 创建评论
  createComment: (comment) => {
    return Promise.all([
      ArticleComment.create(comment).exec()
    ])
  },
  // 创建回复
  createReply: (reply) => {
    return Promise.all([
      ArticleCommentReply.create(reply).exec()
    ])
  },
  // 创建文章赞
  createLike: (like) => {
    return Promise.all([
      ArticleLike.create(like).exec()
    ])
  },
  // 创建评论赞
  createCommentLike: (commentLike) => {
    return Promise.all([
      ArticleCommentLike.create(commentLike).exec()
    ])
  },
  // 获取
  // 获取所有文章预览，带分页
  getPreview: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        ArticlePreview.find().sort({ create_date: -1 }).skip(skip).limit(limit).exec(),
        ArticlePreview.count().exec()
      ])
    } else {
      return Article.find().sort({ create_date: -1 }).exec()
    }
  },
  // 根据关键字获取文章集合，带分页
  getArticlesBySearch: (key, page, limit) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        Article.find({ key }).sort({ _id: -1 }).skip(skip).limit(limit).exec(),
        Article.count().exec()
      ])
    } else {
      return Article.find({ $or: key }).sort({ _id: -1 }).exec()
    }
  },
  // 获取文章
  getArticle: (articleId) => {
    return Article.findOne({ _id: articleId })
  },
  // 获取评论
  getComment: (articleId) => {
    return ArticleComment.find({ article_id: articleId }).sort({ time: -1 }).exec()
  },
  // 获取回复
  getReply: (commentId) => {
    return ArticleCommentReply.find({ comment_id: `${commentId}` }).sort({ time: -1 }).exec()
  },
  // 获取文章赞
  getLike: (userid, articleId) => {
    if (articleId) {
      return ArticleLike.find({ user_id: userid, article_id: articleId }).exec()
    } else {
      return ArticleLike.find({ user_id: userid }).exec()
    }
  },
  // 获取评论赞
  getCommentLike: (userid) => {
    return ArticleCommentLike.find({ user_id: userid }).exec()
  },
  // 计算评论数
  countComments: (articleId) => {
    return Promise.all([
      ArticleComment.count({ article_id: articleId }).exec(),
      ArticleCommentReply.count({ article_id: articleId }).exec()
    ])
  },
  // 计算赞数
  countLikes: (articleId) => {
    return ArticleLike.count({ article_id: articleId }).exec()
  },
  // 计算评论赞数
  countCommentLikes: (commentId) => {
    return ArticleCommentLike.count({ comment_id: commentId }).exec()
  },
  // 更新
  // 更新评论数
  updateCommentNum: (articleId, num) => {
    return Promise.all([
      Article.update({ _id: articleId }, { $set: num }).exec(),
      ArticlePreview.update({ article_id: articleId }, { $set: num }).exec(),
      ArticleInfo.update({ article_id: articleId }, { $set: num }).exec()
    ])
  },
  // 更新文章赞数
  updateLikeNum: (articleId, num) => {
    return Promise.all([
      Article.update({ _id: articleId }, { $set: num }).exec(),
      ArticlePreview.update({ article_id: articleId }, { $set: num }).exec(),
      ArticleInfo.update({ article_id: articleId }, { $set: num }).exec()
    ])
  },
  // 更新文章评论赞数
  updateCommentLikeNum: (commentId, num) => {
    return Promise.all([ArticleComment.update({ _id: commentId }, { $set: num }).exec()])
  },
  // 删除
  // 删除赞
  deleteLike: function ({ articleId, userId }) {
    return ArticleLike.remove({ article_id: articleId, user_id: userId }).exec()
  },
  // 删除评论赞
  deleteCommentLike: ({ commentId, userId }) => {
    return Promise.all([
      ArticleCommentLike.remove({ comment_id: commentId, user_id: userId }).exec()
    ])
  }
}
