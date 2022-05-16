const MemoryFileSystem = require('memory-fs')
const middleware = require('./middleware')

const memoryFileSystem = new MemoryFileSystem()

/**
 * webpack开发中间件
 * 1. 以监听的模式真正的启动webpack compiler进行编译
 * 2. 返回一个express中间件，用于预览产出的资源文件
 */
function webpackDevMiddleware(compiler) {
  // 以监听的模式真正的启动webpack compiler进行编译
  compiler.watch({}, () => {
    console.log(' new  compile')
  })
  // 产出的文件并不是写到硬盘里，为提高性能，产生的文件被放入内存中，因此没法在硬盘看到
  // webpack使用memoryFileSystem来将文件写入内存
  const fs = (compiler.outputFileSystem = require('fs'))

  return middleware({
    fs,
    outputPath: compiler.options.output.path
  })
}

module.exports = webpackDevMiddleware
