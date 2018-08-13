<template>
    <div class="outwrapper">
       <div class="inner" v-show="inner">
           <ZingHead title="折旧管理"></ZingHead>
           <div class="discountManage">
               <group>
                   <x-input title="资产编码" class="code star" v-model="assetCode" placeholder="请输入资产编码"></x-input>
                   <x-input title="资产名称" class="code star" v-model="assetName" placeholder="请输入资产名称"></x-input>
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
        <searchResult
            v-if="result"
            :params ="params"
            @doSome="doSome"
        ></searchResult>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import searchResult from "../template/searchResult";
    import { Group,XInput,Flexbox,FlexboxItem,XButton } from 'vux'
    export default {
        name: "discount-manage",
        components:{
            ZingHead,
            Group,
            XInput,
            XButton,
            Flexbox,
            FlexboxItem,
            searchResult
        },
        data() {
            return {
                result:false,
                inner:true,
                assetCode:"",
                assetName:"",
                params:{}
            }
        },
        methods: {
            cancle() {
                this.$router.go(-1)
            },
            query() {
                if (this.assetCode !== "") {
                    this.params.assetsCoding = this.assetCode
                }
                if (this.assetName !== "") {
                    this.params.assetsName = this.assetName
                }
                this.result = true
                this.inner = false
            },
            doSome() {
                this.result = false
                this.inner = true
            }
        }
    }
</script>
<style>

    .discountManage  .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;
    }
    .discountManage .weui-cell__hd{
        color: rgba(16, 16, 16, 1);
        font-size: 14px !important;
        text-align: left;
        font-family: Arial;
    }
    .discountManage .weui-cell__bd{
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
            .discountManage{
                height calc(100% - 94px)
            }
        }
    }
    .interspace{
        margin-left: 0px !important;
        text-align center
    }
</style>
