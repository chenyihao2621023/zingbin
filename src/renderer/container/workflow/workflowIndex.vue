<template>
    <div style="height: 100%;">
        <ZingHead :title="title">
            <div slot="header-right">
        <span class="header-jiahao">
          <i class="iconfont icon-gengduo" @click="handleMenu"></i>
        </span>
            </div>
        </ZingHead>
        <div class="scroll-list-wrap" :style="{ height: screenHeight  + 'px',overflow:'auto' }">
            <scroll ref="scroll" :data="workflowData" :scrollbar="true" :startY="0"
                    :pullUpLoad="{threshold: 0, txt:  {more: 'more', noMore: 'noMore'} }"
                    @pullingUp="onPullingUp">
                <GridCard v-for="(item,index) in workflowData" :key="index">
                    <div slot="cardLeft" class="left" @click="toNewPpage(item)">
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{item.serialNumberForType}}:{{item.categoryName}}</p>
                            <tag v-if="item.isDeleteForType=='禁用'" color="#20a0ff"
                                 size="large"
                            >
                                已禁用
                            </tag>
                        </div>
                    </div>
                    <div slot="cardRight" class="right">
                        <a style="width:40px;height: 40px;" class="iconfont icon-gengduo" @click="selItem(item)"></a>
                    </div>
                </GridCard>
            </scroll>
        </div>
        <actionsheet v-model="showDialog" :menus="menuNodes" theme="android" @on-click-menu="click">
        </actionsheet>
        <confirm v-model="showConfirm" :title="'提示'" @on-cancel="onCancel" @on-confirm="onConfirm">
            <p style="text-align:center;">是否确认执行此操作？</p>
        </confirm>
        <workform :modelTitle="modelTitle" :showPopupDate="isShow" :getFormData="getFormData" @backClick="clickBack" @submitClick="submit" @cancleclick="cancle"></workform>
    </div>
</template>
<script>
    import {
        Confirm,
        Actionsheet,
        Group,
        XButton,
        Flexbox,
        FlexboxItem,
        XInput,
        Selector
    } from "vux";
    import Scroll from "../../components/scroll/Scroll";
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from "@/components/gridcard/GridCard";
    import workform from "@/container/workflow/workflowType/workflowFormEdit";
    import Tag from '@/components/tag/Tag.vue'
    export default {
        components: {
            Scroll,
            GridCard,
            workform,
            ZingHead,
            Confirm,
            XInput,
            Selector,
            Flexbox,
            FlexboxItem,
            Actionsheet,
            Group,
            XButton,
            Tag
        },
        data() {
            return {
                getFormData: {},
                isShow: false,
                screenHeight: 0,
                modelTitle: "",
                showDialog: false, //三个点标识
                title: "审批流分类",
                showToast: false, // 属性修改窗口
                showConfirm: false, // 禁止分类窗口
                curItem: {},
                menuNodes: [
                    {
                        label: "属性修改",
                        value: "update"
                    },
                    {
                        label: "禁用分类",
                        value: "forbid"
                    }
                ],
                workflowData: [],
                pageNumber:1,
                pageSize:20,
            };
        },
        created() {
            let vm = this;
            vm.getDatas();
            this.screenHeight = document.documentElement.clientHeight - 100;
        },
        methods: {

            onPullingUp() {
                let self = this;
                setTimeout(() => {
                    self.getDatas();
            }, 1000);
            },
            handlePaging(_data){
                let self = this;
                //默认都有下一页数据
                self.pageNumber++;
                if(_data!=undefined && _data.length<self.pageSize){
                    this.$refs.scroll.forceUpdate(false);
                }else{
                    this.$refs.scroll.forceUpdate(true);
                }

            },
            getDatas() {
                let vm = this;
                let url = "/zingbiz/workflow/typeAndTemplate/loadAllType";
                let params = {
                    pageSize: vm.pageSize,
                    pageNumber: vm.pageNumber
                };
                vm.$http.post(url, params).then(res => {
                    if (res.data.data.total > 0) {
                    let _data = res.data.data.data;
                    _data.forEach(item => {
                        if(item!=undefined){
                        vm.workflowData.push(item);
                    }
                });
                    vm.handlePaging(_data);
                } else {
//                    vm.$vux.toast.text("没有搜索到结果",'top');
                }
            });
            },
            toNewPpage(item) {
                this.$router.push({
                    path: "workflowTemplate",
                    query: {
                        categoryId: item.categoryId,
                        moduleType: item.moduleType
                    }
                });
            },
            getAddData() {
                let vm = this;
                let url = "";
                let params = {};
                if (vm.getFormData.type === "update") {
                    url = "/zingbiz/workflow/typeAndTemplate/updateOneType";
                } else {
                    url = "/zingbiz/workflow/typeAndTemplate/addOneType";
                }
                if (
                    vm.getFormData.categoryName === undefined ||
                    vm.getFormData.categoryName === ""
                ) {
                    vm.$vux.toast.text("请输入审批流分类名称",'top');
                    return;
                }
                if (
                    vm.getFormData.serialNumberForType === undefined ||
                    vm.getFormData.serialNumberForType === ""
                ) {
                    vm.$vux.toast.text("请输入顺序号",'top');
                    return;
                }
                if (vm.getFormData.serialNumberForType <1 || vm.getFormData.serialNumberForType >999) {
                    vm.$vux.toast.text("顺序号范围1~999",'top');
                    return;
                }
                if (
                    vm.getFormData.moduleType === undefined ||
                    vm.getFormData.moduleType === ""
                ) {
                    vm.$vux.toast.text("请选择功能模块",'top');
                    return;
                }
                params = {
                    categoryName: vm.getFormData.categoryName,
                    serialNumberForType: vm.getFormData.serialNumberForType,
                    moduleType: vm.getFormData.moduleType
                };
                let categoryId = vm.curItem.categoryId
                    ? { categoryId: vm.curItem.categoryId }
                    : {};
                params = Object.assign({}, params, categoryId);
                vm.$http.post(url, params).then(res => {
                    if (res.data.success === "true") {
                    vm.reloadData();
                    vm.$vux.toast.text("操作成功！",'top');
                    vm.isShow = false;

                } else {
                    vm.$vux.toast.text("操作异常，请稍后重试！",'top');
                }
            });
            },
            submit() {
                this.getAddData();
            },
            cancle() {
                this.isShow = false;
            },
            clickBack() {
                this.isShow = false;
            },
            onCancel() {
                console.log("on cancel");
            },
            onConfirm() {
                let vm = this;
                let type = "";
                let url = "/zingbiz/workflow/typeAndTemplate/disableOrEnableOneType";
                console.info(vm.curItem);
                if (vm.menuNodes[1].label === "禁用分类") {
                    type = "禁用";
                } else {
                    type = "启用";
                }
                let params = {
                    categoryId: vm.curItem.categoryId,
                    isDeleteForType: type
                };
                console.info(params);
                vm.$http.post(url, params).then(res => {
                    console.info(res.data);
                if (res.data.success === "true") {
                    vm.reloadData();
                    vm.$vux.toast.text("操作成功！",'top');
                } else {
                    vm.$vux.toast.text(res.data.mgs,'top');
                }
            });
            },
            handleMenu(data) {
                //下拉菜单
                this.modelTitle = "添加";
                this.isShow = true;
                this.getFormData.type = "add";
                this.getFormData = {
                    categoryName: "",
                    serialNumberForType: "",
                    moduleType: ""
                };
            },
            click(key, item) {
                let vm = this;
                if (key === "update") {
                    this.isShow = true;
                    vm.modelTitle = "属性修改";
                    console.info(vm.curItem);
                    vm.getFormData = vm.curItem;
                    vm.getFormData.type = "update";
                    vm.getFormData.moduleType = vm.curItem.moduleType;
                } else {
                    vm.showConfirm = true;
                }
            },
            selItem(item) {
                //显示三个点弹框
                let vm = this;
                this.showDialog = true;
                vm.curItem = item;
                if (item.isDeleteForType === "启用") {
                    vm.menuNodes[1].label = "禁用分类";
                } else {
                    vm.menuNodes[1].label = "启用分类";
                }
            },
            reloadData(){
                let self = this;
                self.pageNumber = 1;
                self.workflowData = [];
                self.getDatas();
            }
        }
    };
</script>
<style lang="less" scoped>
    .modal-header {
        background-color: #f0ad4e;
        padding: 15px;
        border-bottom: 1px solid #e5e5e5;
    }
    .dialog-demo {
    /deep/ .modal-body {
    // position: relative;
        padding: 5px;
        height: 320px;
    }
    }
    .vux-confirm {
    /deep/ .weui-dialog__btn_primary {
        color: #ff8000;
    }
    }
    .resource {
        height: 100%;
    .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
    overflow: hidden;
    }
    }
    .left{
        width: 70% !important;
    }
</style>
