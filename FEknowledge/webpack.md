# webpack

## 什么是webpack

webpack 的核心是用于现代 JavaScript 应用程序的**静态模块打包器**。 当 webpack 处理您的应用程序时，它会在内部构建一个**依赖关系图**，该图映射项目所需的每个模块并**生成一个或多个包**

## 核心概念

### Entry

入口起点(entry point)指示 webpack 应该使用哪个模块,来作为构建其内部依赖图的开始

### Output

输出

### Module

模块，在 Webpack 里一切皆模块,一个模块对应着一个文件。

### Chunk

代码块,一个 Chunk 由多个模块组合而成,用于代码合并与分割

### Loader

模块转换器，将所有类型的文件转换为 webpack 能够处理的有效模块,运行时机，Loader运行在打包文件之前

### Plugin

扩展插件，插件的范围包括,从打包优化和压缩,一直到重新定义环境中的变量，plugin在整个编译周期都起作用

## webpack工作流程

![71b263000fa](D:\图片\71b263000fa.jpg)

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数,得出最终的参数
2. 开始编译：用参数初始化Compiler对象，加载所有所有配置插件，执行Compiler对象的run方法开始编译
3. 确定入口： 根据entry找出所有入口文件
4. 编译模块：调用配置loader对模块进行翻译转换
5. 遍历 AST，收集依赖：对 模块进行转换后，再解析出当前 模块依赖的 模块
6. 输出资源：根据入口和模块之间的依赖关系,组装成一个个包含多个模块的 Chunk，再把所有 Chunk 转换成文件输出

### Webpack配置

```js
//webpack.config.js
const path = require("path");
module.exports = {
    mode:'development', // 开发模式
    entry: { //入口
      main:path.resolve(__dirname,'../src/main.js'),
  	}, 
    output: { //出口
      filename: '[name].[hash:8].js',      // 打包后的文件名称
      path: path.resolve(__dirname,'../dist')  // 打包后的目录
    },
    module:{ //配置loader
      rules:[
        {
          test:/\.css$/,
          use:['style-loader','css-loader']  // 从右向左解析原则
        },
        {
          test:/\.less$/,
          use:['style-loader','css-loader','less-loader']  // 从右向左解析原则
        }
      ]
    }
    plugins:[ //插件
    ]
}
```

## Loader工作流程

`loader`从本质上来说其实就是一个`node`模块，根据我们设置的规则，经过它的一系列加工后还给我们加工好code

工作流程：

1. webpack.config.js 里配置了一个 模块 的 Loader；
2. 遇到 相应模块 文件时，触发了 该模块的 loader;
3. loader 接受了一个表示该 模块 文件内容的 source;
4. loader 使用 webapck 提供的一系列 api 对 source 进行转换，得到一个 result;
5. 将 result 返回或者传递给下一个 Loader，直到处理完毕。

原则：

- 单一原则: 每个 `Loader` 只做一件事；
- 链式调用: `Webpack` 会按顺序链式调用每个 `Loader`；
- 统一原则: 遵循 `Webpack` 制定的设计规则和结构，输入与输出均为字符串，各个 `Loader` 完全独立

Loader编写

```js
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default
const t = require('@babel/types')
module.exports = function(source) {
  // source 为 compiler 传递给 Loader 的一个文件的原内容
  // 该函数需要返回处理后的内容，这里简单起见，直接把原内容返回了，相当于该 Loader 没有做任何转换
    
  // 关闭该 Loader 的缓存功能
  this.cacheable(false);
  const ast = parser.parse(source,{ sourceType: 'module'})
  traverse(ast,{
    CallExpression(path){ 
      if(t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.object, {name: "console"})){
        path.remove()
      }
    }
  })
  const output = generator(ast, {}, source);
  return output.code
};
```

## Plugin

`plugin`则是针对整个流程执行广泛的任务。

webpack 在编译过代码程中，会触发一系列 钩子事件，插件所做的，Plugin 可以监听这些事，当 webpack 构建的时候，通过 Webpack 提供的 API 改变输出结果

### plugin插件结构

```js
class firstPlugin {
  constructor (options) {
    console.log('firstPlugin options', options)
  }
  apply (compiler) {
    compiler.plugin('done', compilation => {
      console.log('firstPlugin')
      compilation.hooks.someHook.tap(...)
    ))
  }
}

module.exports = firstPlugin
```

Webpack 启动后,在读取配置的过程会初始化插件实例。在初始化 compiler 对象后，再调用插件的apply方法，给插件实例传入 compiler 对象

插件实例在获取到 compiler 对象后，就可以通过 `compiler.plugin(事件名称, 回调函数)` 监听到webpack的钩子事件

- emit 事件发生时，可以读取到最终输出的资源、代码块、模块及其依赖，并进行修改(emit 事件是修改 Webpack 输出资源的最后时机)
- watch-run 当依赖的文件发生变化时会触发

### compiler和compilation

- Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例
- Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。在构建的过程中，每次构建都会产生一次`Compilation，Compilation` 则是构建周期的产物。`Compilation` 是通过 `Compiler`创建的实例

- compiler 暴露了和 Webpack 整个生命周期相关的钩子
- compilation 暴露了与模块和依赖有关的粒度更小的事件钩子

Compiler 和 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只是代表了一次新的编译。

## devServer

devServer: 开发服务器，用来自动化 （自动编译， 自动打开浏览器， 热部署）

特点： 只会在内存中编译打包，不会有任何输出

启动devServe指令为： webpack-dev-server

HMR： hot modul replacement 热模块替换

样式文件： 可以使用HMR功能

js文件： 默认不能使用HMR功能

html文件： 默认不能使用HMR功能

```js
devServer: {
	contentBase: resolve(__dirname, 'build') // 需要运行的目录
    compress: true, //启动gzip压缩
    port: 300, // 端口号
    open: true //自动打开浏览器
    hot: true //热部署  HMR
}
```



## 常见配置

打包HTML: 插件html-webpack-plugin

```
npm i html-webpack-plugin --save-dev
```

配置：

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html")
    })
  ]
};
```

清除打包文件夹： clean-webpack-plugin

```js
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
    plugins:[new CleanWebpackPlugin()]
}
```

引用css: style-loader  /  css-loader  /  less-loader

```
npm i -D style-loader css-loader
```

```
module.exports = {
    module:{
      rules:[
        {
          test:/\.css$/,
          use:['style-loader','css-loader'] // 从右向左解析原则
        },
        {
          test:/\.less$/,
          use:['style-loader','css-loader','less-loader'] // 从右向左解析原则
        }
      ]
    }
} 
```

拆分css: mini-css-extract-plugin插件

```
npm i -D mini-css-extract-plugin
```

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  //...省略其他配置
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
           MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ],
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: "[name].[hash].css",
        chunkFilename: "[id].css",
    })
  ]
}
```

打包图片、字体、媒体等文件：

`file-loader`就是将文件在进行一些处理后（主要是处理文件名和路径、解析文件url），并将文件移动到输出的目录中

`url-loader` 一般与`file-loader`搭配使用，功能与 file-loader 类似，如果文件小于限制的大小。

```js
module.exports = {
  // 省略其它配置 ...
  module: {
    rules: [
      // ...
      {
        test: /\.(jpe?g|png|gif)$/i, //图片文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, //媒体文件
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'media/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[hash:8].[ext]'
                }
              }
            }
          }
        ]
      },
    ]
  }
}
```

转义js文件：是js代码更兼容 babel-loader 、@babel/preset-env、 @babel/core

```
npm i -D babel-loader @babel/preset-env @babel/core
```

```js
// webpack.config.js
module.exports = {
    module:{
        rules:[
          {
            test:/\.js$/,
            use:{
              loader:'babel-loader', // 将 ES6/7/8语法转换为ES5语法，但是对新api并不会转换 例如(promise、Generator、Set、Maps、Proxy等)
              options:{
                presets:['@babel/preset-env']
              }
            },
            exclude:/node_modules/
          },
       ]
    }
}
```

将 ES6/7/8 api(promise、Generator、Set、Maps、Proxy)转换为ES5语法: @babel/polyfill

```
npm i @babel/polyfill
```

```
// webpack.config.js
const path = require('path')
module.exports = {
    entry: ["@babel/polyfill",path.resolve(__dirname,'../src/index.js')],    // 入口文件
}
```

解析.vue文件：

`vue-loader` 用于解析`.vue`文件
`vue-template-compiler` 用于编译模板 配置如下

```
npm i -D vue-loader vue-template-compiler vue-style-loader
npm i -S vue
```

```js
const vueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    module:{
        rules:[{
            test:/\.vue$/,
            use:['vue-loader']
        },]
     },
    resolve:{
        alias:{
          'vue$':'vue/dist/vue.runtime.esm.js',
          ' @':path.resolve(__dirname,'../src')
        },
        extensions:['*','.js','.json','.vue']
   },
   plugins:[
        new vueLoaderPlugin()
   ]
}
```

配置热更新： webpack-dev-server

```
npm i -D webpack-dev-server
```

```js
const Webpack = require('webpack')
module.exports = {
  // ...省略其他配置
  devServer:{
    port:3000,
    hot:true,
    contentBase:'../dist'
  },
  plugins:[
    new Webpack.HotModuleReplacementPlugin()
  ]
}
```



## 优化
