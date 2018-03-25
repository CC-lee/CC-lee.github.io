var common = require('./common-mongo')

module.exports = {
  // 共通
  // 文章
  Article: {
    title: { type: 'string' },
    content: { type: 'string' },
    like_num: { type: 'number' },
    like_status: { type: 'boolean' },
    comment_num: { type: 'number' },
    classify: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 文章评论
  ArticleComment: {
    article_id: { type: 'string' },
    user_id: { type: 'string' },
    user_avatar: { type: 'string' },
    user_name: { type: 'string' },
    like_num: { type: 'number' },
    content: { type: 'string' },
    like_status: { type: 'boolean' },
    time: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 文章评论回复
  ArticleCommentReply: {
    article_id: { type: 'string' },
    user_avatar: { type: 'string' },
    user_id: { type: 'string' },
    user_name: { type: 'string' },
    comment_id: { type: 'string' },
    reply_user_id: { type: 'string' },
    reply_user_avatar: { type: 'string' },
    reply_user_name: { type: 'string' },
    content: { type: 'string' },
    time: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 文章赞
  ArticleLike: {
    article_id: { type: 'string' },
    user_id: { type: 'string' },
    like_type: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 文章评论赞
  ArticleCommentLike: {
    article_id: { type: 'string' },
    user_id: { type: 'string' },
    comment_id: { type: 'string' },
    target_id: { type: 'string' },
    like_type: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 前台
  // 文章预览
  ArticlePreview: {
    article_id: { type: 'string' },
    title: { type: 'string' },
    article_preview: { type: 'string' },
    theme_img: { type: 'string' },
    classify: { type: 'string' },
    like_num: { type: 'number' },
    like_status: { type: 'boolean' },
    comment_num: { type: 'number' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 后台
  // 文章列表信息
  ArticleInfo: {
    title: { type: 'string' },
    article_id: { type: 'string' },
    classify: { type: 'string' },
    like_num: { type: 'number' },
    comment_num: { type: 'number' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 文章草稿数据
  ArticleTemp: {
    title: { type: 'string' },
    content: { type: 'string' },
    classify: { type: 'string' }
  }
}

