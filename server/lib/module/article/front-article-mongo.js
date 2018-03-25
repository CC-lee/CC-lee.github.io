module.exports = {
  // 共通
  // 文章
  Article: {
    title: { type: 'string' },
    content: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    comment_num: { type: 'number' },
    like_num: { type: 'number' },
    classify: { type: 'string' }
  },
  // 文章评论
  ArticleComment: {

  },
  // 文章评论回复
  ArticleCommentReply: {

  },
  // 文章赞
  ArticleLike: {

  },
  // 前台
  ArticlePreview: {
    article_id: { type: 'string' },
    title: { type: 'string' },
    article_preview: { type: 'string' },
    theme_img: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    classify: { type: 'string' },
    like_num: { type: 'number' },
    comment_num: { type: 'number' }
  },
  // 后台
  ArticleInfo: {

  }
}

