/**
 * webpack 入口文件（项目入口）
 */
import createApp from './create-app';

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();
    router.push(context.url);
    router.onReady(() => {
      // 拿到这个路由下匹配的所有组件
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents) {
        return reject(new Error('no component matched'));
      }
      Promise.all(matchedComponents.map(component => {
        if (component.asyncData) {
          return component.asyncData({
            route: router.currentRoute,
            store
          });
        }
      })).then(data => {
        console.log(data, typeof data);
      }).catch(err => console.log(err));
      // 通过app拿到meta对象
      context.meta = app.$meta();
      resolve(app);
    });
  });
}
