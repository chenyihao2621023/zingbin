<template>
    <div class="find-public">

   </div>
</template>

<script>

</script>
<style>
    .bottom_btn .vux-flexbox-item{
        margin: 0!important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus">
    @import '~assets/stylus/variable.styl';
    @import '~assets/stylus/mixin.styl';
    .find-public
        width: 100%
        height: 100%
        .find-commont-btn
            margin-right: 10px
            border: 1px solid #FF8000
            padding: 2px 8px
            color #FF8000
        & > div
            width: 100%
        .find-public-scroll
            height calc(100% - 50px)
            overflow hidden
            .intermediate-content
                position: relative
                flex-center(row, start, center)

</style>
