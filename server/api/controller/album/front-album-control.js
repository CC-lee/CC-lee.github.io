var apimodule = require('../../module')
var frontAlbum = apimodule.frontAlbum
var control = require('../control')

class fAlbum extends control {
  constructor({
    _id,
    image_id,
    content,
    target_id,
    like_num,
    like_status,
    page,
    limit,
    user_id,
    user_avatar,
    user_name,
    comment_id,
    create_date,
    update_date,
    timestamp,
    time,
    like_type
      }) {
    super({
      user_id,
      user_avatar,
      user_name,
      comment_id,
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, image_id, page, limit, user_id })
    this.comment = {
      image_id,
      user_id: this.user_id,
      user_avatar: this.user_avatar,
      user_name: this.user_name,
      content,
      like_num,
      like_status,
      time,
      timestamp: this.timestamp
    }
    this.like = {
      image_id,
      user_id: this.user_id,
      like_type,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.commentLike = {
      image_id,
      user_id: this.user_id,
      comment_id: this.comment_id,
      target_id,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }

  }

  albumList(res) {
    frontAlbum.getPreview({ page: this.page, limit: this.limit })
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

  getOneImage(res) {
    if (this.user_id) {
      frontAlbum.getLike(this.user_id, this._id).then((result) => {
        if (result.length > 0) {
          var like = result[0]
          frontAlbum.getImage(this._id)
            .then((image) => {
              var arrs = image.image_content.match(/http/g)
              if (!arrs) {
                image.image_content = `http://localhost:3009/uploads/album/${this._id}/${image.image_content}`;
              }
              if (like.user_id == this.user_id) {
                image.like_status = true
                this.getres(image, res)
              } else {
                this.getres(image, res)
              }
            })
            .catch(err => {
              this.fail(res, err)
            })
        } else {
          frontAlbum.getImage(this._id)
            .then((image) => {
              var arrs = image.image_content.match(/http/g)
              if (!arrs) {
                image.image_content = `http://localhost:3009/uploads/album/${this._id}/${image.image_content}`;
              }
              this.getres(image, res)
            })
            .catch(err => {
              this.fail(res, err)
            })
        }
      })
    } else {
      frontAlbum.getImage(this._id)
        .then((image) => {
          var arrs = image.image_content.match(/http/g)
          if (!arrs) {
            image.image_content = `http://localhost:3009/uploads/album/${this._id}/${image.image_content}`;
          }
          this.getres(image, res)
        })
        .catch(err => {
          this.fail(res, err)
        })
    }
  }

  getAllComments(res) {
    frontAlbum.getCommentLike(this.user_id).then((result) => {
      var commentlikes = result
      frontAlbum.getComment(this.image_id)
        .then((comments) => {
          for (var i in comments) {
            if (commentlikes.length > 0) {
              if (comments[i].like_num > 0) {
                for (var x in commentlikes) {
                  if (commentlikes[x].user_id == this.user_id) {
                    comments[i].like_status = true
                  }
                }
              }
            }
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

  imageComment(res) {
    frontAlbum.createComment(this.image_id, this.comment)
      .then((result) => {
        var comment = result[0].ops[0]
        frontAlbum.countComments(this.image_id).then((result) => {
          var num = Object.assign({}, { comment_num: result })
          frontAlbum.updateCommentNum(this.image_id, num)
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

  imageLike(res) {
    var num = { like_num: '' }
    frontAlbum.createLike(this.like)
      .then((result) => {
        frontAlbum.countLikes(this.image_id).then((result) => {
          num.like_num = result
          frontAlbum.updateLikeNum(this.image_id, num)
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

  imageLikeCancel(res) {
    var num = { like_num: '' }
    frontAlbum.deleteLike({ imageId: this.image_id, userId: this.user_id })
      .then((result) => {
        frontAlbum.countLikes(this.image_id).then((result) => {
          num.like_num = result
          frontAlbum.updateLikeNum(this.image_id, num)
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

  commentLikeCreate(res) {
    var num = { like_num: '' }
    frontAlbum.createCommentLike(this.commentLike)
      .then((result) => {
        frontAlbum.countCommentLikes(this.comment_id).then((result) => {
          num.like_num = result
          frontAlbum.updateCommentLikeNum(this.comment_id, num)
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
    frontAlbum.deleteCommentLike({ commentId: this.comment_id, userId: this.user_id })
      .then((result) => {
        frontAlbum.countCommentLikes(this.comment_id).then((result) => {
          var num = Object.assign({}, { like_num: result })
          frontAlbum.updateCommentLikeNum(this.comment_id, num)
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
}

function connectFun(Command, Connect) {
  return async (req, res) => {
    var connect = new Connect(req.body)
    await connect[Command](res)
    connect = null
  }
}

module.exports = {
  // 相册列表
  albumList: connectFun('albumList', fAlbum),
  // 获取一张图片
  getOneImage: connectFun('getOneImage', fAlbum),
  // 获取一张图片的全部评论
  getAllComments: connectFun('getAllComments', fAlbum),
  // 发送评论
  imageComment: connectFun('imageComment', fAlbum),
  // 图片赞
  imageLike: connectFun('imageLike', fAlbum),
  // 图片赞取消
  imageLikeCancel: connectFun('imageLikeCancel', fAlbum),
  // 评论点赞
  commentLike: connectFun('commentLikeCreate', fAlbum),
  // 评论赞取消
  commentLikeCancel: connectFun('commentLikeCancel', fAlbum)
}
