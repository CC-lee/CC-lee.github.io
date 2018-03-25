var moment = require('moment')

class control {
  constructor({
    user_id,
    user_avatar,
    user_name,
    user_email,
    comment_id,
    reply_user_id,
    reply_user_avatar,
    reply_user_name,
    create_date,
    update_date,
    timestamp
  }) {
    this.user_id = user_id
    this.user_avatar = user_avatar
    this.user_name = user_name
    this.user_email = user_email
    this.comment_id = comment_id
    this.reply_user_id = reply_user_id
    this.reply_user_avatar = reply_user_avatar
    this.reply_user_name = reply_user_name
    this.create_date = moment().format('YYYY-MM-DD HH:mm:ss')
    this.update_date = moment().format('YYYY-MM-DD HH:mm:ss')
    this.timestamp = parseInt(moment().format('X'))
  }

  createres(result, res) {
    var { ok, n } = result.slice(-1)[0].result
    if (ok && n > 0) {
      res.send({
        code: 200,
        message: '创建成功'
      })
    } else {
      throw new Error('创建失败')
    }
  }

  getres(data, res) {
    res.send({
      code: 200,
      data
    })
  }

  updateres(result, res) {
    var { ok, n } = result.slice(-1)[0].result
    if (ok && n > 0) {
      res.send({
        code: 200,
        message: '编辑成功'
      })
    } else {
      throw new Error('编辑失败');
    }
  }

  deleteres(result, res) {
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
  }

  fail(res, err) {
    res.send({
      code: -200,
      message: err.toString()
    })
  }
}

module.exports = control