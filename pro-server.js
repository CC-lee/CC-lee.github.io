var config = require('./config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// default port where dev server listens for incoming traffic
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.build.proxyTable

var app = express()

Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

var history = require('connect-history-api-fallback')
app.use(history({
  rewrites: [
    { from: 'index', to: '/index.html'},
    { from: /\/pages/, to: '/index2.html'}
  ]
}))
app.enable('trust proxy')
// proxy api requests
app.use(express.static(path.join(__dirname, 'dist')))
// handle fallback for HTML5 history API
// serve pure static assets


app.get('*', (req, res) => {
  res.send('HTTP STATUS: 404')
})

const port = 8088
var uri = `http://localhost:${port}/pages`
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
  opn(uri)
})

