const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  filenameHashing: false,
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: 'src/assets/icons/build.js',
            to: 'img/index.js',
            toType: 'file',
          }
        ],
      })
    ]
  },


  chainWebpack: config => {
    // config.module
    //   .rule('images')
    //   .set('parser', {
    //     dataUrlCondition: {
    //       maxSize: 4 * 1024 // 4KiB
    //     }
    //   })
  },

  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-dynatable/'
    : '/',
  outputDir: process.env.NODE_ENV === 'production'
    ? __dirname+'/lib'
    : __dirname+'/demo',
  productionSourceMap: false
}