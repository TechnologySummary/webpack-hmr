const HtmlWebpackPlugin = require('html-webpack-plugin')
const HotReplaceModulePlugin = require('webpack').HotModuleReplacementPlugin
const path = require('path')

module.exports = {
  mode: 'development',
  devtool: false,
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    hot: true,
    static: {
      directory: path.join(__dirname, 'static')
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    })
    // new HotReplaceModulePlugin()
  ]
}
