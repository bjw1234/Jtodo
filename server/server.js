/**
 * 用于 node 启动服务器
 */
const Koa = require('koa');
const path = require('path');
const send = require('koa-send');
const koaBody = require('koa-body');
const koaSession = require('koa-session');

const staticRouter = require('./routers/static');
const apiRouter = require('./routers/api');
const userRouter = require('./routers/user');

const createDb = require('./db/db');
const config = require('../app.config');

// 让全局使用db，可以用一个中间件
const db = createDb(config.db.appID, config.db.appKey);

const app = new Koa();
const isDev = process.env.NODE_ENV === 'development';

app.keys = ['vue ssr koa'];
app.use(koaSession({
  key: 'v-ssr-id',
  maxAge: 2 * 60 * 60 * 1000
}, app));

app.use(koaBody());

app.use(async (ctx, next) => {
  ctx.db = db;
  await next();
});

// 用于处理 favicon.cio 网页图标
app.use(async (ctx, next) => {
  if (ctx.path === '/favicon.ico') {
    await send(ctx, '/favicon.ico', { root: path.join(__dirname, '../') });
  } else {
    await next();
  }
});

// 捕获出错信息
app.use(async (ctx, next) => {
  try {
    console.log(`request with path ${ctx.path}`);
    await next();
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    if (isDev) {
      ctx.body = err.message;
    } else {
      ctx.body = 'please try again later!';
    }
  }
});

// 处理静态资源路由
app.use(staticRouter.routes()).use(staticRouter.allowedMethods());
app.use(apiRouter.routes()).use(apiRouter.allowedMethods());
app.use(userRouter.routes()).use(userRouter.allowedMethods());

// 区分开发环境和生产环境
let pageRouter = null;
if (isDev) {
  pageRouter = require('./routers/dev-ssr');
} else {
  pageRouter = require('./routers/ssr');
}

// 用于处理网页路由
app.use(pageRouter.routes()).use(pageRouter.allowedMethods());

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 3333;

app.listen(PORT, HOST, () => {
  console.log(`server is listening on ${HOST}:${PORT}`);
});
