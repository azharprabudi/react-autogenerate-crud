const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.js"
  },
  output: {
    path: path.join(__dirname, "dist/"),
    filename: "[name].bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: ["env", "stage-2", "react"]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  },
  devServer: {
    port: 3000,
    hot: true,
    noInfo: false
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: "./src/index.html"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
