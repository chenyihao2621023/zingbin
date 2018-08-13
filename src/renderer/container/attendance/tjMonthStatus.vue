<template>
    <div  class="tjMonthStatus">
        <!-- 头部 -->
        <zing-head :title="title"></zing-head>
        <p class="desc">{{desc}}</p>
        <!-- tab内容 -->
        <div class="content">
            <div class="scroll-list-wrap">
                <scroll 
                  ref="scroll"
                  :data="items" 
                  :scrollbar="true"
                  :startY="0"
                  >
                        <GridCard v-for="(item ,index) in items" :key="index" @click.native="goTjMonthDetail(item.cardUrl)">
                              <div slot="cardLeft" class="left">
                                      <avatar shape="square" :src="item.headImg"></avatar>
                                      <div class="left-wrapper">
                                          <p class="left-wrapper-title">{{item.userName}}</p>
                                          <div class="left-wrapper-desc">
                                              {{item.groupName}}
                                          </div>
                                      </div>
                              </div>
                              <div slot="cardRight" class="right">
                                     <p>{{item.countNum}} 次 ></p>
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
                title:"打卡",
                desc:"",
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
                }else if(resultCode === '3'){
                    this.title = "缺卡"
                }
                else if(resultCode === '4'){
                    if(isWQ === 'true'){
                        this.title = "外勤"
                    }else{
                        this.title = "范围外"
                    }
                }else if(resultCode === '5'){
                    this.title = "补卡"
                }else if(resultCode === '7'){
                    this.title = "旷工"
                }
            },
            getItems(){
                let url = "/zingbiz/attendance/attendancereport/getMonthDetail"
                let params = {
                    resultCode:this.$route.query.resultCode,
                    isWQ:this.$route.query.isWQ,
                    atten_month:this.$route.query.curDate
                }
                this.$http.post(url,params).then(res => {
                    this.items = res.data.data
                   
                    let curDate = this.$route.query.curDate
                    let desc = curDate.replace("-","年")+"月，      "+this.title+"人数共"+this.items.length+"人"
                    this.desc = desc

                })
            },
            goTjMonthDetail(cardUrl){
                this.$router.push({
                        path: "/attendanceHome/tjMonthDetail",
                        query:{
                            resultCode:this.$route.query.resultCode,
                            isWQ:this.$route.query.isWQ,
                            cardUrl:cardUrl
                        }
                })
            }
           
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .tjMonthStatus {
        height calc(100% - 50px);
    }
    .content {
         height calc(100% - 50px);
    }
    .desc{
        width: 100%;
        height: 50px;
        font-size: 16px;
        line-height: 50px;
        padding-left: 30px;
        background-color: #f5f5f5;
    }
</style>
