module.exports = {
  // 创建
  createres: (result, res) => {
    var { ok, n } = result.slice(-1)[0].result
    if (ok && n > 0) {
      res.send({
        code: 200,
        message: '创建成功'
      })
    } else {
      throw new Error('创建失败')
    }
  },
  // 获取
  getres: (data, res) => {
    res.send({
      code: 200,
      data
    })
  },
  // 更新
  updateres: (result, res) => {
    var { ok, n } = result.slice(-1)[0].result
    if (ok && n > 0) {
      res.send({
        code: 200,
        message: '编辑成功'
      })
    } else {
      throw new Error('编辑失败');
    }
  },
  // 删除
  deleteres: (result, res) => {
    var { ok, n } = result.slice(-1)[0].result
    if (ok && n > 0) {
      // 已经删除了数据库中存在的项
      res.send({
        code: 200,
        message: '删除成功'
      })
    } else {
      // 删除不存在的项
      throw new Error('该分类不存在')
    }
  },
  // 失败返回
  fail: (res, err) => {
    res.send({
      code: -200,
      message: err.toString()
    })
  }
}