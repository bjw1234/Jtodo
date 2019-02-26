const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');

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
	new HTMLPlugin()
];

let config = null;

if (isDev) {
	config = WebpackMerge(BaseConfig, {
		mode: 'development',
		devtool: '#cheap-module-eval-source-map',
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
			// 启动热加载功能
			hot: true
		},
		plugins: defaultPlugins.concat([
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoEmitOnErrorsPlugin()
		])
	});
} else {
	config = WebpackMerge(BaseConfig, {
		mode: 'production',
		entry: {
			app: path.join(__dirname, '../src/index.js'),
			vendor: ['vue']
		},
		output: {
			filename: '[name].[chunkhash:8].js'
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
			}
		},
		plugins: defaultPlugins.concat([
			new MiniCssPlugin({
				filename: 'style.[contenthash:8].css'
			})
		])
	});
}

module.exports = config;