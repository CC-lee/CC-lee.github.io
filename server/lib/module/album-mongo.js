var common = require('./common-mongo')

module.exports = {
  // 共通
  // 图片
  Image: function () {
    var obj = {
      image_content: { type: 'string' },
      text_content: { type: 'string' },
      like_status: { type: 'boolean' },
      like_num: { type: 'number' },
      comment_num: { type: 'number' },
    }
    Object.assign(obj, common.timeInfo())
    return obj
  }(),
  // 图片评论
  ImageComment: {
    image_id: { type: 'string' },
    user_id: { type: 'string' },
    user_avatar: { type: 'string' },
    user_name: { type: 'string' },
    content: { type: 'string' },
    like_num: { type: 'number' },
    like_status: { type: 'boolean' },
    time: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 图片点赞
  ImageLike: {
    image_id: { type: 'string' },
    user_id: { type: 'string' },
    like_type: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 图片评论点赞
  ImageCommentLike: {
    image_id: { type: 'string' },
    user_id: { type: 'string' },
    comment_id: { type: 'string' },
    target_id: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 前台
  // 图片预览
  ImagePreview: {
    image_id: { type: 'string' },
    image_preview: { type: 'string' },
    comment_num: { type: 'number' },
    like_num: { type: 'number' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 后台
  // 图片列表信息
  ImageInfo: {
    image_id: { type: 'string' },
    image_info: { type: 'string' },
    comment_num: { type: 'number' },
    like_num: { type: 'number' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 图片草稿数据
  ImageTemp: {
    image_content: { type: 'string' },
    text_content: { type: 'string' }
  }
}
