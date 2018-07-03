const path = require("path")
const webpack = require("webpack")
const copyWebpackPlugin = require("copy-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "build.js",
    chunkFilename: "[name].js?[hash]"
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          // vue-loader options go here
          postcss: [
            require("autoprefixer")({
              browsers: ["Android >= 4", "Explorer >= 10", "iOS >= 6"],
              cascade: false
            })
          ]
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        // loader: 'style-loader!css-loader',
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          "less-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: "file-loader"
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: "file-loader",
        query: {
          name: "assets/[name].[ext]?[hash]"
        }
      }
    ]
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue",

      //所有图片引用都以 ~assets 开头，可以再在最后构建时输出到 assets 目录
      assets: path.resolve(__dirname, "./src/assets"),
      tgassets:path.resolve(__dirname,"./src/tgapp/assets"),
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  devtool: "#eval-source-map",
  plugins: [
    new copyWebpackPlugin([
      {
        from: "node_modules/babel-polyfill/dist/polyfill.min.js",
        to: "libs/babel/polyfill.min.js"
      },
      { from: "node_modules/vue/dist/vue.min.js", to: "libs/vue/vue.min.js" },
      // { from: 'node_modules/vue/dist/vue.js', to: 'libs/vue/vue.min.js' },
      {
        from: "node_modules/vue-router/dist/vue-router.min.js",
        to: "libs/vue/vue-router.min.js"
      },
      {
        from: "node_modules/vue-resource/dist/vue-resource.min.js",
        to: "libs/vue/vue-resource.min.js"
      },
      {
        from: "node_modules/vuex/dist/vuex.min.js",
        to: "libs/vue/vuex.min.js"
      },
      {
        from: "node_modules/mint-ui/lib/index.js",
        to: "libs/mint-ui/mint-ui.min.js"
      },
      {
        from: "node_modules/mint-ui/lib/style.min.css",
        to: "libs/mint-ui/mint-ui.min.css"
      },
      { from: "src/util.js", to: "util.js" },
      { from: "src/assets/favicon.ico", to: "favicon.ico" },
      { from: "src/login.html", to: "login.html" },
      // { from: "src/tgapp/login.html", to: "tgapp/login.html" },
      // { from: 'src/assets/sprite.png', to: 'assets/sprite.png' },
      // { from: 'src/assets/sprite.css', to: 'assets/sprite.css' },
      // { from: 'src/assets/404.jpg', to: 'assets/404.jpg' },
    ]),
    new HtmlWebpackPlugin({
      hash: true,
      template: "src/index.html"
    }),
    // new HtmlWebpackPlugin({
    //   hash: true,
    //   inject: true,
    //   template: "src/test.html",
    //   chunks: ["test"]
    // }),
    new CleanWebpackPlugin(["dist"], {
      root: __dirname,
      verbose: true,
      dry: false
    })
  ],
  externals: {
    vue: "Vue",
    "vue-router": "VueRouter",
    vuex: "Vuex",
    "mint-ui": "MINT"
  },
  devServer: {
    quiet: false,
    stats: { colors: true },
    port: 80,
    contentBase: path.join(__dirname, "src/tgapp"),
    proxy: {
      "/sys": {
        target: "http://dev.op110.com.cn/",
        pathRewrite: {
          "^/sys": "/sys"
        },
        // ignorePath: true,
        changeOrigin: true,
        secure: false,
        logLevel: "debug"
      }
    }
  }
}

if (process.env.NODE_ENV === "production") {
  module.exports.devtool = "#source-map"
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"',
        APP_HOST: '""'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
if (process.env.NODE_ENV === "development") {
  module.exports.devtool = "#source-map"
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"development"'
        // APP_HOST: '"http://dev.op110.com.cn"',
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
