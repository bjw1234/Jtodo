import Vue from 'vue';
import Vuex from 'vuex';
import app from './app.vue';
import VueRouter from 'vue-router';

import createStore from './store/index';
import createRouter from './router/index';
// 全局样式
import './assets/style/global.styl';

// 注册
Vue.use(Vuex);
Vue.use(VueRouter);
const store = createStore();
const router = createRouter();

// eslint-disable-next-line
const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(app)
});

window.vm = vm;
