<template>
    <ol class="tree-nav">
        <li v-for="(nav,index) in navList" :key="index"
            v-if="navList.length > 0 && index != navList.length - 1">
            <a href="javascript:;" @click="onNavClick(index)">{{nav.name}}</a>
        </li>
        <li v-for="(nav,index) in navList" :key="index"
            v-if="navList.length > 0 && index == navList.length - 1"
            class="active">
            {{nav.name}}
        </li>
        <span v-show="showLock"><i class="iconfont icon-yanjing-zheng"></i></span>
    </ol>
</template>

<script>
    export default {
        name: 'TreeNav',
        props: {
            navList: {  // 路径信息列表
                type: Array,
                default: function () {
                    return [
                        /*
                         { name: 'Home' },
                         { name: 'Library' },
                         { name: 'Data' }
                         */
                    ]
                }
            },
            showLock: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {}
        },
        methods: {
            onNavClick (index) {
                this.$emit('navClicked', this.navList[index])
            }
        }
    }
</script>

<style lang="stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    $tree-nav-separator-with-blank = $tree-nav-separator + ' '

    .tree-nav
        display block !important
        overflow-x auto
        padding $tree-nav-padding-vertical $tree-nav-padding-horizontal
        margin-bottom $line-height-computed * 0.5
        list-style none
        background-color $tree-nav-bg
        border-radius $border-radius-base
        & > li
            display inline-block
            color $tree-nav-inactive-color
            & > a
                color $tree-nav-inactive-color
            & + li:before
                content $tree-nav-separator-with-blank
                padding 0 5px
                color $tree-nav-color
        & > .active
            color $tree-nav-active-color
        & > span
            display inline-block
            margin-left 5px
            color $tree-nav-lock-color
</style>
