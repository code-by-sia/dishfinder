var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module : {
    loaders : [
      { test : /\.jsx?/, include : APP_DIR, loader : 'babel-loader',exclude: /node_modules/},
      { test: /\.css$/, include : APP_DIR, loader: "style-loader!css-loader" },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?{pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
        ]
      }
    ]
  },
  resolve:{
    extensions:['.js','.jsx']
  }
};

module.exports = config;
