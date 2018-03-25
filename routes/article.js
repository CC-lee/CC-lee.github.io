var express = require('express')
var router = express.Router()
var frontArray = require('./article/frontArray')
var backArray = require('./article/backArray')
var routerSet = require('./common')
var setArray = frontArray.concat(backArray)

routerSet(router, setArray)

module.exports = router
