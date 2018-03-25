var apimodule = require('../../module')
var frontClass = apimodule.frontClass
var frontArticle = apimodule.frontArticle
var control = require('../control')

class fClass extends control {
  constructor({ classify, user_id, article_id }) {
    super({
      user_id
    })
    Object.assign(this, { classify, article_id })
  }

  classList(res) {
    frontClass.getAllClass()
      .then((list) => {
        this.getres(list, res)
      })
      .catch(err => {
        this.fail(res, err)
      })
  }

  getArticlesByClass(res) {
    if (this.user_id) {
      frontArticle.getLike(this.user_id, this.article_id).then((result) => {
        var likes = result
        frontClass.getArticlesByClass(this.classify)
          .then((preview) => {
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
                data: preview
              })
            }, 200)
          })
          .catch(err => {
            this.fail(res, err)
          })
      })
    } else {
      frontClass.getArticlesByClass(this.classify)
        .then((preview) => {
          this.getres(preview, res)
        })
        .catch(err => {
          this.fail(res, err)
        })
    }
  }
}

module.exports = {
  // 获取所有分类
  classList: (req, res) => {
    var classer = new fClass(req.body)
    classer.classList(res)
  },
  // 根据分类获取文章
  getArticlesByClass: (req, res) => {
    var classer = new fClass(req.body)
    classer.getArticlesByClass(res)
  },
}
