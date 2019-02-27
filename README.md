# 开始

TIME：2019-2-20

NAME: Jtodo



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
                            // 静态资源可以单独设置其目录结构
                            // name: 'resources/[path][name].[hash:8].[ext]'
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

**作用：** 自动生成一个`HTML`文件，并将打包生成的`js`文件引入，作为项目入口文件。

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

# babel配置

> webpack 4.x | babel-loader 8.x | babel 7.x

```bash
npm install -D babel-loader @babel/core @babel/preset-env
```

> webpack 4.x | babel-loader 7.x | babel 6.x

```bash
npm install -D babel-loader@7 babel-core babel-preset-env
```

作用：

* **babel-loader：**  作为`webpack`的`loader`的一种，实现对指定文件类型的处理。
* **babel-core：** 为`babel-loader`提供一系列的`api`。
* **babel-preset-env：** 告诉`babel`使用哪种转码规则进行文件处理。



使用方法：

```js
rules: [
        {
            test: /\.js$/,
            exclude: path.join(__dirname, 'node_modules'),
            include: path.join(__dirname, 'src'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env']
                }
            }
        },
  ]
```

还是有一个让我疑惑的点：`loader`配置在`webpack.config.base.js`文件中，而该文件在`build`目录下，按理来说包含的路径应该是`path.join(__dirname, '../src')`这样的。然而，这样的配置会出错，只有上面的这种配置才会正确运行。

# postcss-loader配置

如果某些`css`要考虑到浏览器的兼容性(比如`css3`中的`flex`)，我们要`webpack`在打包的过程中自动为这些`css`属性加上浏览器前缀，这时就用到了`postcss-loader`(就是一个平台)和它对应的插件`autoprefixer`。

新建`postcss.config.js`文件：

```js
const autoprefixer = require('autoprefixer');

// 必须设置支持的浏览器，才会添加前缀，否则不会生效
module.exports = {
	plugins: [
		autoprefixer({
			'browsers': [
				'defaults',
				'not ie < 11',
				'last 2 versions',
				'> 1%',
				'iOS 7',
				'last 3 iOS versions'
			]
		})
	]
};
```

然后就是在配置文件中加上`postcss-loader`就可以了：

```js
rules: [
            {
                test: /\.(styl|stylus)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'stylus-loader'
                ]
            }
        ]
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
            'postcss-loader',
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
		app: path.join(__dirname, 'src/index.js')
	};
	config.optimization = {
		splitChunks: {
			name: 'vendor',
			chunks: 'all'
		},
        runtimeChunk: true
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
```



# 三种hash区别

* **hash**

  `hash`是跟整个项目的构建相关，只要项目里有文件更改，整个项目构建的`hash`值都会更改，并且全部文件都公用相同的`hash`值。

* **chunkhash**
  使用`hash`计算的话，每次构建都不相同，这样没办法实现缓存效果，我们需要换另一种哈希值计算方式。
`chunkhash`和`hash`不一样，它根据不同的入口文件`(Entry)`进行依赖文件解析、构建对应的`chunk`，生成对应的哈希值。我们在生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用`chunkhash`的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。

* **contenthash**
`contenthash`是针对文件内容级别的，只有你自己模块的内容变了，那么`hash`值才改变，所以我们可以通过`contenthash`解决上诉问题。



# 拆分配置文件

使用`webpack-merge`可以拆分将配置文件拆分为：`webpack.config.base.js`和`webpack.config.client.js`这两个文件。具体操作：

```bash
cnpm install webpack-merge --save-dev
```

然后就可以在配置文件中使用：

```js
const merge = require('webpack-merge');
// 导入基础配置
const baseConfig = require('./webpack.config.base');

let config = null;
if(isDev) {
    config = merge(baseConfig, {
        // development配置
    })
} else {
    config = merge(baseConfig, {
        // production配置
    })
}
```

# 优化目录结构

为了使我们的代码更加清晰，合理的目录结构必不可少。以下，就是此次项目的目录结构：

![kIaBWQ.png](https://s2.ax1x.com/2019/02/26/kIaBWQ.png)



# 自动删除目录

当每次去`build`工程的时候，都要先手动删除`dist`目录，有没有什么办法 ，让工具帮助我们做这个事情呢？

首先，需要安装一个`rimraf`的模块：

```bash
cnpm install rimraf --save-dev
```

在`package.json`中去使用：

```json
"build:client": "cross-env NODE_ENV=production webpack --config build/webpack.config.client.js",
"clean":"rimraf dist",
"build":"npm run clean && npm run build:client",
```

# vue中Eslint代码检查

安装`eslint`，并继承`standard`规则：

```bash
cnpm i eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node -D
```

在`package.json`文件中使用：

```json
"lint": "eslint --ext .js --ext .vue src/",
"lint-fix": "eslint --fix --ext .js --ext .vue src/",
```

这样一来就可以使用`npm run lint`检查代码，使用`lint-fix`来修复代码。

如果希望每次修改代码，`eslint`都可以帮我们检查，那么还需要几个模块：

```bash
cnpm i eslint-loader babel-loader -D
```

新建`.eslintrc`文件：

```js
{
  "extends": [
    // 继承标准规则
    "standard",
    "plugin:vue/recommended"
  ],
  "plugins": [
    "import",
    "html"
  ],
  // 因为使用了babel对代码进行了编译
  "parserOptions": {
    "parser": "babel-eslint"
  },
   // 自定义规则
  "rules": {
    "semi": "off",
    "indent": "off",
    "vue/script-indent": "off",
    "vue/html-self-closing": "off"
  }
}
```

在`webpack.config.base.js`的`rules`中添加配置，对以`vue`或`js`结尾的文件进行`eslint`预处理：

```js
rules: [
    {
        test: /\.(vue|js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        enforce: 'pre'
      },
]
```

# editorconfig配置

新建`.editorconfig`文件：

```js
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
```

# git提交前代码检查

我们不希望将风格有问题的代码提交到`git`仓库中，那么怎样避免这个事情呢？

需要一个简单的`npm`包来帮助我们做这个事情，注意在安装这个包之前，必须先进行`git init`。原因是`husky`安装后，会在`.git`文件中添加`githook`，如果没有这个目录，添加就会不成功，那么这个功能就无法使用了。

```bash
cnpm i husky -D
```

然后在`package.json`中添加配置：

```json
"lint": "eslint --ext .js --ext .vue src/",
"precommit": "npm run lint"
```

在代码提交前去使用`eslint`检查，如果不合格则会直接退出进程，不会将代码提交到`git`仓库中。

























