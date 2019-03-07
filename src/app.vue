<template>
  <div id="app">
    <loading :loading-visible="loadingVisible"></loading>
    <div class="content">
      <HeaderCom />
      <transition
        mode="out-in"
        name="fade"
      >
        <keep-alive>
          <router-view />
        </keep-alive>
      </transition>
    </div>
    <button
      style="float: left"
      class="add-notify"
      @click.prevent="addNotify"
    >
      添加notification
    </button>
    <div class="footer">
      <FooterCom />
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapMutations, mapActions, mapGetters } from 'vuex';
  import HeaderCom from './layout/header.vue';
  import FooterCom from './layout/footer.vue';
  import * as types from './store/mutation-types';

  export default {
    components: {
      HeaderCom,
      FooterCom
    },
    computed: {
      ...mapGetters([
        'count', 'loadingVisible'
      ])
    },
    methods: {
      addNotify () {
        this.$notify({
          autoCloseTime: 3000,
          content: 'hello world!',
          btn: 'close'
        });
      },
      ...mapMutations({
        setCount: types.SET_COUNT,
        setLoadingVisible: types.SET_LOADING_VISIBLE
      }),
      ...mapActions(['setCountAsync'])
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>

  .fade-enter-active, .fade-leave-active
    transition: opacity 1s
    opacity 1

  .fade-enter, .fade-leave-to
    opacity 0

  #app
    min-height 100vh
    background rgba(0, 0, 0, .5)
    .content
      min-height calc(100vh - 120px)
</style>
