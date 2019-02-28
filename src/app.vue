<template>
  <div id="app">
    <div class="content">
      <HeaderCom />
      <p>{{ count }}</p>
      <button @click="addHandler">
        加一
      </button>
      <button @click="addAsyncHandler">
        异步修改
      </button>
      <transition name="fade">
        <div class="router-view">
          <keep-alive>
            <router-view />
          </keep-alive>
        </div>
      </transition>
    </div>
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
        'count'
      ])
    },
    methods: {
      ...mapMutations({
        setCount: types.SET_COUNT
      }),
      ...mapActions(['setCountAsync']),
      addHandler () {
        let c = this.count;
        this.setCount(++c);
      },
      addAsyncHandler () {
        this.setCountAsync(9527);
//        this.$store.dispatch('setCountAsync', 9988);
      }
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
      min-height calc(100vh - 100px)
</style>
