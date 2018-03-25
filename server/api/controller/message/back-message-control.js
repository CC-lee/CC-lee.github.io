var apimodule = require('../../module')
var backMessage = apimodule.backMessage
var control = require('../control')
var jetpack = require('fs-jetpack')

class bMessage extends control {
  constructor({
    dateid,
    _id,
    message_type,
    content,
    img,
    comment_num,
    like_num,
    like_status,
    message_id,
    message_preview,
    url,
    sender_id,
    receiver_id,
    user_id,
    user_avatar,
    user_name,
    user_email,
    comment_id,
    create_date,
    update_date,
    timestamp
      }) {
    super({
      user_id,
      user_avatar,
      user_name,
      user_email,
      comment_id,
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, message_id, img, dateid })
    this.temp = {
      content,
      img
    }
    this.message = {
      user_id: this.user_id,
      user_avatar: this.user_avatar,
      user_name: this.user_name,
      user_email: this.user_email,
      message_type,
      content,
      img,
      comment_num,
      like_num,
      like_status,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.preview = {
      message_id,
      message_preview,
      user_id: this.user_id,
      user_name: this.user_name,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.info = {
      message_id,
      user_id: this.user_id,
      user_name: this.user_name,
      like_num,
      comment_num,
      message_type,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.notify = {
      user_id: this.user_id,
      user_name: this.user_id,
      content,
      url,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.unRead = {
      sender_id,
      receiver_id
    }
    this.updateMessage = {
      content,
      img,
      update_date: this.update_date
    }
    this.updatePreview = {
      message_preview,
      update_date: this.update_date
    }
    this.updateInfo = {
      update_date: this.update_date
    }
  }

  getMessageTemp(res) {
    backMessage.getTemp()
      .then((temp) => {
        this.getres(temp, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  messageTemp(res) {
    backMessage.updateTemp({ tempId: this._id, temp: this.temp })
      .then((result) => {
        res.send({
          code: 200,
          message: '保存成功'
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  adminMessageCreate(res) {
    Object.assign(this.temp, { img: [], content: '' })
    backMessage.createMessage(this.message, { tempId: this._id, temp: this.temp })
      .then((result) => {
        var { _id: messageId } = result[0].ops[0]
        jetpack.rename(`uploads/message/${this.dateid}`, `${messageId}`)
        Object.assign(this.preview, { message_id: `${messageId}` })
        Object.assign(this.info, { message_id: `${messageId}` })
        backMessage.createMessagePvIf({ preview: this.preview, info: this.info })
          .then((result) => {
            this.createres(result, res)
          })
          .catch(err => {
            this.fail(res, err)
          })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  createUserNotify(res) {
    backMessage.createUserNotify({ notify: this.notify, unRead: this.unRead })
      .then((result) => {
        this.createres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  messageDelete(res) {
    if (this._id.user_id) {
      backMessage.deleteMessage(this._id._id)
        .then((result) => {
          this.deleteres(result, res)
        })
        .catch(err => {
          this.fail(res, err)
        })
    } else {
      backMessage.deleteMessage(this._id)
        .then((result) => {
          this.deleteres(result, res)
        })
        .catch(err => {
          this.fail(res, err)
        })
    }
  }

  adminMessageList(res) {
    backMessage.getAdminInfo()
      .then((info) => {
        this.getres(info, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  userMessageList(res) {
    backMessage.getUserInfo()
      .then((info) => {
        this.getres(info, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  editAdminMessage(res) {
    backMessage.updateMessage(this._id, { message: this.updateMessage, preview: this.updatePreview, info: this.updateInfo })
      .then((result) => {
        this.updateres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getAdminMessage(res) {
    backMessage.getMessage(this._id)
      .then((message) => {
        if (message.img.length > 0) {
          var arrs = message.img[0].match(/http/g)
          if (!arrs) {
            for (var i = 0; i < message.img.length; i++) {
              message.img[i] = `http://localhost:3009/uploads/message/${this._id}/${message.img[i]}`
            }
          }
          this.getres(message, res)
        } else {
          this.getres(message, res)
        }
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getAllComments(res) {
    backMessage.getComment(this.message_id)
      .then((comments) => {
        for (var i in comments) {
          this.getReply(comments[i], res)
        }
        setTimeout(() => {
          res.send({
            code: 200,
            comments
          })
        }, 500)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
  // getAllComments的内嵌函数
  getReply(comment, res) {
    backMessage.getReply(comment._id)
      .then((reply) => {
        Object.assign(comment, { comment_reply: reply })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteOneComment(res) {
    backMessage.deleteComment(this.comment_id, this.message_id)
      .then((result) => {
        backMessage.countComments(this.message_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          backMessage.updateCommentNum(this.message_id, num)
            .then((result) => {
              this.deleteres(result, res)
            })
            .catch(err => {
              this.fail(res, err)
            })
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
}

function connectFun(Command, Connect) {
  return async (req, res) => {
    var connect = new Connect(req.body)
    await connect[Command](res)
    connect = null
  }
}

module.exports = {
  // 获取草稿数据
  getMessageTemp: connectFun('getMessageTemp', bMessage),
  // 更新草稿数据
  messageTemp: connectFun('messageTemp', bMessage),
  // 留言创建
  adminMessageCreate: connectFun('adminMessageCreate', bMessage),
  // 创建用户通知
  createUserNotify: connectFun('createUserNotify', bMessage),
  // 留言删除
  messageDelete: connectFun('messageDelete', bMessage),
  // 管理留言信息列表
  adminMessageList: connectFun('adminMessageList', bMessage),
  // 用户留言信息列表
  userMessageList: connectFun('userMessageList', bMessage),
  // 管理留言编辑
  editAdminMessage: connectFun('editAdminMessage', bMessage),
  // 获取一条管理留言
  getAdminMessage: connectFun('getAdminMessage', bMessage),
  // 留言评论获取
  getAllComments: connectFun('getAllComments', bMessage),
  // 删除一条留言评论
  deleteOneComment: connectFun('deleteOneComment', bMessage)
}
