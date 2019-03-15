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
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

};