var Image = require('../../../lib/mongo').Image
var ImageComment = require('../../../lib/mongo').ImageComment
var ImageLike = require('../../../lib/mongo').ImageLike
var ImageCommentLike = require('../../../lib/mongo').ImageCommentLike
var ImagePreview = require('../../../lib/mongo').ImagePreview
var ImageInfo = require('../../../lib/mongo').ImageInfo
var ImageTemp = require('../../../lib/mongo').ImageTemp

module.exports = {
  // 创建
  // 创建评论
  createComment: (imageId, comment) => {
    return Promise.all([
      ImageComment.create(comment).exec(),
      ImageComment.count({ image_id: imageId }).exec()
    ])
  },
  //创建图片赞
  createLike: (like) => {
    return Promise.all([
      ImageLike.create(like).exec(),
    ])
  },
  // 创建评论赞
  createCommentLike: (commentLike) => {
    return Promise.all([
      ImageCommentLike.create(commentLike).exec(),
    ])
  },
  // 获取
  // 获取图片
  getImage: (imageId) => {
    return Image.findOne({ _id: imageId })
  },
  // 获取评论
  getComment: (imageId) => {
    return ImageComment.find({ image_id: imageId }).sort({ time: -1 }).exec()
  },
  // 获取预览，带分页
  getPreview: ({ page, limit }) => {
    if (page && limit) {
      var skip = (page - 1) * limit
      return Promise.all([
        ImagePreview.find().sort({ create_date: -1 }).skip(skip).limit(limit).exec(),
        ImagePreview.count().exec()
      ])
    } else {
      return ImagePreview.find().sort({ create_date: -1 }).exec()
    }
  },
  // 获取文章赞
  getLike: (userid, imageId) => {
    return ImageLike.find({ user_id: userid, image_id: imageId }).exec()
  },
  // 获取评论赞
  getCommentLike: (userid) => {
    return ImageCommentLike.find({ user_id: userid }).exec()
  },
  // 计算评论数
  countComments: (imageId) => {
    return ImageComment.count({ image_id: imageId }).exec()
  },
  // 计算赞数
  countLikes: (imageId) => {
    return ImageLike.count({ image_id: imageId }).exec()
  },
  // 计算评论赞数
  countCommentLikes: (commentId) => {
    return ImageCommentLike.count({ comment_id: commentId }).exec()
  },
  // 更新
  // 更新评论数
  updateCommentNum: (imageId, num) => {
    return Promise.all([
      Image.update({ _id: imageId }, { $set: num }).exec(),
      ImagePreview.update({ image_id: imageId }, { $set: num }).exec(),
      ImageInfo.update({ image_id: imageId }, { $set: num }).exec()
    ])
  },
  // 更新图片赞数
  updateLikeNum: (imageId, num) => {
    return Promise.all([
      Image.update({ _id: imageId }, { $set: num }).exec(),
      ImagePreview.update({ image_id: imageId }, { $set: num }).exec(),
      ImageInfo.update({ image_id: imageId }, { $set: num }).exec()
    ])
  },
  // 更新图片评论赞数
  updateCommentLikeNum: (commentId, num) => {
    return Promise.all([ImageComment.update({ _id: commentId }, { $set: num }).exec()])
  },
  // 删除
  // 删除赞
  deleteLike: ({ imageId, userId }) => {
    return Promise.all([
      ImageLike.remove({ image_id: imageId, user_id: userId }).exec(),
      ImageLike.count({ image_id: imageId }).exec()
    ])
  },
  // 删除评论赞
  deleteCommentLike: ({ commentId, userId }) => {
    return Promise.all([
      ImageCommentLike.remove({ comment_id: commentId, user_id: userId }).exec(),
      ImageCommentLike.count({ _id: commentId }).exec()
    ])
  }
}
