/**
 * 通过路由去请求不同的数据
 * @type {Router}
 */
const Router = require('koa-router');

const apiRouter = new Router({ prefix: '/api' });

// 验证用户状态
const validateUser = async (ctx, next) => {
  if (!ctx.session.user) {
    ctx.status = 401;
    ctx.body = {
      error: 1,
      message: 'need login'
    };
  } else {
    await next();
  }
};

const handleResp = (data) => {
  return data ? {
    error: 0,
    data
  } : {
    error: 1,
    data: '你都没联网好吧.'
  };
};

// 登陆验证
apiRouter.use(validateUser);

apiRouter
.get('/todos', async (ctx) => {
  const todos = await ctx.db.getAllTodos();
  ctx.body = handleResp(todos);
})
.post('/todo', async (ctx) => {
  const todo = await ctx.db.addTodo(ctx.request.body);
  ctx.body = handleResp(todo);
})
.put('/todo/:id', async (ctx) => {
  const todo = await ctx.db.updateTodo(ctx.params.id, ctx.request.body);
  ctx.body = handleResp(todo);
})
.delete('/todo/:id', async (ctx) => {
  const todo = await ctx.db.deleteTodo(ctx.params.id);
  ctx.body = handleResp(todo);
})
.post('/delete/completed', async (ctx) => { // 删除所有完成的todo
  const data = await ctx.db.deleteCompleted(ctx.request.body.ids);
  ctx.body = handleResp(data);
});

module.exports = apiRouter;
