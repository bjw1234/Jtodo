<template>
  <div id="app">
    <div class="content">
      <HeaderCom />
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
  import HeaderCom from './layout/header.vue';
  import FooterCom from './layout/footer.vue';

  export default {
    components: {
      HeaderCom,
      FooterCom
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
