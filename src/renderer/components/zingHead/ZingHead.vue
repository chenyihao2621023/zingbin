

<template>
    <div class="main-header">
         <!-- <img src="/JsLib/dist/app/images/yingshang.png" v-show="imgconfig()" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.zinglabs.zingmsg"  class="header-img" > -->
        <div class="header-left" >
            <slot name="header-left">
                <div class="zuojiantou-wrapper" @click="comeback()">
                    <i class="iconfont icon-zuojiantou" ></i>
                </div>
                <div class="guanbi-wrapper" v-show="showClose" @click="goToMessageList">
                    <i class="iconfont icon-guanbi"></i>
                </div>
            </slot>
        </div>
        <div class="header-center" >
            <slot v-if="!title" name="center"></slot>
            <div v-else-if="!popupPickerData.length">{{title}}</div>
            <div v-if="!title && popupPickerData.length">
                <popup-picker
                    :show.sync="showPopupPicker"
                    :data="popupPickerData"
                    :columns="columns"
                    ref="picker"
                    :show-cell="false"
                    @on-change="onChange"
                    @on-hide="onHide"
                    >
                </popup-picker>
                <div class="popup-button" @click="showPopupPicker = true">
                    <span>{{popupTitle}}</span>
                    <span class="down-arrow"></span>
                </div>
            </div>
        </div>
        <div class="header-right">
            <slot name="header-right">
            </slot>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { PopupPicker } from "vux";
import { isMhApp } from "../../utils/fn";
    export default {
        components: {
            PopupPicker
        },
        props: {
            title: {
                type: String
            },
            isComeBack: {
                type: Boolean,
                default: true
            },
            cancelText: {
                type: String,
                default: ''
            },
            popupPickerData: {
                type: Array,
                default() {
                    return []
                }
            },
            popupTitle: {
                type: String
            },
            showClose: {
                type: Boolean,
                default: true
            },
            columns:{
                type:Number,
                default:2
            },
            isToMessage: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                showPopupPicker: false,
            }
        },
        methods: {
            onHide(closeType) {
                this.$emit('popup-onhide',closeType, this.$refs.picker)
            },
            comeback: function () {
                if (this.isComeBack) {
                    this.$router.back(-1)
                } else {
                    this.$emit("doSome")
                }
            },
            goToMessageList() {
                if (this.isToMessage) {
                    this.$router.push('/messagelist')
                } else {
                    this.$emit("close")
                }
            },
            imgconfig() {
              return !isMhApp();
            },
            onChange(value) {
                this.$emit('popup-change',value, this.$refs.picker)
            }

        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    .main-header {
        height 50px
        line-height 50px
        background-color #f5f5f5
        position relative
        box-shadow: 1px 1px 2px #e5e5e5
        .header-left {
            flex-center(row, start, center)
            position absolute
            // padding-left 13px
            top: 50%
            transform translateY(-50%)
            .zuojiantou-wrapper {
                height 50px
                width 50px
                flex-center(row, center, center)
                .iconfont {
                    font-size 20px
                }
            }
            .guanbi-wrapper {
                height 50px
                width 50px
                flex-center(row, center, center)
                .iconfont {
                    font-size 20px
                }
            }
        }
        .header-center {
            position absolute
            left 50%
            top: 50%
            transform translate(-50%, -50%)
            font-size 18px
            .popup-button {
                flex-center(row, center, center)
                .down-arrow {
                    position: relative;
                    margin-left: 4px;
                    width: 7px;
                    height: 7px;
                    border-top: 2px solid #c8c8cd;
                    border-right: 2px solid #c8c8cd;
                    transform: rotate(135deg);
                    margin-left: 6px;
                }
            }

        }
        .header-right {
            position absolute
            right 0
            top: 50%
            transform translateY(-50%)
            /* 修复inline-block受font-size的影响 */
            font-size 0
            & > div > * {
                font-size 14px
            }
            .header-search {
                display inline-block
                width 50px
                padding 12.5px
                .icon-fangdajing {
                    font-size 25px
                }
            }
        }
    }
</style>
<style lang="stylus" rel="stylesheet/stylus">
    .header-jiahao {
        display inline-block
        width 50px
        line-height 50px
        /*padding 12.5px*/
        padding-left 12.5px
        /* 修复inline-block受font-size的影响 */
        font-size 0 !important
        & > * {
            font-size 14px !important
        }
        .icon-gengduo {
            font-size 30px !important
            color black !important
        }
    }
    .header-img {
          height: 30px;
                    width: 50px;
                    position: absolute;
                    left: 100px;
                    top: 10px;
    }
</style>
