/**
 * 对基础组件进行扩展
 */
import Notification from './notification.vue';

export default {
  extends: Notification,
  computed: {
    style () {
      return {
        position: 'fixed',
        right: '20px',
        bottom: `${this.verticalOffset}px`
      };
    }
  },
  methods: {
    beforeDestroy () {
      console.log('beforeDestroy');
      this.clearTimer();
    }
  },
  data () {
    return {
      verticalOffset: 0
    };
  }
};
