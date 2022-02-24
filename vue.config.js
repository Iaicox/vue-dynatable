module.exports = {
  filenameHashing: false,

  chainWebpack: config => {
    config.module
      .rule('images')
      .set('parser', {
        dataUrlCondition: {
          maxSize: 4 * 1024 // 4KiB
        }
      })
  },

  publicPath: process.env.NODE_ENV === 'production'
      ? '/'
      : '/vue-dynatable/',
  outputDir: process.env.NODE_ENV === 'production'
      ? __dirname+'/lib'
      : __dirname+'/demo',
  productionSourceMap: false
}