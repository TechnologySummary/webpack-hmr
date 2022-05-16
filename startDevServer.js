const webpack = require('webpack')
const config = require('./webpack.config')
const Server = require('./webpack-dev-server/lib/Server')

// 启动dev server
function startDevServer(compiler, config) {
  const serverArgs = config.devServer || {}

  // server需要compiler和devServer这个配置项
  const server = new Server(compiler, serverArgs)

  const { host = 'localhost', port = 8080 } = serverArgs

  server.listen(port, host, (err) => {
    console.log(`Project is running at http://${host}:${port}/`)
  })
}

// 1. 获取compiler
const compiler = webpack(config)

// 2. 启动devserver，传入compiler和webpack配置
startDevServer(compiler, config)

module.exports = startDevServer
