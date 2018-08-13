<template>
    <div class="dinnerTag" style="height: 100%">
        <zing-head :title="'标签设置'">
            <div slot="header-right">
                <span class="header-jiahao">
                    <i class="iconfont icon-gengduo" @click="addModal = true,labelName=''"></i>
                </span>
            </div>
        </zing-head>
        <div class="scroll-list-wrap" style="height: calc(100% - 50px);overflow: auto;">
            <!--<scroll ref="scroll" :scrollbar="true" :data="[]" :startY="0" @pullingUp="onPullingUp" :pullUpLoad="{threshold: 0, txt: {more: '', noMore: ''} }">-->
                <ul v-if="tagData.length > 0">
                    <li v-for="(item,index) in tagData" :key="index">
                        <GridCard>
                            <div slot="cardLeft" class="left">
                                <div class="left-wrapper">
                                    <p>{{item.labelName}}</p>
                                </div>
                            </div>
                            <div slot="cardRight" class="right">
                                <i class="iconfont icon-gengduo" @click="showMoreModal(item)"></i>
                            </div>
                        </GridCard>
                    </li>
                </ul>
                <ul v-show="tagData.length < 1">
                    <div class="no-data-style">
                        还没有添加标签
                    </div>
                </ul>
            <!--</scroll>-->
        </div>
        <x-dialog v-model="showMoreDialog" hide-on-blur>
            <div class="edit" @click="editMethod">编辑</div>
            <div class="edit" @click="deleteMethod">删除</div>
        </x-dialog>
        <popup v-model="editModal" height="100%" width="100%" position="right">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="'编辑标签'" :show-bottom-border="false"
                          @on-click-left="editModal = false" @on-click-right="confirmEdit">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <group>
                    <x-input title="标签名称：" v-model="editTarget.labelName"></x-input>
                </group>
            </div>
        </popup>
        <popup v-model="addModal" height="100%" width="100%" position="right">
            <popup-header :left-text="'取消'" :right-text="'确定'" :title="'添加标签'" :show-bottom-border="false"
                          @on-click-left="addModal = false" @on-click-right="confirmAdd">
            </popup-header>
            <div style="height: calc(100% - 44px);overflow: auto;background: #fff;">
                <group>
                    <x-input title="标签名称：" v-model="labelName"></x-input>
                </group>
            </div>
        </popup>
    </div>
</template>

<script>
    import { Popup,PopupHeader,XInput,XDialog,Confirm } from "vux";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import ZingHead from "@/components/zingHead/ZingHead";

    export default {
        name: "tagManager",
        components: {
            Popup,PopupHeader,XInput,Scroll, GridCard, ZingHead, XDialog,Confirm
        },
        data() {
            return {
                labelName:"",
                pageError:true,
                showMoreDialog: false,
                tagData: [],
                editTarget:{},
                editModal:false,
                addModal : false
            }
        },
        created() {
            this.initData();
        },
        methods: {
            initData() {
                let self = this;
                let url = "/zingbiz/dinner/getLabelList";
                let param = {
                    pageNumber: 1,
                    pageSize: 1000
                };
                this.$http
                    .get(url, { params:param })
                    .then(res => {
                        if (res.data.success) {
                            if (res.data.data.data) {
                                self.tagData = res.data.data.data;
                                self.pageError = false;
                            }
                        } else {
                            self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                        }
                    }).catch(error => {
                        self.$vux.toast.text("加载数据失败，请重试", 'bottom')
                })
            },
            onPullingUp() {
                setTimeout(() => {
                    if (this._isDestroyed) {
                        return;
                    }
                    if (Math.random() > 0.5) {
                        // 如果有新数据
                        this.$refs.scroll.forceUpdate();
                    } else {
                        // 如果没有新数据
                        this.$refs.scroll.forceUpdate();
                    }
                }, 1500);
            },
            showMoreModal(item) {
                this.showMoreDialog = true;
                this.editTarget = item;
            },
            editMethod() {
                this.editModal = true;
                this.showMoreDialog = false;
            },
            confirmEdit() {
                if (!this.editTarget.labelName) {
                    this.$vux.toast.text("标签名称不能为空", 'bottom')
                    return false
                }
                this.editModal = false
                let self = this;
                let params = {
                    labelId: this.editTarget.labelId,
                    labelName:this.editTarget.labelName
                };
                let url = "/zingbiz/dinner/saveOrUpdateDinnerLabel";
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (res.data.success) {
                            self.$vux.toast.show({ text:"保存成功", type:"success" });
                            self.initData();
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
                    content: '确定删除此标签吗?',
                    onCancel () { self.$vux.confirm.hide(); },
                    onConfirm () {
                        let url = "/zingbiz/dinner/delDinnerLabel";
                        let param = { labelId : self.editTarget.labelId };
                        self.$http
                            .get(url, { params:param })
                            .then(res => {
                                if (res.data.success) {
                                    self.$vux.toast.show({ text:"删除成功", type:"success" });
                                    self.initData();
                                } else {
                                    self.$vux.toast.show({ text:"删除失败", type:"cancel" })
                                }
                            })
                            .catch(error => {
                                self.$vux.toast.show({ text:"删除成功", type:"cancel" })
                            })
                    }
                })
            },
            confirmAdd() {
                if (!this.labelName) {
                    this.$vux.toast.text("标签名称不能为空", 'bottom')
                    return false
                }
                this.addModal = false
                let self = this;
                let params = {
                    labelName:this.labelName
                };
                let url = "/zingbiz/dinner/saveOrUpdateDinnerLabel";
                this.$http
                    .post(url, params)
                    .then(res => {
                        if (res.data.success) {
                            self.$vux.toast.show({ text:"保存成功", type:"success" });
                            self.initData();
                        } else {
                            self.$vux.toast.show({ text:"保存失败", type:"cancel" })
                        }
                    }).catch(error => {
                        self.$vux.toast.show({ text:"保存失败", type:"cancel" })
                })
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .dinnerTag {
        .edit {
            height : 40px;
            line-height: 40px;
        }
        .no-data-style{
            margin-top: 20px;
            text-align: center;
            font-size: 18px;
            color: #ff8000;
        }
    }
    .weui-dialog__btn_primary {
        color: #ff8000 !important;
    }
</style>

