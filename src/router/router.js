import Vue from 'vue';
import VueRouter from 'vue-router';
import Todo from '../views/todo/todo.vue';
import Login from '../views/login/login.vue';

// 全局注册
Vue.use(VueRouter);

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

export default router;
