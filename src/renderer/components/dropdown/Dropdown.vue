<template>
    <div ref="dropdown"
    :style="{
        display: 'inline-block',
        height: height,
        lineHeight: lineHeight
        }"
    >
        <slot></slot>
        <transition name="fade">
            <div ref="content"
                 :class="`el-dropdown el-dropdown-placement-${placement}`"
                 :style="style"
                 v-show="isOpen">
                <dropdown-menu :data="data" :trigger="trigger"></dropdown-menu>
            </div>
        </transition>
    </div>
</template>

<script lang="babel">
    import { mapState, mapMutations } from 'vuex';
    import dropdownMenu from './DropdownMenu';
    import { getOffset } from '../../utils/fn';
    import emitter from '../../mixins/emitter.js';

    const Trigger = ['click', 'hover'];
    export default {
        name: 'Dropdown',
        components: {
            dropdownMenu,
        },
        mixins: [emitter],
        props: {
            height: {
                type: String,
                default: '50px'
            },
            lineHeight: {
                type: String,
                default: '50px'
            },
            popupContainer: {
                type: Function,
                default: () => document.body,
            },
            position: {
                type: String,
                default: 'absolute',
            },
            placement: {
                required: false,
                type: String,
                default: 'bottomLeft',
            },
            placementXAbs: {
                required: false,
                type: Number,
                default: 0,
            },
            trigger: {
                required: false,
                type: String,
                default: 'hover',
                validator: (value) => {
                    const find = Trigger.indexOf(value) !== -1;
                    return find;
                },
            },
            data: {
                required: false,
                type: Array,
            },
        },
        data: () => ({
            style: {},
            container: null,
            isOpen: false,
        }),
        computed: {
            ...mapState({
                dropDownFlag: state => state.ui.dropDownFlag
            })
        },
        watch: {
            dropDownFlag() {
                this.isOpen = false
            },
            isOpen() {
             this.setPosition();
            }
        },
        mounted() {
            this.container = this.popupContainer();
            this.$refs.content.style.position = this.position;
            this.container.appendChild(this.$refs.content);
            this.$nextTick(() => {
                this.setPosition();
            });
            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTimer);
                this.resizeTimer = setTimeout(() => {
                    this.setPosition();
                }, 200);
            });
            this.initEvent();
        },
        created() {
            this.$on('showSubmenu', () => {
                clearTimeout(this.timeout);
            });
            this.$on('itemClicked', (item, $event) => {
                this.$emit('item-click', item, $event);
            });
        },
        beforeDestroy() {
            this.container.removeChild(this.$refs.content);
            document.removeEventListener('click', this.close);
        },
        methods: {
            ...mapMutations({
                resetDropdown: 'RESET_DROPDOWN'
            }),
            setPosition() {
                if (!this.$el) {
                    return;
                }
                const p = getOffset(this.$el, this.container);
                switch (this.placement) {
                  case 'bottomLeft':
                      this.style = {
                          top: `${p.bottom + 5}px`,
                          left: `${p.left + this.placementXAbs}px`,
                      };
                    break;
                  case 'bottomRight':
                      this.style = {
                          top: `${p.bottom + 5}px`,
                          right: `${p.right - p.left - 7 + this.placementXAbs}px`,
                      };
                    break;
                  default:
                    break;
                }

            },
            initEvent() {
                const {
                    trigger, titleMouseEnter, titleMouseLeave,
                    mouseEnter, mouseLeave, click
                } = this;
                const dropdownElm = this.$refs.dropdown;
                const contentElm = this.$refs.content;
                if (trigger === 'hover') {
                    dropdownElm.addEventListener('mouseenter', titleMouseEnter, false);
                    dropdownElm.addEventListener('mouseleave', titleMouseLeave, false);
                    contentElm.addEventListener('mouseenter', mouseEnter, false);
                    contentElm.addEventListener('mouseleave', mouseLeave, false);
                } else if (trigger === 'click') {
                    dropdownElm.addEventListener('click', click);
                }
                document.addEventListener('click', this.close);
            },
            click(event) {
                event.stopPropagation();
                let initOpen = this.isOpen
                this.resetDropdown()
                setTimeout(() => {
                    this.isOpen = !initOpen;
                }, 0)

            },

            mouseEnter() {
                clearTimeout(this.timeout);
                this.isOpen = true;
            },
            mouseLeave() {
                this.timeout = setTimeout(() => {
                    this.isOpen = false;
                }, 200);
            },
            titleMouseEnter() {
                clearTimeout(this.timeout);
                this.isOpen = true;
            },
            titleMouseLeave() {
                this.timeout = setTimeout(() => {
                    this.isOpen = false;
                }, 200);
            },
            close() {
                if (this.isOpen) {
                    this.isOpen = false;
                    this.broadcast('DropdownMenu', 'hideSubmenu', this);
                }
            },
        },
    };
</script>
<style lang="stylus">
@import '../../assets/stylus/variable.styl';
@import '../../assets/stylus/mixin.styl';

.el-dropdown {
    position: absolute;
    z-index: $zindex-dropdown;
    display: block;
    font-size: $font-size-base;
    font-weight: normal;
    line-height: 1.5;
    transition: all 0.1s ease;

    &.fade-enter-active, &.fade-up-leave-active {
        transform: scaleY(1);
        opacity: 1;
        /* transform: scaleY(.8) */
    }

    &.fade-enter, &.fade-leave-active {
        opacity: 0;
    }

    &.el-dropdown-placement-bottomRight {
        right: -9999px;
        left: auto;

        .el-dropdown-menu {
            .el-dropdown-menu-submenu-title {
                text-align: right;

                &:after {
                    right: auto;
                    left: 8px;
                    content: '\e6e1';
                }
            }

            .el-dropdown-menu-submenu-vertical > .el-dropdown-menu {
                left: auto;
                right: 110%;
            }
        }
    }

    &-wrap {
        position: relative;
    }

    &-hidden, &-menu-hidden {
        opacity: 0;
    }

    &-menu {
        transition: all 0.5s ease;
        outline: none;
        position: relative;
        list-style-type: none;
        padding: 5px 0;
        margin: 0;
        text-align: left;
        background-color: $component-background-gray;
        border-radius: 0;
        box-shadow: $box-shadow-base;
        background-clip: padding-box;

        &-item, &-submenu-title {
            position: relative;
            max-width: 170px;
            min-width: 90px;
            padding: 10px 18px;
            margin: 0;
            clear: both;
            font-size: 16px;
            font-weight: normal;
            color: $color-explain;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.1s;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;

            > a {
                color: $color-explain;
                display: block;
                padding: 7px 8px;
                margin: -7px -8px;
                transition: all 0.1s;

                &:focus {
                    text-decoration: none;
                }
            }

            &-selected, &-selected > a {
                color: $primary-color;
                background-color: tint($primary-color, 90%);
            }

            &:hover {
                background-color: tint($primary-color, 90%);
            }

            &-disabled {
                color: $disabled-color;
                cursor: not-allowed;

                &:hover {
                    color: $disabled-color;
                    background-color: $component-background;
                    cursor: not-allowed;
                }
            }

            &:first-child, &:first-child > a {
                border-radius: $border-radius-base $border-radius-base 0 0;
            }

            &:last-child, &:last-child > a {
                border-radius: 0 0 $border-radius-base $border-radius-base;
            }

            &:only-child, &:only-child > a {
                border-radius: $border-radius-base;
            }

            &-divider {
                height: 1px;
                overflow: hidden;
                background-color: $border-color-split;
                line-height: 0;
            }
        }

        &-submenu-title:after {
            font-family: 'iconfont';
            position: absolute;
            content: '\e65a';
            right: 8px;
            color: $color-explain;
            font-size: 12px;
        }

        &-submenu-vertical {
            position: relative;
        }

        &-submenu-vertical > & {
            top: 0;
            left: 110%;
            position: absolute;
            min-width: 100%;
            margin-left: 4px;
            transform-origin: 0 0;
        }

        &-submenu:first-child &-submenu-title {
            border-radius: $border-radius-base $border-radius-base 0 0;
        }

        &-submenu:last-child &-submenu-title {
            border-radius: 0 0 $border-radius-base $border-radius-base;
        }
    }
}
</style>

