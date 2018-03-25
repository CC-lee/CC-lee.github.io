var multer = require('multer')
function multerSet(page, kind) {
  switch (kind) {
    case 'create':
      var Storage = multer.diskStorage({
        destination: function (req, file, cb) {
          try {
            if (req.headers.userid) {
              cb(null, `uploads/${page}/${req.headers['userid']}/${req.headers.dateid}`)
            } else {
              cb(null, `uploads/${page}/temp/${req.headers.dateid}/`)
            }
          } catch (err) {
            console.log(err);
          }
        },
        filename: function (req, file, cb) {
          try {
            setTimeout(function () {
              cb(null, Date.now() + '.jpg')
            }, 100);
          } catch (err) {
            console.log(err);
          }
        }
      })
      var upload = multer({ storage: Storage })
      return upload
    case 'edit':
      var Storage = multer.diskStorage({
        destination: function (req, file, cb) {
          try {
            cb(null, `uploads/${page}/${req.headers._id}edit/edit/${req.headers.dateid}/`)
          } catch (err) {
            console.log(err);
          }
        },
        filename: function (req, file, cb) {
          try {
            setTimeout(function () {
              cb(null, Date.now() + '.jpg')
            }, 100);
          } catch (err) {
            console.log(err);
          }
        }
      })
      var edit = multer({ storage: Storage })
      return edit
  }
}

module.exports = multerSet