<template>
    <div class="askForLeaveCalendar">
        <zing-head title="请假统计" @doSome="backClick" :isComeBack="false"></zing-head>
        <div class="content">
                <inline-calendar ref="calendar"
                         :show-last-month=false
                         :show-next-month=false
                         :highlight-weekend=true
                         :render-function="buildSlotFn"
                         @on-change="onChange"
                         @on-view-change="onViewChange"
                         v-model="curShowDay">
                </inline-calendar>
                <div  v-if="askData && askData.length > 0">
                    <timeline>
                        <timeline-item v-for="(item, index) in askData" :key="index">
                            <GridCard>
                                <div slot="cardLeft" class="left" >
                                    <div class="left-wrapper">
                                        <div class="left-wrapper-title">{{item.userName}}</div>
                                        <div class="left-wrapper-title">关联审批: <span @click="goWorkFlow(item)" style="color:#ff8000">{{item.type}} ></span></div>
                                        <div class="left-wrapper-title">请假时间: {{item.date}}</div>
                                    </div>
                                </div>
                            </GridCard>
                        </timeline-item>
                    </timeline>
                    
                </div>
                <div v-else>
                        <p class="noData">暂无任何请假数据！</p>
                </div>
        </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from '@/components/gridcard/GridCard';
    import { InlineCalendar, Group, Cell,XButton,Timeline, TimelineItem } from 'vux'

    export default {
        name:"askForLeaveCalendar",
        components: {
            GridCard,ZingHead,InlineCalendar,Group,Cell,XButton,Timeline,TimelineItem
        },
        data() {
            return {
                curShowDay:"",//显示的天
                firstCurrentMonthDate:"",//当前月的第一天
                lastCurrentMonthDate:"",//当前月的最后一天
                calendarData:{},//日历数据
                askData:[{}],//当天详情的数据
                buildSlotFn:() => ''
            }
        },
        watch:{
            calendarData(val){
                let beginDate = this.firstCurrentMonthDate
                let endDate = this.lastCurrentMonthDate
                let status = this.compareDate(beginDate,endDate,this.curShowDay)
                if(status){
                    this.showDetails(this.curShowDay)
                }else{
                    this.askData = []
                }
            }
        },
        //钩子加载完触发
        created: function () {
            this.curShowDay = this.format(new Date()).nyr
        },
        methods: {
            getCalendarData(startTime,endTime){
                let url = "/zingbiz/hrManager/AskForLeave/getAskForLeaveData"
                let params = {startTime:startTime,endTime:endTime}
                this.$http.post(url,params).then(res => {
                    let calendarData = {}
                    let retData = res.data.data
                    retData.forEach(item => {
                        this.dealData(item.startTime,item.endTime,item,calendarData)
                    })
                   
                    //处理红点数据
                    let redArr = []
                    for(var key in calendarData){
                        redArr.push(key)
                        this.renderingDay(redArr);
                    }
                    this.calendarData = calendarData
                })

            },
            showDetails(dateStr){
                let curDayArr = []
                let curDayList = this.calendarData[dateStr]
                if(curDayList){
                    curDayList.forEach(item => {
                        let obj = {
                            workflow_id:item.workflow_id,
                            userName:item.userName,
                            type:item.type,
                            date:item.startTime +"~"+item.endTime,
                            companyId:item.companyId
                        }
                        curDayArr.push(obj)
                    })
                }
                this.askData = curDayArr
            },
            onChange (val) {
                this.curShowDate = val
                if(this.calendarData[val]){
                    this.showDetails(val)
                }else{
                    this.askData = []
                }
            },
            onViewChange (val, count) {//切换视图
               this.firstCurrentMonthDate = val.firstCurrentMonthDate
               this.lastCurrentMonthDate = val.lastCurrentMonthDate
               this.getCalendarData(val.firstCurrentMonthDate,val.lastCurrentMonthDate)

            },
            renderingDay(arr){//显示红点
                    this.buildSlotFn = (line, index, data) => {
                        return arr.indexOf(data.formatedDate)>=0 ? '<div style="font-size:12px;text-align:center;"><span style="display:inline-block;width:5px;height:5px;background-color:red;border-radius:50%;"></span></div>' : '<div style="height:19px;"></div>'
                    }
            },
            backClick(){
                this.$router.go(-1);
            },
            goWorkFlow(item){
                this.$router.push({
                    path:'/workflow/showNode',
                    query:{companyId:item.companyId,workflow_id:item.workflow_id}
                })
            },
            compareDate(beginDate,endDate,curDate){//判断当前时间是否在某一范围内
                let bd = new Date(beginDate.replace(/\-/g, "\/"))  
                let ed = new Date(endDate.replace(/\-/g, "\/"))  
                let cd = new Date(curDate.replace(/\-/g, "\/"))
                if(bd <= cd && cd <= ed){
                    return true
                }else{
                    return false
                }
            },
            dealData(startDate,endDate,item,dealRetMap){
                let sDate = new Date(startDate)
                let eDate = new Date(endDate)
                let daymis = 24*3600*1000
                while(sDate <= eDate){
                    var dateKey = this.format(sDate).nyr
                    if(!this.isArray(dealRetMap[dateKey])){
                        dealRetMap[dateKey] = new Array()
                    }
                    dealRetMap[dateKey].push(item);
                    sDate=new Date(sDate.getTime()+daymis);
                }
            },
            isArray(val){//判断是数组
                 return Object.prototype.toString.call(val)=='[object Array]'
            },
            strToDate(str){//字符串转数组
                let strArr = str.split("-")
                return new Date(strArr[0], strArr[1]-1, strArr[2], 0, 0, 0);  
            },
            format(dateObj){//日期转字符串
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
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .askForLeaveCalendar{
        height:100%;
    }
    .content{
        height:calc(100% - 50px);
        overflow-y: scroll;
    }
    .noData{
        text-align: center;
        font-size: 16px;
        color: #ff8000;
        margin-top: 50px;
    }
</style>
