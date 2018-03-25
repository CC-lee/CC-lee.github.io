var apimodule = require('../../module')
var frontMessage = apimodule.frontMessage
var control = require('../control')
var jetpack = require('fs-jetpack');

class fMessage extends control {
  constructor({
    _id,
    message_id,
    page,
    limit,
    message_type,
    content,
    img,
    comment_num,
    like_num,
    like_status,
    message_preview,
    url,
    notify,
    sender_id,
    receiver_id,
    target_id,
    like_type,
    user_id,
    user_avatar,
    user_name,
    comment_id,
    reply_user_id,
    reply_user_avatar,
    reply_user_name,
    user_email,
    create_date,
    update_date,
    timestamp,
    time
      }) {
    super({
      user_id,
      user_avatar,
      user_name,
      comment_id,
      reply_user_id,
      reply_user_avatar,
      reply_user_name,
      user_email,
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, message_id, page, limit, img, notify, user_id })

    this.message = {
      user_id: this.user_id,
      user_avatar: this.user_avatar,
      user_name: this.user_name,
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

    this.comment = {
      message_id,
      user_id: this.user_id,
      user_avatar: this.user_avatar,
      user_name: this.user_name,
      like_num,
      content,
      like_status,
      time,
      timestamp: this.timestamp
    }
    this.reply = {
      message_id,
      user_id: this.user_id,
      user_avatar: this.user_avatar,
      user_name: this.user_name,
      comment_id: this.comment_id,
      reply_user_id: this.reply_user_id,
      reply_user_avatar: this.reply_user_avatar,
      reply_user_name: this.reply_user_name,
      content,
      time,
      timestamp: this.timestamp
    }
    this.like = {
      message_id,
      user_id: this.user_id,
      like_type,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.commentLike = {
      message_id,
      user_id: this.user_id,
      comment_id: this.comment_id,
      target_id,
      like_type,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }

    this.key = []


  }

  messageList(res) {
    if (this.user_id) {
      frontMessage.getLike(this.user_id, this._id).then((result) => {
        var likes = result
        frontMessage.getAllMessage({ page: this.page, limit: this.limit })
          .then((result) => {
            var messages = result[0],
              total = result[1],
              totalPage = Math.ceil(total / this.limit),
              hasNext = totalPage > this.page ? 1 : 0
            for (var i in messages) {
              if (likes.length > 0) {
                if (messages[i].mix_id) {
                  for (var j = 0; j < messages[i].img.length; j++) {
                    var arrs = messages[i].img[i].match(/http/g)
                    if (!arrs) {
                      messages[i].img[i] = `http://localhost:3009/uploads/message/${messages[i].user_id}/${messages[i]._id}/${messages[i].img[i]}`
                    }
                  }
                } else {
                  for (var j = 0; j < message[i].img.length; j++) {
                    var arrs = messages[i].img[i].match(/http/g)
                    if (!arrs) {
                      messages[i].img[i] = `http://localhost:3009/uploads/message/${messages[i]._id}/${messages[i].img[i]}`
                    }
                  }
                }
                if (messages[i].like_num > 0) {
                  for (var x in likes) {
                    if (likes[x].user_id == this.user_id) {
                      messages[i].like_status = true
                    }
                  }
                }

              }
            }
            setTimeout(() => {
              res.send({
                code: 200,
                messages: messages,
                hasNext: hasNext
              })
            }, 200)
          })
          .catch(err => {
            this.fail(res, err)
          })
      })
    } else {
      frontMessage.getAllMessage({ page: this.page, limit: this.limit })
        .then((result) => {
          var messages = result[0],
            total = result[1],
            totalPage = Math.ceil(total / this.limit),
            hasNext = totalPage > this.page ? 1 : 0
          res.send({
            code: 200,
            messages: messages,
            hasNext: hasNext
          })
        })
        .catch(err => {
          this.fail(res, err)
        })
    }
  }

  userMessageCreate(res) {
    frontMessage.createMessage(this.message)
      .then((result) => {
        var { _id: messageId } = result[0].ops[0]
        if (this.img.length > 0) {
          jetpack.rename(this.img[0].path, `${messageId}`);
        }
        Object.assign(this.preview, { message_id: `${messageId}` })
        Object.assign(this.info, {
          message_id: `${messageId}`,
          mix_id: {
            _id: `${messageId}`,
            user_id: this.user_id
          }
        })
        frontMessage.createMessagePvIf({ preview: this.preview, info: this.info })
          .then((result) => {
            if (this.notify.length > 0) {
              for (var i in this.notify) {
                let Notify = {
                  user_id: this.notify[i].userid,
                  user_name: this.notify[i].name,
                  content: `${this.user_name}在留言板中提到你，点击查看`,
                  url: `/messageboard/${messageId}`,
                  create_date: this.create_date
                }
                let unRead = {
                  sender_id: this.user_id,
                  receiver_id: this.notify[i].userid,
                }
                frontMessage.createUserNotify(Notify, unRead).then(() => { })
              }
            }
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
    frontMessage.createUserNotify({ notify: this.notify, unRead: this.unRead })
      .then((result) => {
        this.createres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  messageLike(res) {
    var num = { like_num: '' }
    frontMessage.getLike(this.user_id, this.message_id).then((result) => {
      if (result.length > 0) {
        res.send({
          code: 201,
          message: '编辑成功'
        })
      } else {
        frontMessage.createLike(this.like)
          .then((result) => {
            frontMessage.countLikes(this.message_id).then((result) => {
              num.like_num = result
              frontMessage.updateLikeNum(this.message_id, num)
                .then((result) => {
                  setTimeout(() => {
                    this.updateres(result, res)
                  }, 100);
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
    })
  }

  messageLikeCancel(res) {
    var num = { like_num: '' }
    frontMessage.getLike(this.user_id, this.message_id).then((result) => {
      if (result.length < 0) {
        res.send({
          code: 201,
          message: '编辑成功'
        })
      } else {
        frontMessage.deleteLike({ messageId: this.message_id, userId: this.user_id })
          .then((result) => {
            frontMessage.countLikes(this.message_id).then((result) => {
              num.like_num = result
              frontMessage.updateLikeNum(this.message_id, num)
                .then((result) => {
                  setTimeout(() => {
                    this.updateres(result, res)
                  }, 100)
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
    })
  }

  getPreview(res) {
    frontMessage.getPreview({ page: this.page, limit: this.limit })
      .then((result) => {
        var preview = result[0],
          total = result[1],
          totalPage = Math.ceil(total / this.limit),
          hasNext = totalPage > this.page ? 1 : 0
        res.send({
          code: 200,
          preview: preview,
          hasNext: hasNext
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneMessage(res) {
    if (this.user_id) {
      frontMessage.getLike(this.user_id, this._id).then((result) => {
        if (result.length > 0) {
          var like = result[0]
          frontMessage.getMessage(this._id)
            .then((message) => {
              if (message.img.length > 0) {
                if (message.mix_id) {
                  for (var i = 0; i < message.img.length; i++) {
                    var arrs = message.img[i].match(/http/g)
                    if (!arrs) {
                      message.img[i] = `http://localhost:3009/uploads/message/${message.user_id}/${this._id}/${message.img[i]}`
                    }
                  }
                } else {
                  for (var i = 0; i < message.img.length; i++) {
                    var arrs = message.img[i].match(/http/g)
                    if (!arrs) {
                      message.img[i] = `http://localhost:3009/uploads/message/${this._id}/${message.img[i]}`
                    }
                  }
                }
              }
              if (like.user_id == this.user_id) {
                message.like_status = true
                this.getres(message, res)
              } else {
                this.getres(message, res)
              }
            })
            .catch(err => {
              this.fail(res, err)
            })
        } else {
          frontMessage.getMessage(this._id)
            .then((message) => {
              if (message.img.length > 0) {
                if (message.mix_id) {
                  for (var i = 0; i < message.img.length; i++) {
                    var arrs = message.img[i].match(/http/g)
                    if (!arrs) {
                      message.img[i] = `http://localhost:3009/uploads/message/${message.user_id}/${this._id}/${message.img[i]}`
                    }
                  }
                } else {
                  for (var i = 0; i < message.img.length; i++) {
                    var arrs = message.img[i].match(/http/g)
                    if (!arrs) {
                      message.img[i] = `http://localhost:3009/uploads/message/${this._id}/${message.img[i]}`
                    }
                  }
                }
              }
              this.getres(message, res)
            })
            .catch(err => {
              this.fail(res, err)
            })
        }
      })
    } else {
      frontMessage.getMessage(this._id)
        .then((message) => {
          if (message.img.length > 0) {
            if (message.mix_id) {
              for (var i = 0; i < message.img.length; i++) {
                var arrs = message.img[i].match(/http/g)
                if (!arrs) {
                  message.img[i] = `http://localhost:3009/uploads/message/${message.user_id}/${this._id}/${message.img[i]}`
                }
              }
            } else {
              for (var i = 0; i < message.img.length; i++) {
                var arrs = message.img[i].match(/http/g)
                if (!arrs) {
                  message.img[i] = `http://localhost:3009/uploads/message/${this._id}/${message.img[i]}`
                }
              }
            }
          }
          this.getres(message, res)
        })
        .catch(err => {
          this.fail(res, err)
        })
    }
  }

  getAllComments(res) {
    frontMessage.getCommentLike(this.user_id).then((result) => {
      var commentlikes = result
      frontMessage.getComment(this.message_id)
        .then((comments) => {
          for (var i in comments) {
            if (commentlikes.length > 0) {
              if (comments[i].like_num > 0) {
                for (var x in commentlikes) {
                  if (commentlikes[x].user_id == this.user_id) {
                    comments[i].like_status = true
                    this.getReply(comments[i], res)
                  }
                }
              } else {
                this.getReply(comments[i], res)
              }
            }
            else { this.getReply(comments[i], res) }
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
    })
      .catch(err => {
        this.fail(res, err)
      })
  }
  // getAllComments的内嵌函数
  getReply(comment, res) {
    frontMessage.getReply(comment._id)
      .then((reply) => {
        Object.assign(comment, { comment_reply: reply })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  messageComment(res) {
    frontMessage.createComment(this.comment)
      .then((result) => {
        var comment = result[0].ops[0]
        frontMessage.countComments(this.message_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          frontMessage.updateCommentNum(this.message_id, num)
            .then((result) => {
              var { ok, n } = result.slice(-1)[0].result
              if (ok && n > 0) {
                res.send({
                  code: 200,
                  comment: comment,
                  message: '编辑成功'
                })
              } else {
                throw new Error('编辑失败');
              }
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

  commentLikeCancel(res) {
    frontMessage.deleteCommentLike({ commentId: this.comment_id, userId: this.user_id })
      .then((result) => {
        frontMessage.countCommentLikes(this.comment_id).then((result) => {
          var num = Object.assign({}, { like_num: result })
          frontMessage.updateCommentLikeNum(this.comment_id, num)
            .then((result) => {
              this.updateres(result, res)
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

  messageReply(res) {
    frontMessage.createReply(this.reply)
      .then((result) => {
        var reply = result[0].ops[0]
        frontArticle.countComments(this.message_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          frontArticle.updateCommentNum(this.message_id, num)
            .then((result) => {
              var { ok, n } = result.slice(-1)[0].result
              if (ok && n > 0) {
                res.send({
                  code: 200,
                  reply: reply,
                  message: '编辑成功'
                })
              } else {
                throw new Error('编辑失败');
              }
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

  commentLikeCreate(res) {
    var num = { like_num: '' }
    frontMessage.createCommentLike(this.commentLike)
      .then((result) => {
        frontMessage.countCommentLikes(this.comment_id).then((result) => {
          num.like_num = result
          setTimeout(() => {
            frontMessage.updateCommentLikeNum(this.comment_id, num)
              .then((result) => {
                setTimeout(() => {
                  this.updateres(result, res)
                }, 100);
              })
              .catch(err => {
                this.fail(res, err)
              })
          }, 100);
        })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getMessagesBySearch(res) {
    frontMessage.getMessagesBySearch(this.key, this.page, this.limit)
      .then((messages) => {
        this.getres(preview, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  whole() {
    this.messageLike
    this.getOneMessage
    this.getAllComments
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
  // 留言列表
  messageList: connectFun('messageList', fMessage),
  // 留言创建
  userMessageCreate: connectFun('userMessageCreate', fMessage),
  // 创建用户通知
  createUserNotify: connectFun('createUserNotify', fMessage),
  // 留言赞
  messageLike: connectFun('messageLike', fMessage),
  // 留言赞取消
  messageLikeCancel: connectFun('messageLikeCancel', fMessage),
  // 获取所有部分留言预览
  getPreview: connectFun('getPreview', fMessage),
  // 留言获取一条
  getOneMessage: connectFun('getOneMessage', fMessage),
  // 获取所有评论
  getAllComments: connectFun('getAllComments', fMessage),
  // 留言评论
  messageComment: connectFun('messageComment', fMessage),
  // 留言评论赞取消
  commentLikeCancel: connectFun('commentLikeCancel', fMessage),
  // 留言评论回复
  messageReply: connectFun('messageReply', fMessage),
  // 留言评论赞
  commentLike: connectFun('commentLikeCreate', fMessage),
  // 留言根据搜索结果获取留言
  getMessagesBySearch: connectFun('getMessagesBySearch', fMessage)
}
