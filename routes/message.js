var express = require('express')
var router = express.Router()
var frontArray = require('./message/frontArray')
var backArray = require('./message/backArray')
var routerSet = require('./common')

var setArray = frontArray.concat(backArray)

routerSet(router, setArray)

module.exports = router
