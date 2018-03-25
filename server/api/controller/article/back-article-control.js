var apimodule = require('../../module')
var backArticle = apimodule.backArticle
var control = require('../control')
var jetpack = require('fs-jetpack')
var backArticleFactor = require('./back-factory').backArticleFactor

class bArticle extends control {
  constructor({
    dateid,
    _id,
    title,
    content,
    classify,
    comment_num,
    like_num,
    like_status,
    article_id,
    comment_id,
    article_preview,
    theme_img,
    create_date,
    update_date,
    timestamp
      }) {
    super({
      create_date,
      update_date,
      timestamp
    })
    Object.assign(this, { _id, article_id, title, theme_img, comment_id, dateid })
    this.temp = {
      title,
      content,
      classify,
    }
    this.article = {
      title,
      content,
      comment_num,
      like_num,
      like_status,
      classify,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.preview = {
      article_id,
      title,
      article_preview,
      theme_img,
      classify,
      like_num,
      like_status,
      comment_num,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.info = {
      title,
      article_id,
      classify,
      like_num,
      comment_num,
      create_date: this.create_date,
      update_date: this.update_date,
      timestamp: this.timestamp
    }
    this.updateArticle = {
      title,
      content,
      classify,
      update_date: this.update_date
    }
    this.updatePreview = {
      title,
      article_preview,
      theme_img,
      classify,
      update_date: this.update_date
    }
    this.updateInfo = {
      title,
      classify,
      update_date: this.update_date
    }

  }

  getArticleTemp(res) {
    var dateidReg = RegExp('/dateid/', 'gim')
    backArticle.getTemp()
      .then((temp) => {
        temp[0].content = temp[0].content.replace(dateidReg, `/${this.dateid}/`)
        this.getres(temp, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  articleTemp(res) {
    var dateidReg = RegExp(`/${this.dateid}/`, 'gim')
    this.temp.content = this.temp.content.replace(dateidReg, '/dateid/')
    backArticle.updateTemp({ tempId: this._id, temp: this.temp })
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

  articleCreate(res) {
    var reg = RegExp(`/temp/${this.dateid}/`, 'gim')
    this.article.content = this.article.content.replace(reg, `/articleId/`)
    Object.assign(this.temp, { title: '', content: '', classify: '' })
    backArticle.createArticle(this.article, { tempId: this._id, temp: this.temp })
      .then((result) => {
        var { _id: articleId } = result[0].ops[0]
        jetpack.rename(`uploads/article/${this.dateid}`, `${articleId}`);
        Object.assign(this.preview, {
          article_id: `${articleId}`, theme_img: this.theme_img
            .replace(reg, `/${articleId}/thumbnail/`)
            .replace(/\.(jpg|pdf|JPG|png)/ig, 'm.jpg')
        })
        Object.assign(this.info, { article_id: `${articleId}` })
        backArticle.createArticlePvIf({ preview: this.preview, info: this.info })
          .then((result) => {
            this.createres(result, res)
          })
          .catch(err => {
            this.fail(res, err)
          })
      })
  }

  articleInfo(res) {
    backArticle.getInfo()
      .then((info) => {
        this.getres(info, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  articledelete(res) {
    backArticle.deleteArticle(this._id)
      .then((result) => {
        this.deleteres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getOneArticle(res) {
    var reg = RegExp(`/articleId/`, 'gim')
    backArticle.getArticle(this._id)
      .then((article) => {
        article.content = article.content.replace(reg, `/${this._id}edit/edit/${this.dateid}/`)
        this.getres(article, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  editOneArticle(res) {
    var reg = RegExp(`/${this._id}edit/edit/${this.dateid}/`, 'gim')
    this.updateArticle.content = this.updateArticle.content.replace(reg, `/articleId/`)
    this.updatePreview.theme_img = this.updatePreview.theme_img
      .replace(reg, `/${this._id}/thumbnail/`)
      .replace(/\.(jpg|pdf|JPG|png)/ig, 'm.jpg')
    backArticle.updateArticle(this._id, { article: this.updateArticle, preview: this.updatePreview, info: this.updateInfo })
      .then((result) => {
        this.updateres(result, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  deleteOneComment(res) {
    backArticle.deleteComment(this.comment_id)
      .then((result) => {
        backArticle.countComments(this.article_id).then((result) => {
          var num = Object.assign({}, { comment_num: result[0] + result[1] })
          backArticle.updateCommentNum(this.article_id, num)
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

  getAllComments(res) {
    backArticle.getComment(this.article_id)
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
    backArticle.getReply(comment._id)
      .then((reply) => {
        Object.assign(comment, { comment_reply: reply })
      })
      .catch(err => {
        this.fail(res, err)
      })
  }
}

module.exports = {
  // 获取草稿数据
  getArticleTemp: async (req, res) => {
    var articler = new bArticle(req.body)
    await articler.getArticleTemp(res)
    articler = null
  },
  // 更新草稿数据
  articleTemp: async (req, res) => {
    var articler = new bArticle(req.body)
    await articler.articleTemp(res)
    articler = null
  },
  // 创建文章
  articleCreate: async (req, res) => {
    var articler = new bArticle(req.body)
    await articler.articleCreate(res)
    articler = null
  },
  //获取文章信息列表
  articleInfo: async (req, res) => {
    var articler = new bArticle(req.body)
    await articler.articleInfo(res)
    articler = null
  },
  // 文章删除
  articledelete: async (req, res) => {
    var articler = new bArticle(req.body)
    await articler.articledelete(res)
    articler = null
  },
  // 获取一篇文章
  getOneArticle: async (req, res) => {
    var articler = new bArticle(req.body)
    await articler.getOneArticle(res)
    articler = null
  },
  // 更新文章
  editOneArticle: async (req, res) => {
    var articler = new bArticle(req.body)
    await articler.editOneArticle(res)
    articler = null
  },
  // 编辑临时更新
  editOneTemp: async (req, res) => {
    var articler = new bArticle(req.body)
    await articler.editOneTemp(res)
    articler = null
  },
  // 删除一条评论
  deleteOneComment: async (req, res) => {
    var articler = new bArticle(req.body)
    await articler.deleteOneComment(res)
    articler = null
  },
  // 获取一篇文章的所有评论
  getAllComments: async (req, res) => {
    var articler = new bArticle(req.body)
    await articler.getAllComments(res)
    articler = null
  }
}
