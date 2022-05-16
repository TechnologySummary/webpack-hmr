// 插入两个新入口，更新webpack打包入口
function updateCompiler(compiler) {
  const options = compiler.options
  /* webpack5
   * entry: {
   *   main:{
   *     import: [
   *       'webpack-dev-server/client/index.js',
   *       'webpack/hot/dev-server.js',
   *       './src/index.js'
   *     ]
   *   }
   * }
   */
  // 所以要main.import，从头部加入两个新入口
  // 1. 以下入口来自于webpack-dev-server/client/index.js，就是浏览器中的websocket客户端
  options.entry.main.import.unshift(require.resolve('../../client/index.js'))
  // 2. 以下入口来自于webpack/hot/dev-server.js，它的作用是在浏览器中监听发射的事件，进行后续的热更新逻辑
  options.entry.main.import.unshift(require.resolve('../../../webpack/hot/dev-server.js'))
  compiler.hooks.entryOption.call(options.context, options.entry)
}
/**
 * webpack4
 * entry: {
 *   main:['./src/index.js']
 * }
 *
 * webpack5
 * entry: {
 *   main:{
 *     import: ['./src/index.js']
 *   }
 * }
 */

module.exports = updateCompiler
