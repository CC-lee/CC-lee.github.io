var ExtractTextPlugin = require('extract-text-webpack-plugin')
var styleCSS = new ExtractTextPlugin('static/css/style.[contenthash:7].css')
var loaders = {}
if (process.env.NODE_ENV === 'production') {
  loaders = {
    css: styleCSS.extract({ fallback: 'vue-style-loader', use: 'css-loader' }),
    less: styleCSS.extract({ fallback: 'vue-style-loader', use: 'css-loader!less-loader' }),
    scss: styleCSS.extract({ fallback: 'vue-style-loader', use: 'css-loader!sass' })
  }
} else {
  loaders = {
    css: 'vue-style-loader!css-loader!postcss-loader',
    less: 'vue-style-loader!css-loader!postcss-loader!less-loader',
    scss: 'vue-style-loader!css-loader!sass-loader'
  }
}
module.exports = {
  loaders: loaders
}
