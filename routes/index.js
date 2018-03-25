module.exports = function (app) {
  app.use('/api', require('./admin'))
  app.use('/api', require('./article'))
  app.use('/api', require('./classify'))
  app.use('/api', require('./album'))
  app.use('/api', require('./message'))
  app.use('/api', require('./shop'))
  app.use('/api', require('./user'))
}
