var Classify = require('../../../lib/mongo').Classify
var ArticlePreview = require('../../../lib/mongo').ArticlePreview
module.exports = {
  // 创建
  // 获取
  // 获取所有分类
  getAllClass: () => {
    return Classify.find().sort({ create_date: -1 }).exec()
  },
  // 根据分类获取文章预览列表
  getArticlesByClass: (classify) => {
    return ArticlePreview.find({ classify: classify }).sort({ create_date: -1 }).exec()
  }
  // 更新
  // 删除
}
