const path = require('path');
const webpack = require('webpack');
// eslint-disable-next-line
const {VueLoaderPlugin} = require('vue-loader');
const HTMLPlugin = require('html-webpack-plugin');

const WebpackMerge = require('webpack-merge');
const BaseConfig = require('./webpack.config.base');

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"development"'
    }
  }),
  new VueLoaderPlugin(),
  new HTMLPlugin({
    template: path.join(__dirname, '../practice/template.html')
  })
];

let config = WebpackMerge(BaseConfig, {
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  entry: path.join(__dirname, '../practice/index.js'),
  module: {
    rules: [
      {
        test: /\.(styl|stylus)$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'postcss-loader',
          'stylus-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      'vue': path.join(__dirname, '../node_modules/vue/dist/vue.esm.js')
    }
  },
  devServer: {
    port: 8088,
    host: '0.0.0.0',
    overlay: {
      errors: true
    },
    // 启动热加载功能
    hot: true
  },
  plugins: defaultPlugins.concat([
    new webpack.HotModuleReplacementPlugin()
  ])
});

module.exports = config;
