var Image = require('../../../lib/mongo').Image
var ImageComment = require('../../../lib/mongo').ImageComment
var ImageLike = require('../../../lib/mongo').ImageLike
var ImageCommentLike = require('../../../lib/mongo').ImageCommentLike
var ImagePreview = require('../../../lib/mongo').ImagePreview
var ImageInfo = require('../../../lib/mongo').ImageInfo
var ImageTemp = require('../../../lib/mongo').ImageTemp
var common = {
  ImageTemp: require('../../../lib/mongo').ImageTemp
}

module.exports = {
  // 创建
  // 创建图片
  createImage: (image, { tempId, temp }) => {
    return Promise.all([
      Image.create(image).exec(),
      ImageTemp.update({ _id: tempId }, { $set: temp }).exec()
    ])
  },
  // 创建预览与信息
  createImagePvIf: ({ preview, info }) => {
    return Promise.all([
      ImagePreview.create(preview).exec(),
      ImageInfo.create(info).exec()
    ])
  },
  // 获取
  // 获取临时数据
  getTemp: function () {
    return common['ImageTemp'].find().sort({ _id: -1 }).exec()
  },
  // 获取信息列表
  getInfo: () => {
    return ImageInfo.find().sort({ _id: -1 }).exec()
  },
  // 获取图片
  getImage: (imageId) => {
    return Image.findOne({ _id: imageId })
  },
  // 获取评论
  getComment: (imageId) => {
    return ImageComment.find({ image_id: imageId }).sort({ time: -1 }).exec()
  },
  countComments: (imageId) => {
    return ImageComment.count({ image_id: imageId }).exec()
  },
  // 更新
  // 更新图片临时数据
  updateTemp: ({ tempId, temp }) => {
    return ImageTemp.update({ _id: tempId }, { $set: temp }).exec()
  },
  // 更新图片
  updateImage: (imageId, { image, preview, info }) => {
    return Promise.all([
      Image.update({ _id: imageId }, { $set: image }).exec(),
      ImagePreview.update({ image_id: imageId }, { $set: preview }).exec(),
      ImageInfo.update({ image_id: imageId }, { $set: info }).exec()
    ])
  },
  // 更新评论数
  updateCommentNum: (imageId, num) => {
    return Promise.all([
      Image.update({ _id: imageId }, { $set: num }).exec(),
      ImagePreview.update({ image_id: imageId }, { $set: num }).exec(),
      ImageInfo.update({ image_id: imageId }, { $set: num }).exec()
    ])
  },
  // 删除
  // 删除图片
  deleteImage: (imageId) => {
    return Promise.all([
      Image.remove({ _id: imageId }).exec(),
      ImageComment.remove({ image_id: imageId }).exec(),
      ImageLike.remove({ image_id: imageId }).exec(),
      ImageCommentLike.remove({ image_id: imageId }).exec(),
      ImagePreview.remove({ image_id: imageId }).exec(),
      ImageInfo.remove({ image_id: imageId }).exec()
    ])
  },
  // 删除评论
  deleteComment: (commentId) => {
    return Promise.all([
      ImageComment.remove({ _id: commentId }).exec(),
      ImageCommentLike.remove({ comment_id: commentId }).exec(),
    ])
  }
}
