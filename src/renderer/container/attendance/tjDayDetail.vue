<template>
    <div  class="tjDayDetail">
        <!-- 头部 -->
        <zing-head :title="title"></zing-head>
        <!-- tab内容 -->
        <div class="content">
            <div class="scroll-list-wrap">
                <scroll 
                  ref="scroll"
                  :data="items" 
                  :scrollbar="true"
                  :startY="0"
                  >
                        <GridCard v-for="(item ,index) in items" :key="index">
                              <div slot="cardLeft" class="left">
                                      <avatar shape="square" :src="item.headImg"></avatar>
                                      <div class="left-wrapper">
                                          <p class="left-wrapper-title">{{item.userName}}</p>
                                          <div class="left-wrapper-desc">
                                              {{item.groupName}}
                                          </div>
                                      </div>
                              </div>
                              <div slot="cardRight" >
                                     <p  class="wqy">{{title}}</p>
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

    export default {
        components: {
            ZingHead,Scroll,GridCard,Avatar
        },
        data() {
            return {
                title:"打卡明细",
                isShowTop:false,
                pageNumber: 1, 
                items:[]
            }
        },
        created() {
            this.dealTitle()
            this.getItems()
        },
        computed: {
        },
        methods: {
            dealTitle(){
                let resultCode = this.$route.query.resultCode
                let isWQ = this.$route.query.isWQ
                if(resultCode === '1'){
                    this.title = "迟到"
                }else if(resultCode === '2'){
                    this.title = "早退"
                }else if(resultCode === '4'){
                    if(isWQ === 'true'){
                        this.title = "外勤"
                    }else{
                        this.title = "范围外"
                    }
                }
            },
            getItems(){
                let url = "/zingbiz/attendance/attendancereport/getDayDetail"
                let params = {
                    pageNumber:this.pageNumber,
                    pageSize:10,
                    resultCode:this.$route.query.resultCode,
                    isWQ:this.$route.query.isWQ,
                    atten_day:this.$route.query.atten_day,
                    orgId:this.$route.query.orgId,
                }
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    this.items = retData
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .tjDayDetail {
        height calc(100% - 50px);
    }
    .content {
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
