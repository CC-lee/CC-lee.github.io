var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var projectRoot = path.resolve(__dirname, '../')
var vueConfig = require('./vue-loader.config')
var env = process.env.NODE_ENV
var isProd = process.env.NODE_ENV === 'production'
// check env & config/index.js to decide whether to enable CSS source maps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd
process.noDeprecation = true


module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: isProd ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
    filename: '[name].js'
  },
  externals: {
    'jquery': 'jQuery'
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    modules: [path.join(__dirname, '../node_modules')]
  },
  resolveLoader: {
    modules: [path.join(__dirname, '../node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          path.join(projectRoot, 'src')
        ],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', 'window.jQuery': 'jquery' })]
}
