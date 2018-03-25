var Classify = require('../../../lib/mongo').Classify
module.exports = {
  // 创建
  // 根据外部参数创建分类
  createClass: (classify) => {
    return Promise.all([Classify.create(classify).exec()])
  },
  // 获取
  // 获取所有分类
  getAllClass: () => {
    return Classify.find().sort({ update_date: -1 }).exec()
  },
  // 获取一个分类
  getOneClass: (classId) => {
    return Classify.findOne({ _id: classId })
  },
  // 更新
  // 根据外部参数编辑分类
  updateClass: (classId, classify) => {
    return Promise.all([Classify.update({ _id: classId }, { $set: classify }).exec()])
  },
  // 删除
  // 根据外部参数删除分类
  removeClass: (classId) => {
    return Promise.all([Classify.remove({ _id: classId }).exec()])
  }
}
