/**
 * webpack 入口文件（项目入口）
 */
import createApp from './create-app';

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router } = createApp();
    router.push(context.url);
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents) {
        return reject(new Error('no component matched'));
      }
      // 通过app拿到meta对象
      context.meta = app.$meta();
      resolve(app);
    });
  });
}
