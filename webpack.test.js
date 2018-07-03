const path = require("path")
const webpack = require("webpack")
const copyWebpackPlugin = require("copy-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/test.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "build.js",
    chunkFilename: "[name].js?[hash]"
  },
  plugins:[
    new HtmlWebpackPlugin({
      hash: true,
      template: "src/test1.html"
    }),
  ],
  devServer: {
    quiet: false,
    stats: { colors: true },
    port: 7070,
    open:true,
    contentBase: path.join(__dirname, "src"),
    proxy: {
      "/validateAndCacheCardInfo.json": {
        target: "https://ccdcapi.alipay.com/validateAndCacheCardInfo.json",
        // ignorePath: true,
        changeOrigin: true,
        pathRewrite: {"^/validateAndCacheCardInfo.json" : ""},
        secure: false,
        logLevel: "debug",
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf("html") !== -1) {
            console.log("Skipping proxy for browser request.");
            return "/test1.html";
          }
        }
      }
    }
  }
}

