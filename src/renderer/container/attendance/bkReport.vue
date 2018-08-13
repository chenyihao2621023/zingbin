<template>
    <div  class="bkReport">
        <zing-head  title="补卡历史记录">
        </zing-head>
        <div class="scroll-list-wrap">
            <scroll 
              ref="scroll"
              :observeDOM="true"
              :data="items" 
              :scrollbar="true"
              :startY="0"
              >
                  <div v-if="items.length > 0">
                      <GridCard v-for="(item ,index) in items" :key="index"  @click.native="goDetail(item)">
                        <div slot="cardLeft" class="left">
                                <div class="left-wrapper">
                                    <p class="left-wrapper-title">补卡班次</p>
                                    <div class="left-wrapper-desc">{{item.desc}}</div>
                                    <p  v-if="item.isReview == '0'" class="dsh">待审核</p>
                                    <p  v-if="item.isReview == '1'" class="ysh">已审核</p>
                                    <p  v-if="item.isReview == '2'" class="yjj">已拒绝</p>
                                </div>
                        </div>
                      </GridCard>
                  </div>
                  <div v-else>
                       <p class="noData">暂无补卡历史记录</p>
                  </div>
            </scroll>
        </div>
    </div>
</template>


<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import Scroll from "@/components/scroll/Scroll";
    import GridCard from "@/components/gridcard/GridCard";

    export default {
        components: {
            ZingHead,Scroll,GridCard
        },
        data() {
            return {
                items:[]
            }
        },
        created() {
           this.getBKReport()
        },
        computed: {
           
        },
        watch: {
           
        },
        methods: {

            getBKReport(){
                let url = "/zingbiz/attendance/attendancereport/getBkReport"
                let params = {
                    cardUrl: this.$route.query.cardUrl,
                    atten_month: this.$route.query.atten_month,
                    bk_tag:"bk" 
                }
               
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    retData.forEach(item =>{
                        let desc = ""
                        let week = ""
                        if(item.atten_day){
                            week = this.getCurDate(item.atten_day).week
                            desc +=  item.atten_day + ","+week
                        }
                        if(item.bk_groupName){
                            desc +=  ","+item.bk_groupName
                        }
                        if(item.type && item.gd_date){
                            desc +=  ","+ this.getTypeName(item.type)+":"+item.gd_date
                        }
                        if(item.bk_date){
                            desc += ",补卡时间："+item.bk_date
                        }
                        item.desc = desc
                    })
                    this.items = retData
                })
            },
            getTypeName(type){
                let typeName = "上班时间"
                if(type == "clockOut"){
                    typeName = "下班时间"
                }
                return typeName
            },
            getCurDate(dateStr){
                let dateObj = new Date(); //表示当前系统时间的Date对象
                if(dateStr){
                    dateObj = new Date(Date.parse(dateStr.replace(/-/g, "/")))
                }
                let year = dateObj.getFullYear(); //当前系统时间的完整年份值
                let month = dateObj.getMonth()+1; //当前系统时间的月份值
                let date = dateObj.getDate(); //当前系统时间的月份中的日
                let day = dateObj.getDay(); //当前系统时间中的星期值
                let weeks = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
                let week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
                let hour = dateObj.getHours(); //当前系统时间的小时值
                let minute = dateObj.getMinutes(); //当前系统时间的分钟值
                let second = dateObj.getSeconds(); //当前系统时间的秒钟值
                //如果月、日、小时、分、秒的值小于10，在前面补0
                if(month<10){
                    month = "0"+month;
                }
                if(date<10){
                    date = "0"+date;
                }
                if(hour<10){
                    hour = "0"+hour;
                }
                if(minute<10){
                    minute = "0"+minute;
                }
                if(second<10){
                    second = "0"+second;
                }
                return {
                    nyr:year+"-"+month+"-"+date,
                    sfm:hour+":"+minute+":"+second,
                    week:week
                }
            },
            goDetail(data){
                this.$router.push({
                        path:"/attendanceHome/attendanceRepairDetail",
                        query:{
                            rowId:data.rowId,
                            cardUrl:data.cardUrl,
                            attenSetId:data.attenSetId,
                            pageType:"punch"
                        }
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .noData{
        text-align: center;
        font-size: 16px;
        color: #ff8000;
        padding-top: 15px;
    }
    .bkReport {
        height calc(100% - 50px);
    }
    .grid-card{
        padding: 10px 13px;
    }
    .left-wrapper-title{
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;
    }
    .left-wrapper-desc{
        line-height: 25px;
        white-space: unset !important;
        width: unset !important;
        font-size: 16px;
        color: unset !important;
        margin-bottom: 10px;
    }
    .dsh{
        float: right;
        color: #17c295;
        background-color:#dcf6ef;
        border-radius: 5px;
        width: 50px;
        height: 25px
        font-size: 13px;
        line-height: 25px;
        text-align: center;
    }
    .ysh{
        color: #f2725e;
        background-color:#fcdad4;
        border-radius: 5px;
        width: 50px;
        height: 25px
        font-size: 13px;
        line-height: 25px;
        text-align: center;
    }
</style>
