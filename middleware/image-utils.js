var path = require('path')
function DirSet(page, kind) {
  switch (kind) {
    case 'create':
      return function (id, dateid) {
        var address = `uploads/${page}/temp/${dateid}`
        return {
          url: `http://localhost:3009/${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`)
        }
      }
      break;
    case 'edit':
      return function (id, dateid) {
        var address = `uploads/${page}/${id}edit/edit/${dateid}`
        return {
          url: `http://localhost:3009/${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
          parent: {
            path: `uploads/${page}/${id}edit/edit`,
            folder: path.join(path.dirname(require.main.filename), `uploads/${page}/${id}edit/edit`)
          },
          depend:{
            path: `uploads/${page}/${id}`,
            folder: path.join(path.dirname(require.main.filename), `uploads/${page}/${id}`)
          }
        }
      }
      break;
  }
}

function ThumbnailSet(page, kind) {
  switch (kind) {
    case 'create':
      return function (id, dateid) {
        var address = `uploads/${page}/temp/${dateid}/thumbnail`
        return {
          url: `http://localhost:3009/${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`)
        };
      }
      break;
    case 'edit':
      return function (id, dateid) {
        var address = `uploads/${page}/${id}edit/edit/${dateid}/thumbnail`
        return {
          url: `http://localhost:3009/${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
        }
      }
      break;
  }
}

function InfoSet(page, kind) {
  switch (kind) {
    case 'create':
      return function (id, dateid) {
        var address = `uploads/${page}/temp/${dateid}/imageInfo`
        return {
          url: `http://localhost:3009/${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
        }
      }
      break;
    case 'edit':
      return function (id, dateid) {
        var address = `uploads/${page}/${id}edit/edit/${dateid}/imageInfo`
        return {
          url: `http://localhost:3009/${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
        }
      }
      break;
  }
}

function MainImg(page, kind) {
  switch (kind) {
    case 'create':
      return function (id, dateid) {
        var address = `uploads/${page}/temp/${dateid}/mainImg`
        return {
          url: `http://localhost:3009/${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
        }
      }
      break;
    case 'edit':
      return function (id, dateid) {
        var address = `uploads/${page}/${id}edit/edit/${dateid}/mainImg`
        return {
          url: `http://localhost:3009/${address}`,
          address: address,
          folder: path.join(path.dirname(require.main.filename), `${address}`),
        }
      }
      break;
  }
}

function FolDir(page) {
  return {
    createDir: DirSet(page, 'create'),
    createThumbnail: ThumbnailSet(page, 'create'),
    createInfo: InfoSet(page, 'create'),
    createMainImg: MainImg(page, 'create'),
    editDir: DirSet(page, 'edit'),
    editThumbnail: ThumbnailSet(page, 'edit'),
    editInfo: InfoSet(page, 'edit'),
    editMainImg: MainImg(page, 'edit')
  }
}



function ReadFolder() {

}


function FileSet(page, kind, name, folDir, thumbnail, info) {
  var image = {
    path: function (folDir, kind, _id, dateid, name) {
      return `${folDir[`${kind}Dir`](_id, dateid).address}/${name}.jpg`
    },
    url: function (folDir, kind, _id, dateid, name) {
      return `${folDir[`${kind}Dir`](_id, dateid).url}/${name}.jpg`
    }
  }
  var thumbImage = {
    path: function (folDir, kind, _id, dateid, name) {
      return `${folDir[`${kind}Thumbnail`](_id, dateid).address}/${name}m.jpg`
    },
    url: function (folDir, kind, _id, dateid, name) {
      return `${folDir[`${kind}Thumbnail`](_id, dateid).url}/${name}m.jpg`
    }
  }
  var infoImage = {
    path: function (folDir, kind, _id, dateid, name) {
      return `${folDir[`${kind}Info`](_id, dateid).address}/${name}info.jpg`
    },
    url: function (folDir, kind, _id, dateid, name) {
      return `${folDir[`${kind}Info`](_id, dateid).url}/${name}info.jpg`
    }
  }
  if (thumbnail && thumbnail.name == 'thumbnail') {
    if (info && info.name == 'info') {
      return function (req, res, next) {
        if (req.headers.dateid) {
          var dateid = req.headers.dateid
          var _id = req.headers._id
        } else {
          var dateid = req.body.dateid
          var _id = req.body._id
        }
        return {
          path: {
            path: image.path(folDir, kind, _id, dateid, name),
            thumbnail: thumbImage.path(folDir, kind, _id, dateid, name),
            info: infoImage.path(folDir, kind, _id, dateid, name)
          },
          url: {
            url: image.url(folDir, kind, _id, dateid, name),
            preview: thumbImage.url(folDir, kind, _id, dateid, name),
            info: infoImage.url(folDir, kind, _id, dateid, name)
          }
        }
      }
    }
    return function (req, res, next) {
      if (req.headers.dateid) {
        var dateid = req.headers.dateid
        var _id = req.headers._id
      } else {
        var dateid = req.body.dateid
        var _id = req.body._id
      }
      return {
        path: {
          path: image.path(folDir, kind, _id, dateid, name),
          thumbnail: thumbImage.path(folDir, kind, _id, dateid, name)
        },
        url: {
          url: image.url(folDir, kind, _id, dateid, name),
          preview: thumbImage.url(folDir, kind, _id, dateid, name)
        }
      }
    }
  } else {
    return function (req, res, next) {
      if (req.headers.dateid) {
        var dateid = req.headers.dateid
        var _id = req.headers._id
      } else {
        var dateid = req.body.dateid
        var _id = req.body._id
      }
      return {
        path: image.path(folDir, kind, _id, dateid, name),
        url: image.url(folDir, kind, _id, dateid, name)
      }
    }
  }
}


module.exports = {
  FolDir,
  FileSet
}