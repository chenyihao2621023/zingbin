<template>
    <div class="more">
        <div class="more-item border-1px" v-for="item in moreData" :key="item.value" @click="moreItemClick($event, item.value)">
            <div class="more-item-icon border-1px"><i :class="`iconfont icon-${item.icon}`"></i></div>
            <p>{{item.name}}</p>
        </div>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                moreData: [
                    {
                        icon: 'tupian',
                        name: '图片',
                        value: 'image'
                    }, {

                        icon: 'weizhi',
                        name: '位置',
                        value: 'location'
                    }, {
                        icon: 'wenjiangui1',
                        name: '文件',
                        value: 'filebox'
                    }
                ]
            }
        },
        methods: {
            moreItemClick($event, value) {
                this.$emit('itemClick', value)
            }
        }
    }
</script>
<style lang="stylus" scoped>
    @import "../../assets/stylus/variable.styl"
    @import "../../assets/stylus/mixin.styl"

    .more
        width: 100%
        height 100%
        flex-center(, flex-start, start)
        .more-item
            flex-center(column, space-between,)
            width: calc(25vw - 31px)
            margin-right: 26px
            &:last-child
                margin-right: 0
            .more-item-icon
                padding: 20px
                border: 1px solid #ededed
                background-color: #fbfbfc
                border-radius: 12px
                line-height: 1
                .iconfont
                    font-size: 1.2rem
            & > p
                margin-top: 10px
                color: #A9ABAB
                font-size: .75rem
    /* 12/16 */
</style>
