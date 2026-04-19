const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  // Set to '/bostonrentals/' if hosted at username.github.io/bostonrentals/
  // Set to '/' if hosted at the root of a custom domain or separate repo
  publicPath: process.env.NODE_ENV === 'production' ? '/bostonrentals/' : '/',
  transpileDependencies: [],
  css: {
    loaderOptions: {
      sass: { api: 'modern' },
      scss: { api: 'modern' },
    },
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        ws: true, 
        changeOrigin: true,
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false)
      })
    ]
  }
});