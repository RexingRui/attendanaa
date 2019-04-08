var webpack = require('webpack')
module.exports = {
  devServer: {
    open: true,
    // proxy: {
    //   "/api": {
    //     target: "http://loacalhost:8080",
    //     changeOrigin: true,
    //     pathRewrite: {"^/api": ""}
    //   }
    // }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
      })
    ]
  },
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

};