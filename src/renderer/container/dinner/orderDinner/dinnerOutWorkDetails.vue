<template>
    <div class="dinnerOutWork">
        <popup v-model="dinnerOutWorkShow" height="100%" width="100%" position="right">
            <popup-header :left-text="'取消'" :right-text="'结班'" :title="'结班明细'" :show-bottom-border="false"
                          @on-click-left="outWorkBack" @on-click-right="outWork">
            </popup-header>
            <div class="tab-content">
                <el-table
                    :show-header="false"
                    :data="restaurantList"
                    style="width: 100%"
                    height="calc(100%)"
                    border
                    stripe
                >
                    <el-table-column
                        prop="title"
                        label=""
                    >
                    </el-table-column>
                    <el-table-column
                        prop="money"
                        label=""
                    >
                    </el-table-column>
                </el-table>
            </div>
            <!--<div class="btnList">
                <group>
                    <flexbox :gutter="0">
                        <flexbox-item><x-button class="btn-common" type="primary" :style="{height:'50px'}" >打印</x-button></flexbox-item>
                     </flexbox>
                </group>
            </div>-->
        </popup>
    </div>
</template>

<script>
    import {
        Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup, Flexbox,PopupHeader,
        FlexboxItem, XButton
    } from 'vux'

    import ZingHead from "@/components/zingHead/ZingHead";
    import FormDialog from '@/components/formdialog/FormDialog'
    import Dropdown from "@/components/dropdown/Dropdown";
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";

    export default {
        name: "qiantaijiebanmingxi",
        components: {
            ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup, PopupHeader,
            Flexbox, FlexboxItem, XButton, FormDialog,Dropdown
        },
        props: {
            dinnerOutWorkShow: {
                type: Boolean,
                default: false
            },
            outWorkDetails:{},
            userLogin:{}
        },
        data() {
            return {
                restaurantList: [],
                isPc:false,
            }
        },
        watch:{
            outWorkDetails : {
                handler(curVal,oldVal) { //
                    this.getDataListByIndex();
                },
                deep:true
            },
        },
        methods: {
            getDataListByIndex() {
                let self = this;
                var url = "/zingbiz/report/restaurant_report/getWorkPeriodDetailStream";
                self.$http.get(url, { params:this.outWorkDetails }).then(res => {
                    let dataTemp = res.data;
                    if (dataTemp && dataTemp.data) {
                        let rd = dataTemp.data;
                        self.restaurantList = rd;
                    }
                    self.restaurantList.splice(0,0,{
                        money:this.userLogin.cardUrlName,
                        title:"操作员"
                    })
                    console.log(self.restaurantList)
                });
            },
            outWork() {
                this.$emit("outWork")
            },
            outWorkBack() {
                this.$emit("outWorkBack")
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .tab-content {
        height calc(100% - 95px);
    }

    .dinnerOutWork {
        height 100%;

        .scroll-list-wrap {
            position: relative;
            height: 100%;
            border-radius: 4px;
            transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: hidden;

            .left {
                flex: 1;
                flex-center(row, start, center);

                .iconfont {
                    font-size: 36px;
                }

                &-wrapper {
                    margin-left: 10px;
                    flex: 1;

                    &-title {
                        font-size: $font-size-base + 2px;
                        margin-bottom: 6px;
                        cursor: pointer;
                    }

                    &-desc {
                        width: 160px;
                        color: #ddd;
                        cursor: pointer;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }

    }
</style>



