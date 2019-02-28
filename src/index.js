import Vue from 'vue';
import app from './app.vue';
import router from './router/router';

// 全局样式
import './assets/style/global.styl';

// eslint-disable-next-line
new Vue({
  el: '#app',
  render: h => h(app),
  router
});
