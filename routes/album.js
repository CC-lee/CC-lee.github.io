var express = require('express')
var router = express.Router()
var frontArray = require('./album/frontArray')
var backArray = require('./album/backArray')
var routerSet = require('./common')
var setArray = frontArray.concat(backArray)

routerSet(router, setArray)

module.exports = router
