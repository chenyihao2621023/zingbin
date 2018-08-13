<template>
    <div class="tag-group">
        <checker
            v-model="selected"
            default-item-class="tag-group-item"
            selected-item-class="tag-group-item-selected"
            @on-change="onChange"
        >
            <checker-item :class="item.level" v-if="item.value.trim()!==''" v-for="(item, index) in items" :key="index" :value="item.value">{{item.key}}</checker-item>
        </checker>
    </div>
</template>

<script>
    import { Checker, CheckerItem } from 'vux'


    export default {
        name: 'TagGroup',
        components: {
            Checker,
            CheckerItem
        },
        props: {
            items: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                selected: ''
            }
        },
        methods: {
            onChange (val) {
                let tmp = this.items.filter(item => item.value !== val)
                this.$emit('onChange', tmp, val)
            }
        }
    }
</script>

<style lang="stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .tag-group
        padding 4px 10px 10px 10px
        .tag-group-item
            height 26px
            line-height 26px
            text-align center
            border-radius 3px
            margin-right 6px
            margin-top 6px
            padding-left 5px
            padding-right 5px
            color: #fff
        .default
            border 1px solid #ffe7ba
            background-color #ffa940
        .success
            border 1px solid #4cae4c
            background-color #5cb85c
        .info
            border 1px solid #46b8da
            background-color #5bc0de
        .tag-group-item-selected
            border-color #ffe7ba
</style>
