/**
 * 用于 node 启动服务器
 */
const Koa = require('koa');
const path = require('path');
const send = require('koa-send');
const staticRouter = require('./routers/static');

const app = new Koa();
const isDev = process.env.NODE_ENV === 'development';

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
