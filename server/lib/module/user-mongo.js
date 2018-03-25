var common = require('./common-mongo')

module.exports = {
  // 共通
  // 用户
  User: {
    email: { type: 'string', unique: true },
    password: { type: 'string' },
    user_name: { type: 'string' },
    gender: { type: 'string' },
    location: { type: 'string' },
    user_avatar: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 前台
  // 用户消息
  UserNotify: {
    user_id: { type: 'string' },
    user_name: { type: 'string' },
    content: { type: 'string' },
    url: { type: 'string' },
    create_date: { type: 'string' }
  },
  // 用户未读消息
  UnReadNotify: {
    sender_id: { type: 'string' },
    receiver_id: { type: 'string' }
  },
  // 用户信息
  UserList: {
    userid: { type: 'string' },
    email: { type: 'string' },
    avatar: { type: 'string' },
    name: { type: 'string' }
  },
  // 后台
  // 订单
  UserOrder: {
    user_id: { type: 'string' },
    user_name: { type: 'string' },
    item_list: [{ type: 'object' }],
    total_price: { type: 'number' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  }
}
