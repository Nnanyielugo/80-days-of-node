const webpack = require('webpack');
const path = require('path');
const config = require('config');
const merge = require('webpack-merge');

const common = require('./common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  node: {
    fs: 'empty',
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      // double stringify because node-config expects this to be a string
      'process.env.NODE_CONFIG': JSON.stringify(JSON.stringify(config)),
    }),
  ],
  output: {
    filename: 'client.min.js',
    path: path.resolve(__dirname, '../public'),
  },
  devServer: {
    contentBase: path.join(__dirname, '../public'),
  },
});
