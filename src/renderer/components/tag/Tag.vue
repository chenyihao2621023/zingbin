<template>
    <transition name="fade">
    <span
        class="tag"
        :class="[type ? 'tag--' + type : '', {'is-hit': hit}, size ? 'tag--' + size : '']"
        :style="{backgroundColor: bgColor,borderColor: borderColor, color: color}">
      <slot></slot>
      <div class="tag__close"
           v-if="closable">
        <i class="iconfont icon-fangkeduanguanbi"
           @click="handleClose">
        </i>
      </div>

    </span>
    </transition>
</template>
<script>
    import colorFn from 'css-color-function';
    export default {
        name: 'Tag',
        props: {
            text: String,
            closable: Boolean,
            type: String,
            hit: Boolean,
            closeTransition: Boolean,
            color: String,
            size: String
        },
        data() {
            return {
                bgColor: '',
                borderColor: '',
                hover: false
            }
        },
        mounted() {
            if (this.color) {
                this.bgColor = colorFn.convert(`color(${this.color} tint(90%)) `)
                this.borderColor = colorFn.convert(`color(${this.color} tint(68%)) `)
            }
        },
        methods: {
            handleClose(event) {
                this.$emit('close', event);
            },
            mouseover() {
                this.hover = true
            }
        }
    };
</script>
<style lang="stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .tag
        background-color: #dcf6ef
        display: inline-block
        padding: 0 5px
        height: 20px
        line-height: 18px
        font-size: 13px
        color: #17c295
        border-radius: 4px
        box-sizing: border-box
        border: 1px solid transparent
        white-space: nowrap
        transition: all .3s cubic-bezier(.55, 0, .1, 1)
        &.fade-enter-active, &.fade-up-leave-active
            opacity: 1
            transform: scaleY(1)
        &.fade-enter, &.fade-leave-active
            opacity: 0
            transform: scaleX(0)

        .tag__close
            display: inline-block
            border-radius: 50%
            text-align: center
            position: relative
            cursor: pointer
            font-size: 12px
            vertical-align: middle
            color: #409eff
            transform: scale(.5)
        &--large
            height: 24px
            line-height: 22px
        &--small
            height: 18px
            line-height: 18px
        &--green
            background-color: #dcf6ef;
            border-color: #dcf6ef;
            color: #17c295;
        &--success
            background-color: #e4f2fc;
            border-color: #e4f2fc;
            color: #4da9eb;
        &--warning
            background-color: #fbf3cd;
            border-color: #fbf3cd;
            color: #f9d11a;
        &--danger
            background-color: #fcdad4;
            border-color: #fcdad4;
            color: #f2725e;
        &--primary
            background-color: #e5e5e5;
            border-color: #e5e5e5;
            color: #707070;
        &--purple
            background-color: #c5dbdb;
            border-color: #c5dbdb;
            color: #00cccc;
        &--default
            background-color: #f42ef0;
            border-color: #f42ef0;
            color: #88147f;
</style>

