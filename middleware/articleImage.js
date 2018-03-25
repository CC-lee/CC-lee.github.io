var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var FroalaEditor = require('./lib/wysiwyg-editor-node-sdk')
var sharp = require('sharp')
var fse = require('fs-extra')
var common = require('./image-common/image-common')
// 生成文件夹
function dir(filesDir) {
  mkdirp.sync(filesDir)
}

var saveDir = function () {
  var address = 'uploads/article/save'
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var createDir = function (dateid) {
  var address = `uploads/article/temp/${dateid}`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var createThumbnail = function (dateid) {
  var address = `uploads/article/temp/${dateid}/thumbnail`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var Dir = function (id) {
  var address = `uploads/article/${id}`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var editDir = function (id, dateid) {
  var address = `uploads/article/${id}edit/edit/${dateid}`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var editThumbnail = function (id, dateid) {
  var address = `uploads/article/${id}edit/edit/${dateid}/thumbnail`
  return {
    address: address,
    folder: path.join(path.dirname(require.main.filename), address)
  }
}

var tempProcess = common.processSet('article', 'save')
var tempProcessJudge = common.folderJudgeSet('article', 'save')
var createProcess = common.processSet('article', 'create')
var createProcessJudge = common.folderJudgeSet('article', 'create')
var editProcess = common.processSet('article', 'edit')
var editProcessJudge = common.folderJudgeSet('article', 'edit')
var deleteJudge = common.folderJudgeSet('article', 'delete')
var deleteAllJudge = common.folderJudgeSet('article', 'deletAll')

module.exports = {
  createSaveImage(req, res, next) {
    var dateid = req.headers['dateid'];
    var createPath = createDir(dateid).address
    var thumbPath = createThumbnail(dateid).address
    FroalaEditor.Image.upload(req, `/${createPath}/`, function (err, data) {
      if (err) {
        return res.send(JSON.stringify(err));
      }
      var regName = new RegExp(`/${createPath}/`, 'gim')
      var name = data.link.replace(/.(jpg|JPG)/g, ``).replace(regName, ``)
      sharp(`${createPath}/${name}.jpg`).resize(300, 200).toFile(`${thumbPath}/${name}m.jpg`)
      data.link = 'http://localhost:3009' + data.link
      res.send(data);
    })
  },
  editSaveImage(req, res, next) {
    var id = req.headers['article_id'];
    var dateid = req.headers['dateid'];
    var editpath = editDir(id, dateid).address
    var thumbPath = editThumbnail(id, dateid).address
    FroalaEditor.Image.upload(req, `/${editpath}/`, function (err, data) {
      if (err) {
        return res.send(JSON.stringify(err));
      }
      var regName = new RegExp(`/${editpath}/`, 'gim')
      var name = data.link.replace(/.(jpg|JPG|png)/g, ``).replace(regName, ``)
      sharp(`${editpath}/${name}.jpg`).resize(300, 200).toFile(`${thumbPath}/${name}m.jpg`)
      data.link = 'http://localhost:3009' + data.link
      res.send(data);
    })
  },
  createLoadImage(req, res, next) {
    var dateid = req.body['dateid'];
    if (!fs.existsSync(saveDir().folder)) {
      dir(saveDir().folder);
    }
    dir(createDir(dateid).folder);
    dir(createThumbnail(dateid).folder);
    fse.copySync(saveDir().address, createDir(dateid).address)
    return res.send({
      code: 200,
      message: '加载成功'
    });
  },
  eidtLoadImage(req, res, next) {
    var _id = req.body._id
    var dateid = req.body.dateid
    fse.copySync(`uploads/article/${_id}`, editDir(_id, dateid).address)
    return res.send({
      code: 200,
      message: '加载成功'
    });
  },
  deleteImage(req, res, next) {
    if (req.body._id) {
      var regPath = new RegExp(`/${req.body.dateid}/`, 'gim')
      var thumbnail = req.body.src
        .replace(regPath, `/${req.body.dateid}/thumbnail/`)
        .replace(/.(jpg|JPG)/g, 'm.jpg');
    } else {
      var regPath = new RegExp(`${createDir(req.body.dateid).address}`, 'gim')
      var thumbnail = req.body.src
        .replace(regPath, createThumbnail(req.body.dateid).address)
        .replace(/.(jpg|JPG)/g, 'm.jpg');
    }
    fs.unlinkSync(thumbnail)
    FroalaEditor.Image.delete(req.body.src, function (err) {
      if (err) {
        return res.status(404).end(JSON.stringify(err));
      }
      res.send({
        code: 200,
        message: '图片删除成功'
      })
    });
  },
  deleteAllImage(req, res, next) {
    var EDir = editDir(req.body._id)
    var path = Dir(req.body._id)
    if (fs.existsSync(path)) {
      fse.removeSync(`uploads/article/${req.body._id}`)
      if (fs.existsSync(EDir)) {
        fse.removeSync(`uploads/article/${req.body._id}edit`)
      }
    }
    next()
  },
  tempProcessJudge,
  tempProcess,
  createProcessJudge,
  createProcess,
  editProcessJudge,
  editProcess,
  deleteJudge,
  deleteAllJudge
}