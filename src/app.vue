<template>
  <div id="app">
    <div id="cover" />
    <HeaderCom />
    <Todo />
    <FooterCom />
  </div>
</template>

<script type="text/ecmascript-6">
import HeaderCom from './layout/header.vue'
import FooterCom from './layout/footer.vue'
import Todo from './views/todo/todo.vue'

export default {
  components: {
    HeaderCom,
    FooterCom,
    Todo
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    #app
        position absolute
        left 0
        right 0
        top 0
        bottom 0

    #cover
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        background-color #555
        opacity 0.5
        z-index -1
</style>
