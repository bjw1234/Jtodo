import Vue from 'vue';
import app from './app.vue';

// 全局样式
import '../assets/style/global.styl';

// 创建挂载节点
const root = document.createElement('div');
document.body.appendChild(root);

new Vue({
	render: h => h(app)
}).$mount(root);