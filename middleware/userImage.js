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

function avatarDir(id) {
  return path.join(path.dirname(require.main.filename), `uploads/user/${id}`);
}
function tempDir(id) {
  return path.join(path.dirname(require.main.filename), `uploads/user/${id}temp`);
}
function editDir(id) {
  return path.join(path.dirname(require.main.filename), `uploads/user/${id}edit`);
}

module.exports = {
  // 前台
  editFolder(req, res, next) {
    if (!fs.existsSync(tempDir(req.headers['setting']))) {
      dir(tempDir(req.headers['setting']))
    }
    if (!fs.existsSync(editDir(req.headers['setting']))) {
      dir(editDir(req.headers['setting']))
    }
    next()
  },
  editSaveImage(req, res, next) {
    sharp(`uploads/user/${req.headers['setting']}temp/${req.files[0].filename}`).resize(300, 200).toFile(`uploads/user/${req.headers['setting']}edit/${req.files[0].filename}`)
    res.send({
      filename: req.files[0].filename,
      path: `uploads/admin/${req.headers['setting']}edit/` + req.files[0].filename,
      url: `http://localhost:3009/uploads/user/${req.headers['setting']}edit/` + req.files[0].filename,
      address: `http://localhost:3009/uploads/user/${req.headers['setting']}edit`,
      code: 200,
      message: '上传成功'
    })
  },
  eidtLoadImage(req, res, next) {
    if (fs.existsSync(editDir(req.body._id))) {
      fse.removeSync(`uploads/user/${req.body._id}edit`)
      dir(editDir(req.body._id))
    }
    if (fs.existsSync(tempDir(req.body._id))) {
      fse.removeSync(`uploads/user/${req.body._id}temp`)
    }
    if (!fs.existsSync(avatarDir(req.body._id))) {
      dir(avatarDir(req.body._id))
    }
    var files = fs.readdirSync(`uploads/user/${req.body._id}/`);
    if (files.length > 0) {
      fse.copySync(`uploads/user/${req.body._id}`, `uploads/user/${req.body._id}edit`)
      var data = []
      for (var i in files) {
        var name = files[i].replace(/.jpg/g, ``)
        data[i] = {}
        Object.assign(data[i], {
          filename: files[i],
          path: `uploads/user/${req.body._id}edit/${files[i]}`,
          url: `http://localhost:3009/uploads/user/${req.body._id}edit/${files[i]}`
        })
      }
      return res.send(data);
    } else {
      dir(editDir(req.body._id))
      fse.copySync(`uploads/user/default`, `uploads/user/${req.body._id}edit`)
      var data = []
      data[0] = {}
      Object.assign(data[0], {
        filename: 'Kostya.jpg',
        path: `uploads/user/${req.body._id}edit/Kostya.jpg`,
        url: `http://localhost:3009/uploads/user/${req.body._id}edit/Kostya.jpg`
      })
      return res.send(data);
    }
  },
  editProcess(req, res, next) {
    req.body.user_avatar = req.body.user_avatar.replace(/edit/g, "")
    console.log(req.body);
    fse.removeSync(`uploads/user/${req.body._id}`)
    dir(avatarDir(req.body._id))
    fse.copySync(`uploads/user/${req.body._id}edit`, `uploads/user/${req.body._id}`)
    fse.removeSync(`uploads/user/${req.body._id}temp`)
    next()
  },
  deleteImage(req, res, next) {
    fs.unlinkSync(req.body.path)
    res.send({
      code: 200,
      message: '删除成功'
    })
  }
}