const Router = require('koa-router');

const userRouter = new Router({ prefix: '/user' });

userRouter.post('/login', async (ctx) => {
  let user = ctx.request.body;
  console.log(user);
  if (user.username === 'admin' && user.password === 'admin') {
    // TODO 记住用户名和密码
    ctx.session.user = user;
    // TODO 页面跳转到登陆页面
    ctx.body = {
      error: 0,
      data: {
        username: 'admin'
      }
    };
  } else {
    ctx.body = {
      error: 1,
      data: {
        message: '用户名或密码错误'
      }
    };
  }
});

module.exports = userRouter;
