<template>
    <div  class="tjDetail">
        <!-- 头部 -->
        <zing-head  title="打卡明细"></zing-head>
        <!-- tab页 -->
        <div class="vue-tab">
            <tab>
                <tab-item  selected  @on-item-click="changeTab('1')">已打卡({{peoInNum}})</tab-item>
                <tab-item  @on-item-click="changeTab('2')">应到但未打卡({{peoOutNum}})</tab-item>
            </tab>
        </div>
        <!-- tab内容 -->
        <div class="tab-content">
            <div class="scroll-list-wrap">
                <scroll
                    ref="scroll"
                    :observeDOM="true">
                        <GridCard v-for="(item ,index) in attenData" :key="index" >
                              <div slot="cardLeft" class="left">
                                      <avatar shape="square" :src="item.headImg"></avatar>
                                      <div class="left-wrapper">
                                          <p class="left-wrapper-title">{{item.userName}}</p>
                                          <div class="left-wrapper-desc">
                                              <a href="tel:">{{item.groupName}}</a>
                                          </div>
                                      </div>
                              </div>
                              <div slot="cardRight">
                                     <p  class="wqy">{{item.desc}}</p>
                               </div>
                        </GridCard>
                </scroll>
            </div>
        </div>
    </div>
</template>


<script>
    import ZingHead from "@/components/zingHead/ZingHead"; 
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";
    import Avatar from "@/components/avatar/Avatar"; 
    import {Tab, TabItem} from 'vux'
    

    export default {
        components: {
            ZingHead,Scroll,GridCard,Avatar,
            Tab, TabItem
           
        },
        data() {
            return {
                showTabIndex:'1',
                peoInNum:'0',//已打卡人数
                peoOutNum:'0',//未打卡人数
                attenData:[]
            }
        },
        created() {
           this.peoInNum = this.$route.query.peoInNum
           this.peoOutNum = this.$route.query.peoOutNum
           this.getAttenData()
        },
        computed: {
           
        },
        watch: {
           
        },
        methods: {
            getAttenData(){
                let params = {
                    orgId:this.$route.query.orgId,
                    atten_day:this.$route.query.atten_day,
                    type:this.showTabIndex,
                    isWQ:"false",
                    pageSize:"500"
                }
                let url = "/zingbiz/attendance/attendancereport/getAttenDetail"
                this.$http.post(url,params).then(res => {
                    this.attenData = res.data.data
                    this.attenData.forEach(item =>{
                        if(this.showTabIndex === '1'){
                            item.desc = "已打卡"
                        }else if(this.showTabIndex === '2'){
                            item.desc = "未打卡"
                        }
                    })
                });
            },
            changeTab(index){
                this.showTabIndex = index
                this.getAttenData();
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .tjDetail{
        height calc(100% - 94px);
    }
    .tab-content {
         height 100%;
    }
    
    .wqy{
        color: #fff;
        background-color:#409eff;
        border-radius: 5px;
        width: 50px;
        height: 25px
        font-size: 13px;
        line-height: 25px;
        text-align: center;

    }
</style>
