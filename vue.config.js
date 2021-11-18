const path = require('path');//引入path模块
module.exports = {
    pages: {
      index: {
        entry: 'examples/main.js',
        template: 'public/index.html',
        filename: 'index.html'
      }
    },
    // 扩展 webpack 配置，使 packages 加入编译
    chainWebpack: config => {
      config.module
        .rule('js')
        .include
          .add('/packages')
          .end()
        .use('babel')
          .loader('babel-loader')
        config.resolve.alias
        .set("desigin-ui", path.resolve("package"))
        // .set("common", path.resolve("package"))
    },
    // resolve: {
    //   "desigin-ui": resolve("package"),
    //   "examples": resolve("examples"),
    //   // "desigin-ui": path.resolve("")
    // }
  }