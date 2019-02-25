const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');

// 判断是否为开发模式
const isDev = process.env.NODE_ENV === 'development';

const config = {
	mode: isDev ? 'development' : 'production',
	entry: path.join(__dirname, 'src/index.js'),
	output: {
		filename: 'bundle.[hash:8].js',
		path: path.join(__dirname, 'dist')
	},
	module: {
		rules: [{ // 处理vue文件的loader
			test: /\.vue$/,
			loader: 'vue-loader'
		},
			{ //  处理图片资源
				test: /\.(jpg|jpeg|svg|png|gif)$/,
				use: [{
					loader: 'url-loader',
					options: {
						limit: 1024,
						name: '[name].[ext]'
					}
				}]
			}
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: isDev ? '"development"' : '"production"'
			}
		}),
		new VueLoaderPlugin(),
		new HTMLPlugin()
	]
};

if (isDev) {
	config.devtool = '#cheap-module-eval-source-map';
	// 处理stylus样式文件的loader
	config.module.rules.push({
		test: /\.(styl|stylus)$/,
		use: [
			'style-loader',
			'css-loader',
			{
				loader: 'postcss-loader',
				options: {
					sourceMap: true
				}
			},
			'stylus-loader'
		]
	});
	config.devServer = {
		port: 8000,
		host: '0.0.0.0',
		overlay: {
			errors: true
		},
		// 启动热加载功能
		hot: true
	};
	config.plugins.push(
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	);
} else {
	// 线上环境
	config.output.filename = '[name].[chunkhash:8].js';
	config.module.rules.push({
		test: /\.(styl|stylus)$/,
		use: [
			{
				loader: MiniCssPlugin.loader,
				options: {
					minimize: true
				}
			},
			'css-loader',
			{
				loader: 'postcss-loader',
				options: {
					sourceMap: true
				}
			},
			'stylus-loader'
		]
	});

	config.entry = {
		app: path.join(__dirname, 'src/index.js'),
		vendor: ['vue']
	};
	config.optimization = {
		splitChunks: {
			name: 'vendor',
			chunks: 'all'
		}
	};

	config.plugins.push(
		new MiniCssPlugin({
			filename: 'style.[contenthash:8].css'
		})
	);
}

module.exports = config;