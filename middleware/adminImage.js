var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var sharp = require('sharp')
var fse = require('fs-extra')
sharp.cache(false);

// 生成文件夹
function dir(filesDir) {
  mkdirp.sync(filesDir)
}

var avatarDir = path.join(path.dirname(require.main.filename), 'uploads/admin/avatar');

var tempDir = function (dateid) {
  return path.join(path.dirname(require.main.filename), `uploads/admin/${dateid}temp`);
}

var editDir = function (dateid) {
  return path.join(path.dirname(require.main.filename), `uploads/admin/${dateid}edit`);
}

module.exports = {
  editFolder(req, res, next) {
    var dateid = req.headers.dateid;
    dir(tempDir(dateid))
    dir(editDir(dateid))
    next()
  },
  eidtLoadImage(req, res, next) {
    var files = fs.readdirSync(`uploads/admin/avatar/`);
    if (files.length > 0) {
      var data = []
      for (var i in files) {
        var name = files[i].replace(/.jpg/g, ``)
        data[i] = {}
        Object.assign(data[i], {
          filename: files[i],
          url: `http://localhost:3009/uploads/admin/avatar/${files[i]}`
        })
      }
      return res.send({
        code: 200,
        data
      });
    } else {
      var data = []
      data[0] = {}
      Object.assign(data[0], {
        filename: files[i],
        url: `http://localhost:3009/uploads/admin/default/Kostya.jpg`
      })
      return res.send({
        code: 200,
        data
      });
    }
  },
  editSaveImage(req, res, next) {
    var dateid = req.headers.dateid;
    var name = req.files[0].filename
    sharp(`uploads/admin/${dateid}temp/${req.files[0].filename}`).resize(300, 200).toFile(`uploads/admin/${dateid}edit/${req.files[0].filename}`)
    res.send({
      code: 200,
      message: '上传成功',
      data: {
        filename: name,
        url: `http://localhost:3009/uploads/admin/avatar/${name}`
      },
    })
  },
  editProcess(req, res, next) {
    var dateid = req.body.dateid;
    var tempJudge = fs.existsSync(tempDir(dateid))
    var editJudge = fs.existsSync(editDir(dateid))
    if (!tempJudge && !editJudge) {
      var arrs = req.body.avatar.match(/admin\/default/ig)
      if (arrs && arrs.length > 0) {
        fse.removeSync(`uploads/admin/avatar`)
        dir(avatarDir)
        next()
      } else {
        next()
      }
    } else if (tempJudge && editJudge) {
      fse.removeSync(`uploads/admin/avatar`)
      fse.copySync(`uploads/admin/${dateid}edit`, `uploads/admin/avatar`)
      fse.removeSync(`uploads/admin/${dateid}temp`)
      fse.removeSync(`uploads/admin/${dateid}edit`)
      next()
    }
    else {
      if (fs.existsSync(tempDir(dateid))) {
        fse.removeSync(`uploads/admin/${dateid}temp`)
      }
      if (fs.existsSync(editDir(dateid))) {
        fse.removeSync(`uploads/admin/${dateid}edit`)
      }
      res.send({
        code: 401,
        message: '后台错误，请重新刷新'
      })
    }
  },
  loadAvatar(req, res, next) {
    var files = fs.readdirSync(`uploads/admin/avatar/`);
    if (files.length > 0) {
      var data = []
      for (var i in files) {
        var name = files[i].replace(/.jpg/g, ``)
        data[i] = {}
        Object.assign(data[i], {
          filename: files[i],
          path: `uploads/admin/avatar/${files[i]}`,
          url: `http://localhost:3009/uploads/admin/avatar/${files[i]}`
        })
      }
      return res.send(data);
    } else {
      var data = []
      return res.send(data);
    }
  }
}