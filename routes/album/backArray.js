var backApi = require('../../api/backApi').album
var albumImage = require('../../middleware/albumImage')
var adminToken = require('../../middleware/checkAdminToken')
var upload = require('../../middleware/multerSet')('album', 'create')

function url(str) {
  return `/album/${str}`
}

var nonImage = [
  {
    command: 'get',
    url: url('getImageTemp'),// 获取临时图片数据
    middleware: [adminToken],
    set: backApi.getImageTemp
  },
  {
    command: 'get',
    url: url('albumInfo'),// 图片列表数据
    middleware: [adminToken],
    set: backApi.albumInfo
  },
  {
    command: 'post',
    url: url('backOneImage'),// 获取一个图片
    middleware: [adminToken],
    set: backApi.getOneImage
  },
  {
    command: 'post',
    url: url('editOneImage'),// 编辑图片
    middleware: [adminToken],
    set: backApi.editOneImage
  },
  {
    command: 'post',
    url: url('backAllComments'),// 获取一个图片的所有评论
    middleware: [adminToken],
    set: backApi.getAllComments
  },
  {
    command: 'post',
    url: url('deleteOneComment'),// 删除一个评论
    middleware: [adminToken],
    set: backApi.deleteOneComment
  },
]
var image = [
  {
    command: 'post',
    url: url('imageTemp'),// 更新临时图片数据
    middleware: [adminToken, albumImage.tempProcessJudge, albumImage.tempProcess],
    set: backApi.imageTemp
  },
  {
    command: 'post',
    url: url('imageCreate'),// 创建图片
    middleware: [adminToken, albumImage.createProcessJudge, albumImage.createProcess],
    set: backApi.imageCreate
  },

  {
    command: 'post',
    url: url('imageDelete'),// 相册图片删除
    middleware: [adminToken, albumImage.deleteAllJudge, albumImage.deleteAllImage],
    set: backApi.imageDelete
  },
  {
    command: 'post',
    url: url('createSaveImage'),// 创建相册图片保存图片
    middleware: [adminToken, albumImage.createFolderJudge, upload.any()],
    set: albumImage.createSaveImage
  },
  {
    command: 'post',
    url: url('createLoadImage'),// 加载图片数据
    middleware: [adminToken],
    set: albumImage.createLoadImage
  },
  {
    command: 'post',
    url: url('deleteImage'),// 删除图片数据
    middleware: [adminToken, albumImage.deleteJudge],
    set: albumImage.deleteImage
  },
]
var backArray = nonImage.concat(image)

module.exports = backArray