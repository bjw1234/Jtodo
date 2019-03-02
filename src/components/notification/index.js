import Notification from './notification.vue';
import notify from './notification-api';

export default (Vue) => {
  // 注册全局组件
  Vue.component(Notification.name, Notification);
  Vue.prototype.$notify = notify; // 添加一个方法
}
