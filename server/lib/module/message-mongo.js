var common = require('./common-mongo')

module.exports = {
  // 共通
  // 留言
  Message: {
    user_id: { type: 'string' },
    user_name: { type: 'string' },
    user_avatar: { type: 'string' },
    user_email: { type: 'string' },
    message_type: { type: 'string' },
    content: { type: 'string' },
    img: [{ type: 'string' }],
    comment_num: { type: 'number' },
    like_num: { type: 'number' },
    like_status: { type: 'boolean' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    notify: [{ type: 'object' }],
    timestamp: { type: 'number' }
  },
  // 留言评论
  MessageComment: {
    message_id: { type: 'string' },
    user_id: { type: 'string' },
    user_avatar: { type: 'string' },
    user_name: { type: 'string' },
    like_num: { type: 'number' },
    content: { type: 'string' },
    like_status: { type: 'boolean' },
    time: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 留言回复
  MessageCommentReply: {
    message_id: { type: 'string' },
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
  // 留言赞
  MessageLike: {
    message_id: { type: 'string' },
    user_id: { type: 'string' },
    like_type: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 留言评论赞
  MessageCommentLike: {
    message_id: { type: 'string' },
    user_id: { type: 'string' },
    comment_id: { type: 'string' },
    target_id: { type: 'string' },
    like_type: { type: 'string' },
    update_date: { type: 'string' },
    create_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 前台
  // 留言预览
  MessagePreview: {
    message_id: { type: 'string' },
    message_preview: { type: 'string' },
    user_id: { type: 'string' },
    user_name: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 后台
  // 留言列表信息
  MessageInfo: {
    message_id: { type: 'string' },
    mix_id: { type: 'object' },
    user_id: { type: 'string' },
    user_name: { type: 'string' },
    message_type: { type: 'string' },
    like_num: { type: 'number' },
    comment_num: { type: 'number' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 管理留言草稿数据
  MessageTemp: {
    content: { type: 'string' },
    img: [{ type: 'string' }],
    notify: [{ type: 'object' }]
  }
}
