const fs = require('fs');
const path = require('path');
const axios = require('axios');
const webpack = require('webpack');
const Router = require('koa-router');
const MemoryFs = require('memory-fs');
const VueServerRenderer = require('vue-server-renderer');

const serverRender = require('./server-render');
const serverConfig = require('../../build/webpack.config.server');

const serverCompiler = webpack(serverConfig);
const mfs = new MemoryFs();
serverCompiler.outputFileSystem = mfs;

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

const router = new Router();
router.get('*', handleSSR);

module.exports = router;
