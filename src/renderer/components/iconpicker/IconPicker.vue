<template>
    <div class="icon-picker">
        <x-dialog v-model="iconPickerShow" :dialog-style="{zIndex: dialogZIndex}" class="icon-picker-dialog"
                  dialog-transition="ei-dialog" :mask-z-index="maskZIndex">
            <div class="icon-picker-header">
                <div class="icon-picker-header-title">选择图标</div>
                <div class="icon-picker-header-close" @click="handleClose">
                    <i class="iconfont icon-fenlei"></i>
                </div>
            </div>
            <div class="icon-picker-content">
                <div
                    class="icon-picker-content-avatar-wrapper"
                    v-for="(item, index) in data"
                    :key="index"
                    @click="selectIcon(item)">
                    <avatar :icon="item.name" shape="square" size="large" :style="{background: bgColor}"></avatar>
                    <transition name="fade" mode="out-in">
                        <div class="icon-picker-content-avatar-wrapper-active"
                             v-if="multiple ? item.selected : item.name === activeName">
                            <i class="iconfont icon-xuanze2"></i>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="icon-picker-footer">
                <flexbox>
                    <flexbox-item>
                        <x-button type="primary" @click.native="cancel" class="btn-save">取消</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button type="default" @click.native="confirm" class="btn-common">确定</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
        </x-dialog>
    </div>
</template>

<script>
    import { XDialog, Flexbox, FlexboxItem, XButton } from "vux";
    import Avatar from "../avatar/Avatar";
    export default {
        name: "IconPicker",
        components: {
            XDialog,
            Avatar,
            Flexbox,
            FlexboxItem,
            XButton
        },
        props: {
            iconPickerShow: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            iconData: {
                type: Array,
                default() {
                    return [];
                }
            },
            multiple: {
                type: Boolean,
                default() {
                    return false;
                }
            },
            bgColor: {
                type: String,
                default() {
                    return "";
                }
            },
            maskZIndex: {
                type: Number,
                default() {
                    return 1000;
                }
            },
            dialogZIndex: {
                type: Number,
                default() {
                    return 5000;
                }
            }
        },
        data() {
            return {
                data: [],
                activeName: ""
            };
        },
        mounted() {
            this.initData(this.iconData);
        },
        methods: {
            handleClose() {
                this.$emit("close");
            },
            selectIcon(item) {
                item.selected = !item.selected;
                this.activeName = item.name;
            },
            confirm() {
                if (this.multiple) {
                    let arr = this.data.filter(item => {
                        return item.selected;
                    });
                    this.$emit("confirm", arr);
                } else {
                    this.$emit("confirm", this.activeName);
                }
            },
            cancel() {
                this.$emit("cancel");
            },
            initData(data) {
                let arr = [];
                data.forEach(item => {
                    arr.push({
                        name: item,
                        selected: false
                    });
                });
                this.data = arr;
            }
        },
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .icon-picker {
        .weui-dialog {
            width: 92%;
        }
        &-header {
            flex-center(start, space-between, center);
            padding: 20px;
            background-color: #fff;

            &-title {
                position: relative;
                left: 50%;
                transform: translateX(-50%);
                color: black;
            }
        }

        &-content {
            flex-center(row, start, center);
            flex-wrap: wrap;
            padding-top: 10px;
            padding-left: 10px;
            &-avatar-wrapper {
                padding: 10px;
                position: relative;

                &-active {
                    position: absolute;
                    right: 2px;
                    top: 2px;
                    color: red;

                    &.fade-enter-active, &.fade-leave-active {
                        transition: opacity 0.2s;
                    }

                    &.fade-enter, &.fade-leave-to {
                        opacity: 0;
                    }
                }
            }
        }

        &-footer {
            padding: 10px 20px;
        }

        .iconfont {
            font-size: 30px;
        }
    }
</style>

