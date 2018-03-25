var express = require('express')
var router = express.Router()
var api = require('../api')
var adminToken = require('../middleware/checkAdminToken')
var userToken = require('../middleware/checkUserToken')
var frontApi = require('../api/frontApi').class
var backApi = require('../api/backApi').class

function url(str) {
  return `/classify/${str}`
}
// 后台
// 创建分类
router.post(url('classCreate'), adminToken, backApi.classCreate)
// 删除分类
router.post(url('removeClass'), adminToken, backApi.removeClass)
// 获取一个分类
router.post(url('getOneClass'), adminToken, backApi.getOneClass)
// 编辑分类
router.post(url('editOneClass'), adminToken, backApi.editOneClass)
// 获取所有分类
router.get(url('classList'), adminToken, backApi.classList)

// 前台
// 获取分类给前台使用
router.get(url('classifyList'), frontApi.classList)

// 根据分类获取文章
router.post(url('getArticlesByClass'), frontApi.getArticlesByClass)

module.exports = router
