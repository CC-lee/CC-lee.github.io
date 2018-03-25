var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var FroalaEditor = require('./lib/wysiwyg-editor-node-sdk')
var fse = require('fs-extra')
var folDir = require('./image-utils').FolDir('album')
var common = require('./image-common/image-common')


var createSaveImage = common.saveImageSet('album', 'create', {
  name: 'thumbnail',
  width: 300,
  height: 200
}, {
    name: 'info',
    width: 100,
    height: 100
  })

var createLoadImage = common.loadImageSet('album', 'create', { name: 'thumbnail' }, { name: 'info' })

var deleteImage = common.deleteImageSet('album', 'single')

var deleteAllImage = common.deleteImageSet('album', 'folder')

var createProcess = common.processSet('album', 'create')

var createProcessJudge = common.folderJudgeSet('album', 'create')

var tempProcess = common.processSet('album', 'save')

var tempProcessJudge = common.folderJudgeSet('album', 'save')

var createFolderJudge = common.folderJudgeSet('album', 'createpic')

var deleteJudge = common.folderJudgeSet('album', 'delete')

var deleteAllJudge = common.folderJudgeSet('album', 'deletAll')


module.exports = {
  createSaveImage,
  createLoadImage,
  deleteImage,
  deleteAllImage,
  createProcess,
  createProcessJudge,
  tempProcess,
  tempProcessJudge,
  createFolderJudge,
  deleteJudge,
  deleteAllJudge
}