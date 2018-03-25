var common = require('./common-mongo')

module.exports = {
  // 共通
  // 商品
  Item: {
    item_name: { type: 'string' },
    unit_price: { type: 'string' },
    item_img: [{ type: 'string' }],
    item_detail: { type: 'string' },
    item_option: [{ type: 'object' }],
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 前台
  // 商品预览
  ItemPreview: {
    item_id: { type: 'string' },
    item_name: { type: 'string' },
    unit_price: { type: 'string' },
    preview_img: [{ type: 'string' }],
    item_detail: { type: 'string' },
    item_option: [{ type: 'object' }],
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 购物车
  CartInfo: {
    user_id: { type: 'string' },
    item_id: { type: 'string' },
    item_img: { type: 'string' },
    item_name: { type: 'string' },
    unit_price: { type: 'string' },
    quantity: { type: 'number' },
    price: { type: 'number' },
    item_option: [{ type: 'object' }],
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 后台
  // 商品列表信息
  ItemInfo: {
    item_id: { type: 'string' },
    item_name: { type: 'string' },
    unit_price: { type: 'string' },
    main_img: { type: 'string' },
    create_date: { type: 'string' },
    update_date: { type: 'string' },
    timestamp: { type: 'number' }
  },
  // 商品草稿数据
  ItemTemp: {
    item_name: { type: 'string' },
    unit_price: { type: 'string' },
    item_img: [{ type: 'string' }],
    item_detail: { type: 'string' },
    item_option: [{ type: 'object' }]
  }
}
