# 开始

TIME：2019-2-20

真是好长时间没有认真学习了，是时候步入正轨、努力学习了。

那么，就从今天开始吧。

# 项目初始化

```javascript
// 项目初始化
npm init

// 安装项目依赖
cnpm install vue vue-loader css-loader vue-template-compiler --save
// 安装开发时依赖
cnmp install webpack webpack-cli --save-dev
```

# 项目入口

新建`src/index.js`文件：

```js
import Vue from 'vue';
import app from 'src/app.vue';

// 创建虚拟节点
const root = document.createElement('div');
document.body.appendChild(root);

// 创建vue对象,并挂载到root节点
// h:createApp
new Vue({
    render: h => h(app)
}).$mount(root);
```

# webpack配置

```js
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [ 
            
            // 处理vue文件的loader
            { 
				test: /\.vue$/,
				loader: 'vue-loader'
			},
            
            // 处理styl样式的loader
            {
                test: /\.(styl|stylus)$/,
                use: {
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                }
            },            
            
            // 处理各类图片的文件
            // url-loader: 当图片小于1024字节时，会将图片转换成base64编码，打包进js文件中
            { 
                test:/\.(jpg|jpeg|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        option: {
                            limit: 1024,
                            name: '[name].[ext]'
                        }
                    }
                ]                
            }
        ]
    },
    // 处理vue文件必须添加的一个内容，不然会报错
    plugins: [
		new VueLoaderPlugin(),
	],
}

```

# 设置环境变量

用于区分是开发环境还是生产环境。之所以使用`cross-env`这个模块，是因为需要对`windows`和`苹果`这两个平台做兼容处理，使用这个模块可以方便我们使用。

```js
cnpm install cross-env --save-dev
```

在`package.json`文件中：

```json
"build": "cross-env NODE_ENV=production webpack --config webpack.config.js"
"dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"
```

启动脚本后，这些变量存储在`process.env`这个变量下，那么在`webpack.config.js`文件中，我们就能通过这个变量去区分是否为开发环境。

```js
const isDev = process.env.NODE_ENV === 'production';

if(isDev) {
    // 添加一些别的配置项
}
```

# devServer配置

在开发模式下，我们需要启动一个静态服务器。用于访问本地的静态资源。

安装：

```js
cnpm install webpack-dev-server --save-dev
```

配置：

```js
if (isDev) {
    // 使用source-map 方便调试
	config.devtool = '#cheap-module-eval-source-map';
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
}
```

# 文件入口

服务启动启动起来之后，需要一个入口`html`文件。去加载我们打包生成的`js`文件。

所以我们可以安装一个`html-webpack-plugin`模块：

```js
cnpm install html-webpack-plugin --save-dev
```

**作用：**自动生成一个`HTML`文件，并将打包生成的`js`文件引入，作为项目入口文件。

那么如何简单的使用：

```js
// webpack.config.js

const HTMLPlugin = require('html-webpack-plugin');

plugins: [
   // 当使用vue 和 react框架时，使用的一个插件
   // 作用：区分当前的环境
   new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: isDev ? '"development"' : '"production"'
        }
    }),               
    new HTMLPlugin()
]
```

# postcss-loader配置

如果某些`css`要考虑到浏览器的兼容性(比如`css3`中的`flex`)，我们要`webpack`在打包的过程中自动为这些`css`属性加上浏览器前缀，这时就用到了`postcss-loader`(就是一个平台)和它对应的插件`autoprefixer`。

新建`postcss.config.js`文件：

```js
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        autoprefixer()
    ]
};
```



# CSS线上优化

打包完成，发现`CSS`仍然以`JS`形式在我们的代码里呈现，如何将`CSS`代码拎出来，打包成一个单独的文件？

```js
cnpm install extract-text-webpack-plugin --save-dev
```

这个模块可以帮助我们将非`javascript`代码，打包成一个静态资源文件。

但是在`webpack 4.x`版本使用过程中出现了问题：

* 1.版本不兼容(可以使用`extract-text-webpack-plugin@next`)
* 2.无法使用`hash`值

官方更推荐我们使用：`mini-css-extract-plugin`这个模块，首先安装该模块：

```js
cnpm install mini-css-extract-plugin --save-dev
```

使用，在`webpack.config.js`文件中配置，这个模块会将vue组件中的样式代码也提取出来：

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

if(isDev) {
    // 开发模式下
    // ...
} else {
    config.output.filename = '[name].[chunkhash:8].js';
    // 将css文件单独打包
    config.module.rules.push({
        test: /\.(styl|stylus)/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
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
    
    // 添加插件
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash:8].css'
        })
    )
}
```

# 单独打包类库文件

在`webpack 4.x`版本中，代码分隔打包的方式发生了很大的变化，具体可以使用如下的方式进行打包处理：

```js
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
```

详细的话，有很多的参数：

```js
optimization:{
    splitChunks:{
        chunks:async,//表示显示块的范围，三个可选值：
        //initial(初始块)、async(按需加载块)、all(默认，全部块)

        minSize:0,//表示在分离前的最小模块大小，默认为0，最小为30000

        minChunks:1,//表示分离前被引用次数,默认为1

        maxAsyncRequests:1,//最大按需加载次数，最大异步加载次数，默认1

        maxInitialRequests:1,//最大初始化加载次数，一个入口文件可以并行加载的最大文件数量，默认1

        automaticNameDelimiter: '~',//打包分隔符，若改为'-'则分离后的js默认命名规则为[来源]-[入口key].js

        name: function(){},//打包后的名称，此选项可接受函数，默认true,,由chunk和hash值自动生成，
        //当存在匹配的缓存组时，命名使用缓存组中的name值，若不在则为[来源]~[入口key].js

        cacheGroups:{//设置缓存chunks

            priority: 0,//缓存组优先级
            //当需要优先匹配缓存组的规则时，priority需要设置为正数，当需要优先匹配默认设置时，缓存组需设置为负数，0为两者分割线

            default:{//设置缓存组默认配置，可通过default:false禁用默认缓存组，
            //然后就可以自定义缓存组，将初始化加载时被重复引用的模块进行拆分
                minChunks:2,//引用两次
                priority:-20,//缓存组优先级为-20
                reuseExistingChunk:true,//表示可以使用已经存在的块，即如果满足条件的块已经存在就是用己有的的，不再创建一个新的块
            }，
            [key]:{//自定义缓存组，可以根据需求，自由创建
                chunks:'initial',
                test: /vue/,//正则规则验证，如符合就提取chunk放入当前缓存组，值可以是function、boolean、string、RegExp，默认为空
                enforce: true//优先处理
            }
        }
    }
}
--------------------- 
作者：bubbling_coding 
来源：CSDN 
原文：https://blog.csdn.net/bubbling_coding/article/details/81585412 
版权声明：本文为博主原创文章，转载请附上博文链接！
```





# 三种hash区别

* **hash**

  `hash`是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的`hash`值都会更改，并且全部文件都公用相同的`hash`值。

* **chunkhash**
  使用`hash`计算的话，每次构建都不相同，这样没办法实现缓存效果，我们需要换另一种哈希值计算方式。
`chunkhash`和`hash`不一样，它根据不同的入口文件`(Entry)`进行依赖文件解析、构建对应的`chunk`，生成对应的哈希值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用`chunkhash`的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。

* **contenthash**
`contenthash`是针对文件内容级别的，只有你自己模块的内容变了，那么`hash`值才改变，所以我们可以通过`contenthash`解决上诉问题。

 

# webpack整个配置

```js
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
```





