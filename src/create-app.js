/**
 * 创建整个vue应用
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import Meta from 'vue-meta';

import App from './app.vue';
import createStore from './store/index';
import createRouter from './router/index';

import './assets/style/global.styl';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Meta);

export default () => {
  const router = createRouter();
  const store = createStore();

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });
  return { app, router, store };
}
