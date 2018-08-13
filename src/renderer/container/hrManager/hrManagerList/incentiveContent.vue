<template>
    <div  class="incentiveHistory">
        <group label-width="5em" label-margin-right="2em" label-align="left">
                <cell title="奖惩记录" class="hr_title">
                    <x-button sort="right" mini type="primary btn-common" @click.native="addBtn()">添加</x-button>
                </cell>
        </group>
        <!-- 工作历程 -->
        <div v-for="(data, index) in getDataInfo" :key="index">
            <group label-width="5em" label-margin-right="2em" label-align="left">
                <cell title="时间" :value="data.createDate "></cell>
                <cell title="奖惩类型" :value="data.type"></cell>
                <cell title="奖惩金额" :value="data.amount"></cell>
                <cell title="奖惩说明" :value="data.remark"></cell>
                <cell>
                     <x-button sort="right" mini type="primary btn-save" @click.native="delBtn(data)">删除</x-button>
                     <x-button sort="right" mini type="primary btn-common" @click.native="editBtn(data)">编辑</x-button>
                </cell>
            </group>
        </div>
        <div class="chatIcon" @click="chatFun" v-if="cookieUser.cardUrl != formData.cardUrl"> 
                <i class="iconfont icon-icon--" style="color: #ff8000;"></i>
        </div>
    </div>
</template>


<script>
    import {Selector, Datetime,  XInput, Group, XButton, Cell,XTextarea,Flexbox, FlexboxItem } from 'vux'
    import GridCard from "@/components/gridcard/GridCard";
    import { doOneChat } from "@/utils/fn";
    export default {
        name: "employeeWorkInfo",
        components: {
            Selector, Datetime,  XInput, Group, XButton, Cell,GridCard,XTextarea,
            XButton,Flexbox, FlexboxItem
        },
        props:{
            formData: {},
            incentiveInfo: {},
            cookieUser: {}
        },
        data() {
            return {
                showJobsHistroyPicker:false,//显示阶段性评价的标识
                getDataInfo:[]//列表的数据
            }
        },
        watch:{
           incentiveInfo(data){
                this.getDataInfo.push(data)
           }
        },
        created: function () {
            this.getIncentiveHistoryList()
        },
        methods: {
           getIncentiveHistoryList(){
                let cardUrl  = this.$route.query.cardUrl
                let url = "/zingbiz/hrManager/IncentiveHistory/getIncentiveHistory"
                let params = {
                    cardUrl:cardUrl
                }
                this.$http.post(url,params).then(res => {
                   this.getDataInfo = res.data.data
                })
           },
           addBtn(){
              this.$emit('showIncenTive')
           },
           editBtn(data){
              this.$emit('showIncenTive',data)
           },
           delBtn(data){
                let _this = this
                this.$vux.confirm.show({
                    title: '提示',
                    content:'你确定要删除吗?',
                    onCancel () {},
                    onConfirm() {
                        _this.getDataInfo = _this.getDataInfo.filter(item => {
                            return data.rowId !== item.rowId
                        })
                        let url = "/zingbiz/hrManager/IncentiveHistory/delIncentiveHistory"
                        _this.$http.post(url,data).then(res => {
                           _this.$vux.toast.show({text:"删除成功！",type:"success"})
                        })
                    }
                })
           },
           chatFun(){
                let cardUrl = this.formData.cardUrl
                doOneChat(cardUrl,true,this.$router)
           }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
   .hr_title{
        color: #FF8000;
        font-weight: bold;
    }
    .chatIcon{
        position: fixed;
        bottom: 80px;
        right: 0px;
        height: 50px !important;
        width:50px;
    }
    .iconfont {
        font-size: 25px;
        position: relative;
        float: right;
        top: 20%;
    }
</style>
