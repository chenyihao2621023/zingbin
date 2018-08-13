<template>
    <div class="dinnerClazz" style="height: 100%;">
        <zing-head :title="'菜品分类'">
            <div slot="header-right">
                <span class="header-jiahao">
                    <i class="iconfont icon-gengduo" @click="addClazz"></i>
                </span>
            </div>
        </zing-head>
        <div class="scroll-list-wrap">
            <!--<scroll ref="scroll" :data="[]" :scrollbar="true" :startY="0" :pullUpLoad="{threshold: 0, txt: {more: '', noMore: ''} }">-->
                <ul v-if="clazzDataList.length > 0">
                    <li v-for="(item,index) in clazzDataList" :key="index">
                        <GridCard v-if="item.orderStatus !== '1'">
                            <div slot="cardLeft" class="left">
                                <div class="left-wrapper">
                                    {{item.dinnerClazzName}}
                                </div>
                            </div>
                            <div slot="cardRight" class="right">
                                <i class="iconfont icon-gengduo" @click="showMoreModal(item)"></i>
                            </div>
                        </GridCard>
                    </li>
                </ul>
                <ul v-show="clazzDataList.length < 1">
                    <div class="no-data-style">
                        还没有添加菜品分类
                    </div>
                </ul>
            <!--</scroll>-->
        </div>
        <x-dialog v-model="showMoreDialog" hide-on-blur>
            <div class="menu" @click="editMethod">编辑</div>
            <div class="menu" @click="deleteMethod">删除</div>
        </x-dialog>
        <div v-transfer-dom>
            <popup v-model="addClazzModal" position="right" style="width: 100%;">
                <popup-header :left-text="'取消'" :right-text="'确定'" :title="editTitle" :show-bottom-border="false"
                    @on-click-left="addClazzModal = false" @on-click-right="confirmSubmit"></popup-header>
                <group gutter="0">
                    <x-input title="分类名称" placeholder="输入分类名称" v-model="editTarget.dinnerClazzName"></x-input>
                    <x-input title="显示顺序" mask="999999999" type="number" placeholder="只允许输入数字"
                             v-model="editTarget.clazzSort" @on-change="changeNum"></x-input>
                    <x-switch v-model="editTarget.isDiscount" title="是否可优惠"></x-switch>
                </group>
            </popup>
        </div>
        <loading v-model="showLoading"></loading>
    </div>
</template>

<script>
    import { XDialog,XSwitch,XInput,Group,PopupHeader,Popup,Loading ,TransferDomDirective as TransferDom } from "vux";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import ZingHead from "@/components/zingHead/ZingHead";

    export default {
        name: "dinnerClazz",
        directives: {
            TransferDom
        },
        components: {
            Scroll, GridCard, ZingHead, XDialog,XSwitch,XInput,Group,PopupHeader,Popup,Loading
        },
        data() {
            return {
                pageError:true,
                addClazzModal : false,
                showMoreDialog: false,
                clazzDataList: [],
                editTitle:"",
                editTarget:{},
                editModal:false,
                showLoading:false,
            }
        },
        watch:{
            editTarget:{
                handler(curVal,oldVal) {
                    if (this.editTarget.isDiscount === "1") {
                        this.editTarget.isDiscount = true;
                    }
                    if (this.editTarget.isDiscount === "0") {
                        this.editTarget.isDiscount = false;
                    }
                },
                deep:true
            },
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                let self = this;
                let url = "/zingbiz/dinner/getDinnerClazzList";
                let param = {
                    pageNumber:"0",
                    pageSize:"1000"
                };
                this.$http
                    .get(url, { params :param })
                    .then(res => {
                        if (res.data.success) {
                            if(res.data.data.data) {
                                self.clazzDataList = res.data.data.data;
                                self.pageError = false;
                            }
                        } else {
                            self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    }).catch(error => {
                        self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                })
            },
            changeNum(val) {
                if (val && val.length > 9) {
                    this.editTarget.clazzSort = ""
                }
            },
            showMoreModal(item) {
                this.showMoreDialog = true;
                this.editTarget = Object.assign({}, item);
            },
            addClazz() {
                this.editTitle = "添加分类";
                this.editTarget = {};
                this.showMoreDialog = false;
                this.addClazzModal = true;
            },
            editMethod() {
                this.editTitle = "编辑分类";
                this.addClazzModal = true;
                this.showMoreDialog = false;
            },
            confirmSubmit() {
                if (!this.editTarget.dinnerClazzName) {
                    this.$vux.toast.text("分类名称不能为空", 'bottom')
                    return false
                }
                this.addClazzModal = false;
                if (this.editTarget.isDiscount === true) {
                    this.editTarget.isDiscount = "1";
                } else {
                    this.editTarget.isDiscount = "0";
                }
                let self = this;
                let url = "";
                if (this.editTitle === "添加分类") {
                    url = "/zingbiz/dinner/addDinnerClazz";
                } else if (this.editTitle === "编辑分类") {
                    url = "/zingbiz/dinner/updateDinnerClazz";
                }
                self.$vux.loading.show({
                    text: ''
                })
                this.$http
                    .post(url, this.editTarget)
                    .then(res => {
                        self.$vux.loading.hide()
                        if (res.data.success) {
                            self.$vux.toast.show({ text:"保存成功", type:"success" });
                            this.initData();
                        } else {
                            self.$vux.toast.show({ text:"保存失败", type:"cancel" })
                        }
                    }).catch(error => {
                        self.$vux.toast.show({ text:"保存失败", type:"cancel" })
                })
            },
            deleteMethod() {
                this.showMoreDialog = false;
                let self = this;
                this.$vux.confirm.show({
                    title: '提示',
                    content: '确定删除此分类吗?',
                    onCancel () { self.$vux.confirm.hide(); },
                    onConfirm () {
                        self.showLoading = true;
                        let url = "/zingbiz/dinner/delDinnerClazz";
                        let param = { dinnerClazzId : self.editTarget.dinnerClazzId };
                        self.$vux.loading.show({
                            text: ''
                        })
                        self.$http
                            .get(url, { params:param })
                            .then(res => {
                                self.$vux.loading.hide()
                                self.showLoading = false;
                                if (res.data.success) {
                                    self.$vux.toast.show({ text:"删除成功", type:"success" });
                                    self.initData();
                                } else {
                                    self.$vux.toast.show({ text:res.data.mgs, type:"cancel" })
                                }
                            })
                            .catch(error => {
                                self.showLoading = false;
                                self.$vux.toast.show({ text:"删除失败", type:"cancel" })
                            })
                    }
                })
            },
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .vux-popup-header-right {
        color: #ff8000 !important;
    }
    .weui-dialog__btn_primary {
        color: #ff8000 !important;
    }
    .dinnerClazz {
        height: 100%;
        .no-data-style{
            margin-top: 20px;
            text-align: center;
            font-size: 18px;
            color: #ff8000;
        }
        .menu {
            height : 40px;
            line-height: 40px;
        }
        .weui-cell_warn{
            color : black !important
        }
        .scroll-list-wrap {
            position: relative;
            height: calc(100% - 50px);
            border-radius: 4px;
            transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
            overflow: auto;
            .left {
                flex: 1;
                flex-center(row, start, center);
                .iconfont{
                    font-size 36px
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
            .right {
                flex: 1;
                text-align: right;

                .tag-wrapper {
                    margin-top: 10px;

                    &.tag + .tag {
                        margin-left: 10px;
                    }
                }
            }
            .classifi-left {
                &-name {
                    margin-bottom: 10px;
                }
                &-tag-wrapper {
                    &.tag + .tag {
                        margin-left: 10px;
                    }
                }
            }
            .classifi-right {
                align-self: flex-start;
            }
            .edit {
                min-height: 40px;
                line-height: 40px;
            }
        }
    }
</style>

