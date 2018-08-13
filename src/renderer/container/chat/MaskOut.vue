<template>
  <div class="mask-out">
    <slot></slot>
  </div>
</template>
<script>
export default {

}
</script>

<style lang="stylus" scoped>
@import "../../assets/stylus/variable.styl"
@import "../../assets/stylus/mixin.styl"

.mask-out
    position: absolute
    z-index: 9999
    height: 10rem
    width: 10rem
    top: 50%
    left: 50%
    margin-left: -5rem
    margin-top: -5rem
    border-radius: 8px
    background: #000
    opacity: .6
    color: #fff
    flex-center(,center,center)
</style>


