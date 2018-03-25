var controller = require('./controller')
var Admin = controller.admin
var Article = controller.backArticle
var Class = controller.backClass
var Message = controller.backMessage
var Album = controller.backAlbum
var Shop = controller.backShop
var User = controller.backUser

module.exports = {
  admin: Admin,
  article:Article,
  class: Class,
  message: Message,
  album:Album,
  shop: Shop,
  user:User
}
