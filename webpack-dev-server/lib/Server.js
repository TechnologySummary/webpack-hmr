const express = require('express')
const http = require('http')
const io = require('socket.io')
const updateCompiler = require('./utils/updateCompiler')
const webpackDevMiddleware = require('../../webpack-dev-middleware')

module.exports = class Server {
  constructor(compiler, serverArgs) {
    this.sockets = [] // 放着所有跟服务器连接的客户端
    this.compiler = compiler
    this.serverArgs = serverArgs
    updateCompiler(compiler)
    this.setupHooks()
    this.setupApp()
    this.routes()
    this.setupDevMiddleware()
    this.createServer()
    this.createSocketServer()
  }

  createSocketServer() {
    /**
     * 为什么要向里头传入http server？
     * 因为websocket通讯之前，要握手，握手的话用的是HTTP协议，因此需要http服务器
     */
    const websocketServer = io(this.server)
    // 监听客户端连接
    websocketServer.on('connection', (socket) => {
      console.log('一个客户端连接上来了')
      // 将新的客户端添加到数组里，为了编译成功后广播做准备
      this.sockets.push(socket)

      // 监控客户端断开事件
      socket.on('disconnect', () => {
        let index = this.sockets.indexOf(socket)
        this.sockets.splice(index, 1)
      })

      // 如果以前编译过了，把上一次的hash传递给客户端
      if (this._stats) {
        socket.emit('hash', this._stats.hash)
        socket.emit('ok') 
      }
    })
  }

  setupDevMiddleware() {
    // 创建dev-server实例时，在这个地方就进行了compiler.watch立即打包了一次，然后监听变化
    this.middleware = webpackDevMiddleware(this.compiler)
    this.app.use(this.middleware)
  }

  // 开始启动webpack编译
  setupHooks() {
    this.compiler.hooks.done.tap('webpack-dev-server', (stats) => {
      console.log('新的编译完成，hash为 => ', stats.hash)

      this.sockets.forEach((socket) => {
        socket.emit('hash', stats.hash)
        socket.emit('ok')
      })

      this._stats = stats // 保存stats信息
    })
  }

  setupApp() {
    /**
     * express()本身不是一个server，只是一个路由中间件而已
     */
    this.app = express()
  }

  routes() {
    // 如果server配置配了contentBase，就启动静态服务
    if (this.serverArgs.static.directory) {
      this.app.use(express.static(this.serverArgs.static.directory))
    }
  }

  /**
   * 使用express平时写的this.app.listen()实际是调用以下代码
   * var server = http.createServer(this) -> this就是const app = express()这个app，是一个函数
   * server.listen.apply(server, port,host,cb)
   *
   * 所以createServer+listen = this.app.listen()
   * 这里其实是拆开来写了
   */
  createServer() {
    this.server = http.createServer(this.app)
  }

  listen(port, host, cb) {
    this.server.listen(port, host, cb)
  }
}
