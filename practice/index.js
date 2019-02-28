import Vue from 'vue';

const AlertBox = {
  template: `
    <div :style="style">
        <strong>Error!</strong>
        <slot msg="hello world."></slot>
    </div>`,
  data () {
    return {
      style: {
        padding: '10px 20px',
        background: '#f3beb8',
        border: '1px solid #f09898'
      }
    };
  }
};

/* eslint-disable */
const vm = new Vue({
  el: '#app',
  components: {
    AlertBox
  },
  template: `
    <div>
      <alert-box ref="box">
          <span slot-scope="props">{{ props.msg }}</span>
      </alert-box>
    </div>`
});

window.vm = vm;
