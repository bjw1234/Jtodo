# ��ʼ

TIME��2019-2-20

���Ǻó�ʱ��û������ѧϰ�ˣ���ʱ�������졢Ŭ��ѧϰ�ˡ�

��ô���ʹӽ��쿪ʼ�ɡ�

# ��Ŀ��ʼ��

```javascript
// ��Ŀ��ʼ��
npm init

// ��װ��Ŀ����
cnpm install vue vue-loader css-loader vue-template-compiler --save
// ��װ����ʱ����
cnmp install webpack webpack-cli --save-dev
```

# ��Ŀ���

�½�`src/index.js`�ļ���

```js
import Vue from 'vue';
import app from 'src/app.vue';

// ��������ڵ�
const root = document.createElement('div');
document.body.appendChild(root);

// ����vue����,�����ص�root�ڵ�
// h:createApp
new Vue({
    render: h => h(app)
}).$mount(root);
```

# webpack����

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
            
            // ����vue�ļ���loader
            { 
				test: /\.vue$/,
				loader: 'vue-loader'
			},
            
            // ����styl��ʽ��loader
            {
                test: /\.(styl|stylus)$/,
                use: {
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                }
            },            
            
            // �������ͼƬ���ļ�
            // url-loader: ��ͼƬС��1024�ֽ�ʱ���ὫͼƬת����base64���룬�����js�ļ���
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
    // ����vue�ļ�������ӵ�һ�����ݣ���Ȼ�ᱨ��
    plugins: [
		new VueLoaderPlugin(),
	],
}

```

# ���û�������

���������ǿ���������������������֮����ʹ��`cross-env`���ģ�飬����Ϊ��Ҫ��`windows`��`ƻ��`������ƽ̨�����ݴ���ʹ�����ģ����Է�������ʹ�á�

```js
cnpm install cross-env --save-dev
```

��`package.json`�ļ��У�

```json
"build": "cross-env NODE_ENV=production webpack --config webpack.config.js"
"dev": "cross-env NODE_ENV=development webpack-dev-server --config webpack.config.js"
```

�����ű�����Щ�����洢��`process.env`��������£���ô��`webpack.config.js`�ļ��У����Ǿ���ͨ���������ȥ�����Ƿ�Ϊ����������

```js
const isDev = process.env.NODE_ENV === 'production';

if(isDev) {
    // ���һЩ���������
}
```

# devServer����

�ڿ���ģʽ�£�������Ҫ����һ����̬�����������ڷ��ʱ��صľ�̬��Դ��

��װ��

```js
cnpm install webpack-dev-server --save-dev
```

���ã�

```js
if (isDev) {
    // ʹ��source-map �������
	config.devtool = '#cheap-module-eval-source-map';
	config.devServer = {
		port: 8000,
		host: '0.0.0.0',
		overlay: {
			errors: true
		},
		// �����ȼ��ع���
		hot: true
	};
	config.plugins.push(
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	);
}
```

# �ļ����

����������������֮����Ҫһ�����`html`�ļ���ȥ�������Ǵ�����ɵ�`js`�ļ���

�������ǿ��԰�װһ��`html-webpack-plugin`ģ�飺

```js
cnpm install html-webpack-plugin --save-dev
```

**���ã�**�Զ�����һ��`HTML`�ļ�������������ɵ�`js`�ļ����룬��Ϊ��Ŀ����ļ���

��ô��μ򵥵�ʹ�ã�

```js
// webpack.config.js

const HTMLPlugin = require('html-webpack-plugin');

plugins: [
   // ��ʹ��vue �� react���ʱ��ʹ�õ�һ�����
   // ���ã����ֵ�ǰ�Ļ���
   new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: isDev ? '"development"' : '"production"'
        }
    }),               
    new HTMLPlugin()
]
```

# postcss-loader����

���ĳЩ`css`Ҫ���ǵ�������ļ�����(����`css3`�е�`flex`)������Ҫ`webpack`�ڴ���Ĺ������Զ�Ϊ��Щ`css`���Լ��������ǰ׺����ʱ���õ���`postcss-loader`(����һ��ƽ̨)������Ӧ�Ĳ��`autoprefixer`��

�½�`postcss.config.js`�ļ���

```js
const autoprefixer = require('autoprefixer');

module.exports = {
    plugins: [
        autoprefixer()
    ]
};
```



# CSS�����Ż�

�����ɣ�����`CSS`��Ȼ��`JS`��ʽ�����ǵĴ�������֣���ν�`CSS`����������������һ���������ļ���

```js
cnpm install extract-text-webpack-plugin --save-dev
```

���ģ����԰������ǽ���`javascript`���룬�����һ����̬��Դ�ļ���

������`webpack 4.x`�汾ʹ�ù����г��������⣺

* 1.�汾������(����ʹ��`extract-text-webpack-plugin@next`)
* 2.�޷�ʹ��`hash`ֵ

�ٷ����Ƽ�����ʹ�ã�`mini-css-extract-plugin`���ģ�飬���Ȱ�װ��ģ�飺

```js
cnpm install mini-css-extract-plugin --save-dev
```

ʹ�ã���`webpack.config.js`�ļ������ã����ģ��Ὣvue����е���ʽ����Ҳ��ȡ������

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

if(isDev) {
    // ����ģʽ��
    // ...
} else {
    config.output.filename = '[name].[chunkhash:8].js';
    // ��css�ļ��������
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
    
    // ��Ӳ��
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: 'style.[contenthash:8].css'
        })
    )
}
```

# �����������ļ�

��`webpack 4.x`�汾�У�����ָ�����ķ�ʽ�����˺ܴ�ı仯���������ʹ�����µķ�ʽ���д������

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

��ϸ�Ļ����кܶ�Ĳ�����

```js
optimization:{
    splitChunks:{
        chunks:async,//��ʾ��ʾ��ķ�Χ��������ѡֵ��
        //initial(��ʼ��)��async(������ؿ�)��all(Ĭ�ϣ�ȫ����)

        minSize:0,//��ʾ�ڷ���ǰ����Сģ���С��Ĭ��Ϊ0����СΪ30000

        minChunks:1,//��ʾ����ǰ�����ô���,Ĭ��Ϊ1

        maxAsyncRequests:1,//�������ش���������첽���ش�����Ĭ��1

        maxInitialRequests:1,//����ʼ�����ش�����һ������ļ����Բ��м��ص�����ļ�������Ĭ��1

        automaticNameDelimiter: '~',//����ָ���������Ϊ'-'�������jsĬ����������Ϊ[��Դ]-[���key].js

        name: function(){},//���������ƣ���ѡ��ɽ��ܺ�����Ĭ��true,,��chunk��hashֵ�Զ����ɣ�
        //������ƥ��Ļ�����ʱ������ʹ�û������е�nameֵ����������Ϊ[��Դ]~[���key].js

        cacheGroups:{//���û���chunks

            priority: 0,//���������ȼ�
            //����Ҫ����ƥ�仺����Ĺ���ʱ��priority��Ҫ����Ϊ����������Ҫ����ƥ��Ĭ������ʱ��������������Ϊ������0Ϊ���߷ָ���

            default:{//���û�����Ĭ�����ã���ͨ��default:false����Ĭ�ϻ����飬
            //Ȼ��Ϳ����Զ��建���飬����ʼ������ʱ���ظ����õ�ģ����в��
                minChunks:2,//��������
                priority:-20,//���������ȼ�Ϊ-20
                reuseExistingChunk:true,//��ʾ����ʹ���Ѿ����ڵĿ飬��������������Ŀ��Ѿ����ھ����ü��еĵģ����ٴ���һ���µĿ�
            }��
            [key]:{//�Զ��建���飬���Ը����������ɴ���
                chunks:'initial',
                test: /vue/,//���������֤������Ͼ���ȡchunk���뵱ǰ�����飬ֵ������function��boolean��string��RegExp��Ĭ��Ϊ��
                enforce: true//���ȴ���
            }
        }
    }
}
--------------------- 
���ߣ�bubbling_coding 
��Դ��CSDN 
ԭ�ģ�https://blog.csdn.net/bubbling_coding/article/details/81585412 
��Ȩ����������Ϊ����ԭ�����£�ת���븽�ϲ������ӣ�
```





# ����hash����

* **hash**

  `hash`�Ǹ�������Ŀ�Ĺ�����أ�ֻҪ��Ŀ�����ļ����ģ�������Ŀ������`hash`ֵ������ģ�����ȫ���ļ���������ͬ��`hash`ֵ��

* **chunkhash**
  ʹ��`hash`����Ļ���ÿ�ι���������ͬ������û�취ʵ�ֻ���Ч����������Ҫ����һ�ֹ�ϣֵ���㷽ʽ��
`chunkhash`��`hash`��һ���������ݲ�ͬ������ļ�`(Entry)`���������ļ�������������Ӧ��`chunk`�����ɶ�Ӧ�Ĺ�ϣֵ�������������������һЩ������ͳ�������ļ����ֿ�����������������������ǲ���`chunkhash`�ķ�ʽ���ɹ�ϣֵ����ôֻҪ���ǲ��Ķ�������Ĵ��룬�Ϳ��Ա�֤���ϣֵ������Ӱ�졣

* **contenthash**
`contenthash`������ļ����ݼ���ģ�ֻ�����Լ�ģ������ݱ��ˣ���ô`hash`ֵ�Ÿı䣬�������ǿ���ͨ��`contenthash`����������⡣

 

# webpack��������

```js
const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCssPlugin = require('mini-css-extract-plugin');

// �ж��Ƿ�Ϊ����ģʽ
const isDev = process.env.NODE_ENV === 'development';

const config = {
	mode: isDev ? 'development' : 'production',
	entry: path.join(__dirname, 'src/index.js'),
	output: {
		filename: 'bundle.[hash:8].js',
		path: path.join(__dirname, 'dist')
	},
	module: {
		rules: [{ // ����vue�ļ���loader
			test: /\.vue$/,
			loader: 'vue-loader'
		},
			{ //  ����ͼƬ��Դ
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
	// ����stylus��ʽ�ļ���loader
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
		// �����ȼ��ع���
		hot: true
	};
	config.plugins.push(
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	);
} else {
	// ���ϻ���
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





