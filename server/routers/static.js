/**
 * 处理静态资源
 */
const Router = require('koa-router');
const send = require('koa-send');

const staticRouter = new Router({ prefix: '/dist' });

staticRouter.get('/*', async ctx => {
  await send(ctx, ctx.path);
});

module.exports = staticRouter;
