const path = require('path');
const webpack = require('webpack');
const MiniCssPlugin = require('mini-css-extract-plugin');

const WebpackMerge = require('webpack-merge');
const BaseConfig = require('./webpack.config.base');

let config = WebpackMerge(BaseConfig, {
  target: 'node',
  mode: 'development',
  devtool: 'source-map',
  entry: path.join(__dirname, '../practice/index.js'),
  module: {
    rules: [
      {
        test: /\.(styl|stylus)$/,
        use: [
          {
            loader: MiniCssPlugin.loader,
            options: {
              minimize: true
            }
          },
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
});

module.exports = config;
