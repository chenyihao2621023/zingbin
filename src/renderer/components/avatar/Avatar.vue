<template>

    <span :class="avatarCls">
        <img v-if="src"
             :src="src"
             onerror="this.src='./static/images/userDef_.jpg'">
        <i v-else-if="icon" :class="['iconfont', `icon-${icon}`]"></i>
        <span v-else :class="`${prefixCls}-string`" :style="style" ref="children">
            <slot></slot>
        </span>
    </span>
</template>
<script>
    export default {
        name: "Avatar",
        props: {
            size: {
                type: String,
                default: "large"
            },

            src: String,
            shape: {
                type: String,
                default: "square"
            },
            icon: String
        },
        data() {
            return {
                prefixCls: "ei-avatar",
                scale: 1,
                isSlotShow: false,
                style: {}
            };
        },
        computed: {
            avatarCls() {
                const size = { large: "lg", small: "sm", normal: "normal" }[this.size];

                return [
                    this.prefixCls,
                    `${this.prefixCls}-${this.shape}`,
                    {
                        [`${this.prefixCls}-${size}`]: !!size,
                        [`${this.prefixCls}-icon`]: !!this.icon,
                        [`${this.prefixCls}-image`]: !!this.src,
                        [`${this.prefixCls}-custom`]: !this.icon && !this.src
                    }
                ];
            },
        },
        mounted() {
            this.setScale();
        },
        updated() {
            this.setScale();
        },
        methods: {
            setScale() {
                this.isSlotShow = !this.src && !this.icon;
                if (this.$refs.children) {
                    const childrenWidth = this.$refs.children.offsetWidth;
                    const avatarWidth = this.$el.getBoundingClientRect().width;

                    if (avatarWidth - 8 < childrenWidth) {
                        this.scale = (avatarWidth - 8) / childrenWidth;
                    } else {
                        this.scale = 1;
                    }
                }
            }
        }
    };
</script>
<style lang="stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .ei-avatar {
        display: inline-block;
        flex-center(start, center, center)
        text-align: center;
        background: $avatar-bg;
        color: $avatar-color;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        avatar-size($avatar-size-base, $avatar-font-size-base);
        &-custom {
            flex-center(row, start, start)
            flex-wrap: wrap
        }
        &-lg {
            avatar-size($avatar-size-lg, $avatar-font-size-lg);
        }
        &-string {
            line-height: 1
            flex-center(row, center, center)
            flex-wrap: wrap
            img {
                height auto
                width 33%
            }
        }
        &-sm {
            avatar-size($avatar-size-sm, $avatar-font-size-sm);
        }
        &-normal {
            avatar-size($avatar-size-base, $avatar-font-size-base);
        }
        &-square {
            border-radius: $avatar-border-radius;
        }

        & > img {
            width: 100%;
            height: 100%;
            display: block;
        }
    }
</style>


