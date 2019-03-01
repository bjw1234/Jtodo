/**
 * 服务器端渲染
 * 导出路由处理对象router
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const webpack = require('webpack');
const Router = require('koa-router');
const MemoryFs = require('memory-fs');
const VueServerRenderer = require('vue-server-renderer');

// 加载服务器端渲染文件
const serverRender = require('../server-render');
// 加载webpack配置文件
const serverConfig = require('../../build/webpack.config.server');

const serverCompiler = webpack(serverConfig);
const mfs = new MemoryFs();
serverCompiler.outputFileSystem = mfs;

// 打包服务器端运行的bundle文件
let bundle = null;
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err;
  stats = stats.toJson();
  stats.errors.forEach(err => console.error(err));
  stats.warnings.forEach(warn => console.warn(warn));

  // 服务端bundle的路径
  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  );
  console.log('server Compiler, new bundle generated.');
  // 同步读取出来的bundle是一个json文件，string -> 模块 ？
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'));
});

const handleSSR = async (ctx) => {
  if (!bundle) {
    ctx.body = 'wait a minute.';
    return;
  }
  // 得到带有静态文件路径的json文件
  const clientManifestResp = await axios.get(
    'http://localhost:8000/public/vue-ssr-client-manifest.json'
  );
  const clientManifest = clientManifestResp.data;

  const template = fs.readFileSync(
    path.join(__dirname, '../server.template.ejs'),
    'utf-8'
  );

  // 生成对象，带有script标签的js字符串
  const renderer = VueServerRenderer.createBundleRenderer(bundle, {
    inject: false,
    clientManifest
  });
  await serverRender(ctx, renderer, template);
};

// 无论用户访问哪个路由，都交给 handleSSR 去处理
const router = new Router();
router.get('*', handleSSR);

module.exports = router;
