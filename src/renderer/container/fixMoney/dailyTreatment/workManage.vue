<template>
    <div class="outwrapper">
        <div class="inner" v-show="inner">
            <ZingHead title="工作量管理"></ZingHead>
            <div class="workManage">
               <group>
                   <x-input title="资产编码" class="code star" v-model="assetCode" placeholder="请输入资产编码"></x-input>
                   <x-input title="资产名称" class="code star" v-model="assetName" placeholder="请输入资产名称"></x-input>
                   <x-input title="部门" class="code star" v-model="department" placeholder="请选择使用部门" disabled @click.native="chooseDep"></x-input>
               </group>
           </div>
            <div>
               <flexbox class="inner">
                   <flexbox-item class="interspace">
                       <x-button type="primary" class="btn-save" @click.native="cancle">取消</x-button>
                   </flexbox-item>
                   <flexbox-item class="interspace">
                       <x-button type="primary" class="btn-common" @click.native="query">查询</x-button>
                   </flexbox-item>
               </flexbox>
           </div>
        </div>
        <workResult
            v-if="queryFlag"
            :queryFlag = "queryFlag"
            :params = "params"
            @doSome="doSome"
        ></workResult>
        <org-member-picker
            :multiple="false"
            :showTab="isAuthRole"
            :showPicker="showPersonPicker"
            @picked="onPickDept"
            @abort="onAbort"
        ></org-member-picker>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import workResult from "../template/workResult";
    import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
    import { Group,XInput,Flexbox,FlexboxItem,XButton } from 'vux'
    export default {
        name: "work-manage",
        components:{
            ZingHead,
            Group,
            XInput,
            XButton,
            Flexbox,
            FlexboxItem,
            workResult,
            OrgMemberPicker
        },
        data() {
            return {
                inner:true,
                assetCode:"",
                assetName:"",
                department:"",
                params:{},
                queryFlag:false,
                //选择部门
                initSelectPerson: [],
                isAuthRole: ["org"],
                showPersonPicker: false,
                departmentId:""
            }
        },
        methods: {
            cancle() {
                this.$router.go(-1)
            },
            query() {
                //没有输入 默认输入全部
                if (this.assetCode !== "") {
                    this.params.assetsCoding = this.assetCode
                }
                if (this.assetName !== "") {
                    this.params.assetsName = this.assetName
                }
                if (this.departmentId !== "") {
                    this.params.department = this.departmentId
                }
                this.inner = false
                this.queryFlag = true
            },
            doSome() {
                this.inner = true
                this.queryFlag = false
            },
            //选择部门
            onPickDept(val) {
                this.departmentId = val[0].id
                this.department = val[0].title
                this.showPersonPicker = false
            },
            onAbort() {
                this.showPersonPicker = false
            },
            chooseDep() {
                this.showPersonPicker = true
            }
        }
    }
</script>
<style>

    .workManage  .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;
    }
    .workManage .weui-cell__hd{
        color: rgba(16, 16, 16, 1);
        font-size: 14px !important;
        text-align: left;
        font-family: Arial;
    }
    .workManage .weui-cell__bd{
        color: rgba(136, 136, 136, 1) !important;
        font-size: 14px !important;
        font-family: Microsoft Yahei;

    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height 100%
        .inner{
            height 100%
            .workManage{
                height calc(100% - 94px)
            }
        }
    }
    .interspace{
        margin-left: 0px !important;
        text-align center
    }
</style>
