<template>
  <transition name="fade">
    <div
      v-show="loadingVisible"
      id="loading"
    >
      <div class="dot-container">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'Loading',
    props: {
      loadingVisible: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #loading
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 10
    background: rgba(0, 0, 0, 0.3)
    .dot-container
      width: 100%
      height: 100%
      display: flex
      justify-content: center
      align-items: center
      .dot
        width: 20px
        height: 20px
        margin: 0 4px
        border-radius: 50%
        background: #000
        animation: scale 0.5s linear infinite alternate
      .dot-1
        background: red
        animation-delay: 0.1s
      .dot-2
        background: green
        animation-delay: 0.3s
      .dot-3
        background: blue
        animation-delay: 0.5s

  @keyframes scale
    0%
      transform: scale(1)
    100%
      transform: scale(0.3)
</style>
