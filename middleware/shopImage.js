var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var FroalaEditor = require('./lib/wysiwyg-editor-node-sdk')
var fse = require('fs-extra')
var folDir = require('./image-utils').FolDir('shop')
var common = require('./image-common/image-common')

var createSaveImage = common.saveImageSet('shop', 'create', {
  name: 'thumbnail',
  width: 300,
  height: 200
}, null)

var editSaveImage = common.saveImageSet('shop', 'edit', {
  name: 'thumbnail',
  width: 300,
  height: 200
}, null)

var createLoadImage = common.loadImageSet('shop', 'create', { name: 'thumbnail' }, null)

var editLoadImage = common.loadImageSet('shop', 'edit', { name: 'thumbnail' }, null)

var deleteImage = common.deleteImageSet('shop', 'single')

var deleteAllImage = common.deleteImageSet('shop', 'folder')

var createProcess = common.processSet('shop', 'create')

var createProcessJudge = common.folderJudgeSet('shop', 'create')

var editProcess = common.processSet('shop', 'edit')

var editProcessJudge = common.folderJudgeSet('shop', 'edit')

var tempProcess = common.processSet('shop', 'save')

var tempProcessJudge = common.folderJudgeSet('shop', 'save')

var createFolderJudge = common.folderJudgeSet('shop', 'createpic')

var editFolderJudge = common.folderJudgeSet('shop', 'editpic')

var deleteJudge = common.folderJudgeSet('shop', 'delete')

var deleteAllJudge = common.folderJudgeSet('shop', 'deletAll')

module.exports = {
  createSaveImage,
  editSaveImage,
  createLoadImage,
  editLoadImage,
  deleteImage,
  deleteAllImage,
  createProcess,
  createProcessJudge,
  editProcess,
  editProcessJudge,
  tempProcess,
  tempProcessJudge,
  createFolderJudge,
  editFolderJudge,
  deleteJudge,
  deleteAllJudge
}