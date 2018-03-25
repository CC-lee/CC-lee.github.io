var apimodule = require('../../module')
var frontArticle = apimodule.frontArticle
var control = require('../control')

class fArticle extends control {
  constructor({
    _id,
    article_id,
    key,
    page,
    limit,
    like_num,
    content,
    like_status,
    like_type,
    target_id,
    user_id,
    user_avatar,
    user_name,
    comment_id,
    reply_user_id,
    reply_user_avatar,
    reply_user_name,
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
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, article_id, page, limit })

    this.comment = {
      article_id,
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
      article_id,
      user_id: this.user_id,
      user_avatar: this.user_avatar,
      user_name: this.user_name,
      comment_id: `${this.comment_id}`,
      reply_user_id: this.reply_user_id,
      reply_user_avatar: this.reply_user_avatar,
      reply_user_name: this.reply_user_name,
      content,
      time,
      timestamp: this.timestamp
    }
    this.like = {
      article_id,
      user_id: this.user_id,
      like_type,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.commentLike = {
      article_id,
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
  articlePreview(res) {
    if (this.user_id) {
      frontArticle.getLike(this.user_id, this.article_id).then((result) => {
        var likes = result
        frontArticle.getPreview({ page: this.page, limit: this.limit })
          .then((result) => {
            var preview = result[0],
              total = result[1],
              totalPage = Math.ceil(total / this.limit),
              hasNext = totalPage > this.page ? 1 : 0
            for (var i in preview) {
              if (likes.length > 0) {
                if (preview[i].like_num > 0) {
                  for (var x in likes) {
                    if (likes[x].user_id == this.user_id) {
                      preview[i].like_status = true
                    }
                  }
                }
              }
            }
            setTimeout(() => {
              res.send({
                code: 200,
                preview: preview,
                hasNext: hasNext
              })
            }, 200)
          })
          .catch(err => {
            this.fail(res, err)
          })
      })
    } else {
      frontArticle.getPreview({ page: this.page, limit: this.limit })
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
  }

  articleLike(res) {
    var num = { like_num: '' }
    frontArticle.createLike(this.like)
      .then((result) => {
        frontArticle.countLikes(this.article_id).then((result) => {
          num.like_num = result
          frontArticle.updateLikeNum(this.article_id, num)
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

  articleLikeCancel(res) {
    var num = { like_num: '' }
    frontArticle.deleteLike({ articleId: this.article_id, userId: this.user_id })
      .then((result) => {
        frontArticle.countLikes(this.article_id).then((result) => {
          num.like_num = result
          frontArticle.updateLikeNum(this.article_id, num)
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

  getOneArticle(res) {
    if (this.user_id) {
      frontArticle.getLike(this.user_id, this.article_id).then((result) => {
        if (result.length > 0) {
          var like = result[0]
          frontArticle.getArticle(this.article_id)
            .then((article) => {
              if (like.user_id == this.user_id) {
                article.like_status = true
                this.getres(article, res)
              } else {
                this.getres(article, res)
              }
            })
            .catch(err => {
              this.fail(res, err)
            })
        } else {
          frontArticle.getArticle(this.article_id)
            .then((article) => {
              this.getres(article, res)
            })
            .catch(err => {
              this.fail(res, err)
            })
        }
      })
    } else {
      frontArticle.getArticle(this.article_id)
        .then((article) => {
          this.getres(article, res)
        })
        .catch(err => {
          this.fail(res, err)
        })
    }
  }

  getAllComments(res) {
    frontArticle.getCommentLike(this.user_id).then((result) => {
      var commentlikes = result
      frontArticle.getComment(this.article_id)
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
    frontArticle.getReply(comment._id)
      .then((reply) => {
        Object.assign(comment, { comment_reply: reply })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  articleComment(res) {
    frontArticle.createComment(this.comment)
      .then((result) => {
        var comment = result[0].ops[0]
        frontArticle.countComments(this.article_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          frontArticle.updateCommentNum(this.article_id, num)
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

  commentLikeCreate(res) {
    var num = { like_num: '' }
    frontArticle.createCommentLike(this.commentLike)
      .then((result) => {
        frontArticle.countCommentLikes(this.comment_id).then((result) => {
          num.like_num = result
          frontArticle.updateCommentLikeNum(this.comment_id, num)
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

  commentLikeCancel(res) {
    frontArticle.deleteCommentLike({ commentId: this.comment_id, userId: this.user_id })
      .then((result) => {
        frontArticle.countCommentLikes(this.comment_id).then((result) => {
          var num = Object.assign({}, { like_num: result })
          frontArticle.updateCommentLikeNum(this.comment_id, num)
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

  articleReply(res) {
    frontArticle.createReply(this.reply)
      .then((result) => {
        var reply = result[0].ops[0]
        frontArticle.countComments(this.article_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          frontArticle.updateCommentNum(this.article_id, num)
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

  getArticlesBySearch(res) {
    frontArticle.getArticlesBySearch(this.key, this.page, this.limit)
      .then((preview) => {
        this.getres(preview, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
}

module.exports = {
  // 文章预览
  articlePreview: async (req, res) => {
    var articler = new fArticle(req.body)
    await articler.articlePreview(res)
    articler = null
  },
  // 发送文章赞
  articleLike: async (req, res) => {
    var articler = new fArticle(req.body)
    await articler.articleLike(res)
    articler = null
  },
  // 取消文章赞
  articleLikeCancel: async (req, res) => {
    var articler = new fArticle(req.body)
    await articler.articleLikeCancel(res)
    articler = null
  },
  // 获取一篇文章
  getOneArticle: async (req, res) => {
    var articler = new fArticle(req.body)
    await articler.getOneArticle(res)
    articler = null
  },
  // 获取所有评论
  getAllComments: async (req, res) => {
    var articler = new fArticle(req.body)
    await articler.getAllComments(res)
    articler = null
  },
  // 发送评论
  articleComment: async (req, res) => {
    var articler = new fArticle(req.body)
    await articler.articleComment(res)
    articler = null
  },
  // 发送评论点赞
  commentLike: async (req, res) => {
    var articler = new fArticle(req.body)
    await articler.commentLikeCreate(res)
    articler = null
  },
  // 取消评论点赞
  commentLikeCancel: async (req, res) => {
    var articler = new fArticle(req.body)
    await articler.commentLikeCancel(res)
    articler = null
  },
  // 发送回复
  articleReply: async (req, res) => {
    var articler = new fArticle(req.body)
    await articler.articleReply(res)
    articler = null
  },
  // 获取搜索文章列表
  getArticlesBySearch: async (req, res) => {
    var articler = new fArticle(req.body)
    await articler.getArticlesBySearch(res)
    articler = null
  }
}
