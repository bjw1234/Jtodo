<template>
  <transition
    name="fade"
    @after-leave="afterLeave"
  >
    <div
      v-show="visible"
      class="notification"
      :style="style"
      @mouseenter="mouseEnterHandler"
      @mouseleave="mouseLeaveHandler"
    >
      <span
        class="content"
      >
        {{ content }}
      </span>
      <a
        class="btn"
        @click="handleClose"
      >
        {{ btn }}
      </a>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'Notification',
    props: {
      content: {
        type: String,
        required: true
      },
      btn: {
        type: String,
        default: '关闭'
      }
    },
    data () {
      return {
        visible: false,
        autoCloseTime: 3000
      };
    },
    computed: {
      style () {
        return {};
      }
    },
    mounted () {
      this.createTimer();
    },
    methods: {
      handleClose (e) {
        e.preventDefault();
        // 需要在api模块中统一管理，所以需要发出该事件
        this.$emit('close');
      },
      createTimer () {
        if (!this.autoCloseTime) return;
        this.timer = setTimeout(() => {
          this.visible = false;
        }, this.autoCloseTime);
      },
      clearTimer () {
        if (this.timer) {
          clearTimeout(this.timer);
        }
      },
      afterLeave () {
        this.$emit('closed', this);
      },
      mouseEnterHandler () {
        this.clearTimer();
      },
      mouseLeaveHandler () {
        this.createTimer();
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .notification
    display: flex
    background-color: #303030
    color: rgba(255, 255, 255, 1)
    align-items: center
    padding: 20px
    position: fixed
    min-width: 280px
    box-shadow: 0 3px 5px -1px rgba(0, 0, 0, .2), 0 6px 10px 0 rgba(0, 0, 0, .2)
    flex-wrap: wrap
    transition: all .3s
    .content
      padding: 0
    .btn
      color: #ff4081
      padding-left: 24px
      margin-left: auto
      cursor: pointer

</style>
