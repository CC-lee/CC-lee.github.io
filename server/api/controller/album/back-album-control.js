var apimodule = require('../../module')
var backAlbum = apimodule.backAlbum
var moment = require('moment')
var control = require('../control')
var jetpack = require('fs-jetpack')

class bAlbum extends control {
  constructor({
    dateid,
    _id,
    image_id,
    comment_id,
    image_content,
    text_content,
    like_status,
    like_num,
    comment_num,
    image_preview,
    image_info,
    create_date,
    update_date,
    timestamp
  }) {
    super({
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, image_id, image_preview, image_info, comment_id, dateid })
    this.temp = {
      image_content,
      text_content,
    }
    this.image = {
      image_content,
      text_content,
      like_status,
      like_num,
      comment_num,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.preview = {
      image_id: this.image_id,
      image_preview: image_preview,
      like_num,
      comment_num,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.info = {
      image_id: this.image_id,
      image_info,
      comment_num,
      like_num,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.updateImage = {
      image_content,
      text_content,
      update_date: this.update_date
    }
    this.updatePreview = {
      update_date: this.update_date
    }
    this.updateInfo = {
      update_date: this.update_date
    }
  }
  getImageTemp(res) {
    backAlbum.getTemp()
      .then((temp) => {
        this.getres(temp, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  imageTemp(res) {
    backAlbum.updateTemp({ tempId: this._id, temp: this.temp })
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

  imageCreate(res) {
    Object.assign(this.temp, { image_content: '', text_content: '' })
    backAlbum.createImage(this.image, { tempId: this._id, temp: this.temp })
      .then((result) => {
        var { _id: imageId } = result[0].ops[0]
        jetpack.rename(`uploads/album/${this.dateid}`, `${imageId}`)
        Object.assign(this.preview, { image_id: `${imageId}`, image_preview: `http://localhost:3009/uploads/album/${imageId}/thumbnail/${this.image_preview}` })
        Object.assign(this.info, { image_id: `${imageId}`, image_info: `http://localhost:3009/uploads/album/${imageId}/imageInfo/${this.image_info}` })
        backAlbum.createImagePvIf({ preview: this.preview, info: this.info })
          .then((result) => {
            this.createres(result, res)
          })
          .catch(err => {
            this.fail(res, err)
          })
      })
      .catch(err => {
        fail(res, err)
      })
  }

  imageDelete(res) {
    backAlbum.deleteImage(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  albumInfo(res) {
    backAlbum.getInfo()
      .then((info) => {
        this.getres(info, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  editOneImage(res) {
    backAlbum.updateImage(this._id, { image: this.updateImage, preview: this.updatePreview, info: this.updateInfo })
      .then((result) => {
        this.updateres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneImage(res) {
    backAlbum.getImage(this._id)
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

  getAllComments(res) {
    backAlbum.getComment(this.image_id)
      .then((comment) => {
        setTimeout(() => {
          this.getres(comment, res)
        }, 100)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteOneComment(res) {
    backAlbum.deleteComment(this.comment_id)
      .then((result) => {
        backAlbum.countComments(this.image_id).then((result) => {
          var num = Object.assign({}, { comment_num: result })
          backAlbum.updateCommentNum(this.image_id, num)
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
  getImageTemp: connectFun('getImageTemp', bAlbum),
  // 更新草稿数据
  imageTemp: connectFun('imageTemp', bAlbum),
  // 创建图片
  imageCreate: connectFun('imageCreate', bAlbum),
  // 图片删除
  imageDelete: connectFun('imageDelete', bAlbum),
  // 获取相册信息列表
  albumInfo: connectFun('albumInfo', bAlbum),
  // 更新一张图片
  editOneImage: connectFun('editOneImage', bAlbum),
  // 获取一张图片
  getOneImage: connectFun('getOneImage', bAlbum),
  // 获取一张图片的全部评论
  getAllComments: connectFun('getAllComments', bAlbum),
  // 删除一条评论
  deleteOneComment: connectFun('deleteOneComment', bAlbum)
}
