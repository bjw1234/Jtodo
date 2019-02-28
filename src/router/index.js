import VueRouter from 'vue-router';
import Todo from '../views/todo/todo.vue';
import Login from '../views/login/login.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/todo',
    component: Todo
  },
  {
    path: '/login',
    component: Login
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

// 导出一个方法，在index.js中创建router，并注册
// 方便管理，有利于服务器端渲染
export default () => router;
