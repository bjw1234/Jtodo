/**
 * 无论在 development 模式下，
 * 还是在 production 模式下都需要使用的一个函数
 * 服务器端的模板渲染
 */
const ejs = require('ejs');

module.exports = async (ctx, renderer, template) => {
  ctx.headers['Content-Type'] = 'text/html';
  const context = { url: ctx.path };
  try {
    const appString = await renderer.renderToString(context);
    // 拿到meta相关信息，进行渲染
    const { title } = context.meta.inject();

    ctx.body = ejs.render(template, {
      appString,
      style: context.renderStyles(),
      scripts: context.renderScripts(),
      title: title.text()
    });
  } catch (err) {
    console.log('server render error');
    throw err;
  }
};
