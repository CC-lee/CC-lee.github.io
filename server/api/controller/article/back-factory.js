/**
 * class Article
 * @class Article
 */
class Article {
  /**
   * @param {Object} obj 
   * @param {string} obj.title 
   * @param {string} obj.content
   * @param {number} obj.comment_num   
   * @param {number} obj.like_num
   * @param {boolean} obj.like_status
   * @param {string} obj.classify 
   */
  constructor(obj) {
    var article = {
      title: obj.title,
      content: obj.content,
      comment_num: obj.comment_num,
      like_num: obj.like_num,
      like_status: obj.like_status,
      classify: obj.classify
    }
    this.article = article
  }
}
/**
 * class Preview
 * @class Preview
 */
class Preview {
  constructor() {

  }
}


function backArticleFactor(obj, command) {
  return new Article(obj)
}


module.exports = {
  backArticleFactor
}


