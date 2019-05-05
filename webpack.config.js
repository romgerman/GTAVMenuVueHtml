const path = require('path')
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin

module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public/js')
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}