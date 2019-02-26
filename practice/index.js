import Vue from 'vue';

/* eslint-disable */
const vm = new Vue({
  el: '#app',
  template: '<div>{{ text }}</div>',
  data () {
    return {
      text: 'hello world!'
    };
  }
});

window.vm = vm;
