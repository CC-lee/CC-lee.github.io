var express = require('express')
var router = express.Router()
var frontArray = require('./shop/frontArray')
var backArray = require('./shop/backArray')
var routerSet = require('./common')

var setArray = frontArray.concat(backArray)

routerSet(router, setArray)

module.exports = router

