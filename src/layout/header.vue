<template>
  <div>
    <div class="header">
      <router-link
        to="/todo"
        class="link todo"
      >
        首页
      </router-link>
      <router-link
        to="/login"
        class="link login"
      >
        登录
      </router-link>
    </div>
    <header class="main-header">
      <h1>Next to do</h1>
    </header>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .header
    position fixed
    z-index: 1
    width 100%
    height 50px
    background #eee
    box-shadow: 0 1px 10px 1px #333
    padding-right 20px
    color #222
    display flex
    align-items center
    justify-content flex-end
    .link
      text-decoration none
      color #222
      padding 6px 12px
      margin-right 20px
      &.router-link-active
        color #eee
        border-radius 5px
        background #004e77

  .main-header
    text-align center
    h1
      font-size 100px
      background-image: linear-gradient(#167, #325de9);
      -webkit-background-clip text
      text-fill-color transparent
      -webkit-text-fill-color transparent
      margin 0
      padding 40px 0 20px 0
</style>
