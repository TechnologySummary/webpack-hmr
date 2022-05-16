const path = require('path')
const mime = require('mime')

function wrapper({ fs, outputPath }) {
  // 这个中间件，负责产出文件的预览
  // 具体工作就是：拦截HTTP请求，看看请求的文件，是不是webpack打包出来的文件
  // 如果是的话从硬盘读出文件，然后返回给客户端
  return (req, res, next) => {
    const url = req.url // 浏览器输入 http://localhost:9000/main.js,那么url就是/main.js
    if (url === '/') url = '/index.html'
    // 而outputPath是webpack.config.js中配置的,就是xxx/project/dist
    // 两者拼接在一块就是xxx/project/dist/main.js，也即是webpack打包出来的dist当中的文件
    const filename = path.join(outputPath, url)
    try {
      let stat = fs.statSync(filename)
      if (stat.isFile()) {
        let content = fs.readFileSync(filename)
        console.log('mimi', mime.getType(filename))
        res.setHeader('Content-Type', mime.getType(filename))
        res.send(content)
      } else {
        res.sendStatus(404)
      }
    } catch (err) {
      res.sendStatus(404)
    }
  }
}

module.exports = wrapper
