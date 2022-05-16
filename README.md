1.
```json
"configurations": [
    {
      "name": "Launch via NPM",
      "request": "launch",
      "runtimeArgs": [
        "run-script",
        "debug"
      ],
      "runtimeExecutable": "npm", // 通过npm执行runtimeArgs中指定的脚本
      "skipFiles": [
        "<node_internals>/**"
      ],
      "type": "node"
    }
  ]
```

2. require.resolve和path.resolve

path.resolve是从当前路径出发，得到一个绝对路径，比如path.resolve(webpack)
require.resolve是解析模块路径，会去node_moduels找，比如require.resolve(webpack)

如果两个都写成相对路径，效果一样
path.resolve('./webpack') === require.resolve('./webpack')