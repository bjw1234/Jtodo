import VueRouter from 'vue-router';
import Todo from '../views/todo/todo.vue';
import Login from '../views/login/login.vue';
// import path from 'path';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/todo',
    component: Todo
    // component: () => import(path.join(__dirname, '../views/todo.vue'))
  },
  {
    path: '/login',
    component: Login
    // component: () => import(path.join(__dirname, '../views/login.vue'))
  }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

// 导出一个方法，在index.js中创建router，并注册
// 方便管理，有利于服务器端渲染
export default () => router;
