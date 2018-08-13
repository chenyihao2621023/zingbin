<template>
    <div class="taskDmore">
        <div class="taskDmore-item border-1px" v-for="item in moreData" :class="item.idSepc"
             :key="item.value" @click="moreItemClick($event, item.value)">
            <div class="taskDmore-item-icon border-1px">
                <i :class="`iconfont icon-${item.icon}`"></i>
            </div>
            <p>{{item.name}}</p>
        </div>
    </div>
</template>
<script>
    export default {
       props:{
           taskLeaderValue:{
               type: String,
           }
       },
        data() {
            return {
                moreData: [
                    {
                        icon: 'tupian',
                        name: '图片',
                        value: 'image',
                    },
                    {
                        icon: 'wenjiangui1',
                        name: '附件',
                        value: 'filebox',
                    },
                    {
                        icon: 'shoucangbiaoji',
                        name: '标签',
                        value: 'label'
                    },
                    {
                        icon: 'shoucangbiaoji',
                        name: '关联',
                        value: 'relation'
                    },
                ]
            }
        },
        computed: {
            cardUrl() {
                return this.$store.state.ui.userInfo.cardUrl;
            }
        },
        mounted() {
            if (this.taskLeaderValue.indexOf(this.cardUrl) === (-1)) {
               this.moreData.splice(2,1)
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
    @import "../../../../assets/stylus/variable.styl"
    @import "../../../../assets/stylus/mixin.styl"

    .taskDmore
        width: 100%
        height 100%
        flex-center( flex-start, start)
        .taskDmore-item
            flex-center(column, space-between,)
            width: calc(25vw - 31px)
            margin-right: 26px
            &:last-child
                margin-right: 0
            .taskDmore-item-icon
                padding: 15px
                border: 1px solid #ededed
                background-color: #fbfbfc
                border-radius: 12px
                line-height: 1
                .iconfont
                    font-size: 1.7rem
            & > p
                margin-top: 10px
                color: #A9ABAB
                font-size: .75rem
    /* 12/16 */
</style>
