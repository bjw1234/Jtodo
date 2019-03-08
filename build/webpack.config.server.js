const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssPlugin = require('mini-css-extract-plugin');

const WebpackMerge = require('webpack-merge');
const BaseConfig = require('./webpack.config.base');
const VueServerPlugin = require('vue-server-renderer/server-plugin');

let config = WebpackMerge(BaseConfig, {
  mode: 'development',
  target: 'node',
  devtool: 'source-map',
  entry: path.join(__dirname, '../src/server-entry.js'),
  output: {
    libraryTarget: 'commonjs2',
    filename: 'server-bundle.js',
    path: path.join(__dirname, '../server-build')
  },
  externals: Object.keys(require('../package.json').dependencies),
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
    new MiniCssPlugin({
      filename: 'server-style.css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueLoaderPlugin(),
    new VueServerPlugin()
  ]
});

config.resolve = {
  alias: {
    'model': path.join(__dirname, '../src/model/server-model.js')
  }
};

module.exports = config;
