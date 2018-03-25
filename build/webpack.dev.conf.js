var path = require('path')
var config = require('../config')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrors = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: 'vue-style-loader!css-loader!resolve-url-loader',
            scss: 'vue-style-loader!css-loader!resolve-url-loader!sass-loader', // <style lang="scss">
            sass: 'vue-style-loader!css-loader!resolve-url-loader!sass-loader?indentedSyntax' // <style lang="sass">
          }
        }
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'// 不能在base与prod或dev中同时设置css-loader，否则会出错 : Module build failed: Unknown word
      }, {
        test: /\.less$/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      }, {
        test: /\.s[a|c]ss$/,
        loader: 'style-loader!css-loader!sass-loader'
      }]
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map',
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js',
      'vuex': 'vuex/dist/vuex.js',
      'src': path.resolve(__dirname, '../src'),
      'assets': path.resolve(__dirname, '../src/assets'),
      'pages': path.resolve(__dirname, '../src/pages'),
      'public': path.resolve(__dirname, '../src/pages/components'),
      'api': path.resolve(__dirname, '../src/api/index.js'),
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    new FriendlyErrors(),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/template/index.html',
      inject: true,
    })
  ]
})
