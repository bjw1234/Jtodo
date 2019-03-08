const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');
// 帮助我们生成 vue-ssr-client-manifest.json 文件
const VueClientPlugin = require('vue-server-renderer/client-plugin');

const WebpackMerge = require('webpack-merge');
const BaseConfig = require('./webpack.config.base');

// 判断是否为开发模式
const isDev = process.env.NODE_ENV === 'development';

const defaultPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new VueLoaderPlugin(),
  new HTMLPlugin({
    template: path.join(__dirname, '../src/template.html')
  }),
  new VueClientPlugin()
];

let config = null;

if (isDev) {
  config = WebpackMerge(BaseConfig, {
    mode: 'development',
    devtool: '#cheap-module-eval-source-map',
    output: {
      publicPath: 'http://127.0.0.1:8000/public/'
    },
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
    devServer: {
      port: 8000,
      host: '0.0.0.0',
      overlay: {
        errors: true
      },
      headers: { 'Access-Control-Allow-Origin': '*' },
      publicPath: '/public/',
      historyApiFallback: {
        index: '/public/index.html'
      },
      // 启动热加载功能
      hot: true,
      proxy: {
        '/api': 'http://localhost:3333',
        '/user': 'http://localhost:3333'
      }
    },
    plugins: defaultPlugins.concat([
      new webpack.HotModuleReplacementPlugin()
    ])
  });
} else {
  config = WebpackMerge(BaseConfig, {
    mode: 'production',
    entry: {
      app: path.join(__dirname, '../src/client-entry.js')
    },
    output: {
      filename: '[name].[chunkhash:8].js',
      publicPath: '/dist/'
    },
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
    optimization: {
      splitChunks: {
        name: 'vendor',
        chunks: 'all'
      },
      runtimeChunk: true
    },
    plugins: defaultPlugins.concat([
      new MiniCssPlugin({
        filename: 'style.[contenthash:8].css'
      })
    ])
  });
}

// 客户端model和服务器端不一样
config.resolve = {
  alias: {
    'model': path.join(__dirname, '../src/model/client-model.js')
  }
};

module.exports = config;
