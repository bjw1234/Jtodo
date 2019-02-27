<template>
  <div id="footer">
    <span>Written by {{ author }}</span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        author: 'bjw'
      };
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #footer
    padding 40px
    text-align center
    color #e4eee3
    font-size 15px
    text-shadow 0 3px 0 2px #eee
</style>
