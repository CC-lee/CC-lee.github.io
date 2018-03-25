var express = require('express')
var router = express.Router()
var backApi = require('../api/backApi').user
var adminToken = require('../middleware/checkAdminToken')
var frontArray = require('./user/frontArray')
var routerSet = require('./common')


function url(str) {
  return `/user/${str}`
}

var setArray = frontArray

routerSet(router, setArray)

// 后台
// 用户信息列表
router.get(url('userList'), adminToken, backApi.userList)
// 删除用户
router.post(url('deleteUser'), adminToken, backApi.deleteUser)

module.exports = router
