var path = require('path')
var config = require('../config')
var utils = require('./utils')
var webpack = require('webpack')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env
var extractCSS = new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash:7].css'))
var styleCSS = new ExtractTextPlugin({ filename: utils.assetsPath('css/style.[contenthash:7].css'), allChunks: true })
var isProd = process.env.NODE_ENV === 'production'
var vendor = [
  'vue',
  'vuex',
  'element-ui',
  'vue-router'
]
var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: styleCSS.extract({
              use: 'css-loader',
              fallback: 'vue-style-loader',
            }),
            scss: styleCSS.extract({
              use: 'css-loader!sass-loader',
              fallback: 'vue-style-loader',
            }),
            sass: styleCSS.extract({
              use: 'css-loader!sass-loader?indentedSyntax',
              fallback: 'vue-style-loader',
            })
          }
        }
      }, {
        test: /\.css$/,
        loader: extractCSS.extract(['css-loader', 'postcss-loader'])
      }, {
        test: /\.less/,
        loader: extractCSS.extract(['css-loader', 'postcss-loader', 'less-loader'])
      }, {
        test: /\.s[a|c]ss/,
        loader: extractCSS.extract(['css-loader', 'postcss-loader', 'sass-loader'])
      }]
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  entry: {
    app: './src/main.js',
    vendor: vendor
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: config.build.assetsPublicPath,
    filename: utils.assetsPath('js/[name].[chunkhash:7].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash:7].js')
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.min.js',
      'vuex': 'vuex/dist/vuex.min.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'pages': path.resolve(__dirname, '../src/pages'),
      'public': path.resolve(__dirname, '../src/pages/components'),
      'api': path.resolve(__dirname, '../src/api/index.js'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    extractCSS,
    styleCSS,
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['manifest', 'vendor'],
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      chunks: [
        'manifest', 'app', 'vendor',
      ],
      filename: 'index.html',
      template: 'src/template/index.html',
      inject: true,
      chunksSortMode: "dependency",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: isProd,
      options: {
        context: __dirname
      }
    })
  ]
})

module.exports = webpackConfig
