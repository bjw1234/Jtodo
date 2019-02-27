<template>
  <div id="app">
    <HeaderCom />
    <Todo />
    <FooterCom />
  </div>
</template>

<script type="text/ecmascript-6">
  import HeaderCom from './layout/header.vue';
  import FooterCom from './layout/footer.vue';
  import Todo from './views/todo/todo.vue';

  export default {
    components: {
      HeaderCom,
      FooterCom,
      Todo
    }
  };
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  #app
    min-height 100vh
    background rgba(0, 0, 0, .5)
</style>
