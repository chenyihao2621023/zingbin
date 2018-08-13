<template>
    <div class="find">
        <router-view/>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            };
        }
    }
</script>
<style>
   .find .weui-cell:before{
       border:none !important
   }
   .find .vux-fade-leave-active, .vux-fade-leave-to, .vux-dialog-leave-active, .vux-dialog-leave-to {
       animation-duration: 0.2s !important;
       animation-name: none !important;
   }
   .find .weui-dialog__btn_primary {
       color: #ff8000 !important;
   }

</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .find{
        height:100%
    }
</style>
