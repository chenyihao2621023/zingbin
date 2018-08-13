<template>
    <div id="workCalendar" style="height:100%;background-color: #fff;">
        <zing-head title="工作日历" @doSome="backClick" :isComeBack="false">
            <div slot="header-right">
                  <span class="header-jiahao">
                        <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                              <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                                  <i class="iconfont icon-gengduo"></i>
                              </a>
                        </dropdown>
                  </span>
            </div>
        </zing-head>
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
                <group >
                    <cell is-link
                           :arrow-direction="showContentPlan? 'up' : 'down'"
                           @click.native="showContentPlan = !showContentPlan">
                           <span slot="icon"><icon type="info"></icon></span>
                           <span slot="title">当日计划中的任务</span>
                    </cell>
                    <template v-if="showContentPlan">
                        <div v-if="planDataArr.length > 0">
                            <cell-box  v-for="(item ,index) in planDataArr" :key="index" class="sub-item" is-link @click.native="goBack('plan',item)">{{item.title}}</cell-box>
                        </div>
                        <div v-else>
                            <cell-box  class="sub-item" >暂无计划中的任务</cell-box>
                        </div>
                        
                    </template>
                    <cell is-link
                           :arrow-direction="showContentUnfinish? 'up' : 'down'"
                           @click.native="showContentUnfinish = !showContentUnfinish">
                           <span slot="icon"><icon type="info"></icon></span>
                           <span slot="title">当日未完成的任务</span>
                    </cell>
                    <template v-if="showContentUnfinish">
                        <div v-if="unfinishDataArr.length > 0">
                            <cell-box  v-for="(item ,index) in unfinishDataArr" :key="index" class="sub-item" is-link @click.native="goBack('unfinish',item)">{{item.title}}(进行中)</cell-box>
                        </div>
                        <div v-else>
                            <cell-box  class="sub-item" >暂无未完成的任务</cell-box>
                        </div>
                    </template>
                </group>
            </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Icon, Group, Cell,CellBox ,InlineCalendar} from 'vux'
    import Dropdown from "@/components/dropdown/Dropdown";
    export default {
        name:"workCalendar",
        components: {
            Icon, Group, Cell,CellBox ,InlineCalendar,ZingHead,Dropdown
        },
        data() {
            return {
                curShowDay:"",//显示的天
                firstCurrentMonthDate:"",//当前月的第一天
                lastCurrentMonthDate:"",//当前月的最后一天
                calendarData:{},//日历数据
                buildSlotFn:() => '',
                showContentPlan:false,
                showContentUnfinish:false,
                planDataArr:[],
                unfinishDataArr:[],
                datas: [{ content: "发起任务"},{ content: "发起请假"}],
                cardUrl:"",
                companyId:""

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
                    this.planDataArr = []
                    this.unfinishDataArr = []
                }
            }
        },
        //钩子加载完触发
        created: function () {
            
           
        },
        methods: {
            getUserInfo(startTime,endTime){
                let url = "/zingbiz/auth/user/getThisUserInfo"
                let params = {}
                this.$http.post(url,params).then(res => {
                    this.cardUrl = res.data.data.cardUrl
                    this.companyId = res.data.data.companyId
                    this.getCalendarData(startTime,endTime,this.cardUrl,this.companyId)
                })

            },
            goBack(type,item){
                this.$router.push({
                    path:"/taskManage/taskList/taskDetail",
                    query:{"taskCardId":item.cardId,"taskRouting":item.companyId}
                })
            },
            handleMenu (data) { //下拉菜单
                let path = ''
                if (data.content && data.content == "发起任务") {
                    path = "/taskManage"
                }
                if (data.content && data.content == "发起请假") {
                    path = "/workflow/workflowMain"
                }
                this.$router.push({
                    path:path
                });
            },
            getCalendarData(startTime,endTime,cardUrl,companyId){
                let _this = this
                let params = {
                    startTime:startTime+" 00:00:00",
                    endTime:endTime+" 00:00:00",
                    cardUrl:cardUrl,
                    routing:companyId
                }
                let url = "/ZingMH/ZDesk/contactList/mater/loadTaskByDateRange.action?startTime="+params.startTime+"&endTime="+
                params.endTime+"&cardUrl="+params.cardUrl+"&routing="+params.routing
                this.$http.post(url,{}).then(res => {
                    let retData = res.data.data
                    let retMap = {};
                    let plan_key = "plan";//计划中的任务
                    let unfinish_key = "unfinish";//未完成的任务
                    let daymis=24*3600*1000;
                    let taskDataArr = retData.dateRangeList;
                    taskDataArr.forEach(item =>{
                        let startDate = this.strToDate(params.startTime)
                        let endDate = this.strToDate(params.endTime)
                        let expectedStartDate = this.strToDate(item.expectedStartTime)//预期开始时间
                        let expectedEndDate = this.strToDate(item.expectedEndTime)//预期结束时间

                        if(startDate.getTime() < expectedStartDate.getTime()){
                            startDate = expectedStartDate;
                        }
                        if(item.handlingStatus != "solved"){//未完成的
                            var now = new Date();
                            if(expectedEndDate.getTime() < now.getTime()){// 超期
                                if(now.getTime() < endDate.getTime()){ // 数据只显示到当天
                                    endDate = now;
                                }
                            }else{ // 未超期
                                if(expectedEndDate.getTime() < endDate.getTime()){
                                    endDate = expectedEndDate;
                                }
                            }
                            let unfinish_start_Date = startDate;
                            let unfinish_end_Date = endDate;
                            while(unfinish_start_Date <= unfinish_end_Date){
                                let dateKey = _this.format(unfinish_start_Date).nyr
                                if(!_this.isArray(retMap[unfinish_key])){
                                    retMap[unfinish_key] = new Array();
                                }
                                if(!_this.isArray(retMap[unfinish_key][dateKey])){
                                    retMap[unfinish_key][dateKey] = new Array();
                                }
                                retMap[unfinish_key][dateKey].push(item);
                                unfinish_start_Date = new Date(unfinish_start_Date.getTime()+daymis);
                            }
                        }else{
                            if(expectedEndDate.getTime() < endDate.getTime()){
                                endDate = expectedEndDate;
                            }
                        }
                        let plan_start_Date = startDate;
                            let plan_end_Date = endDate;
                            while(plan_start_Date <= plan_end_Date){
                                let dateKey = _this.format(plan_start_Date).nyr
                                if(!_this.isArray(retMap[plan_key])){
                                    retMap[plan_key]= new Array();
                                }
                                if(!_this.isArray(retMap[plan_key][dateKey])){
                                    retMap[plan_key][dateKey] = new Array();
                                }
                                retMap[plan_key][dateKey].push(item);
                                plan_start_Date=new Date(plan_start_Date.getTime()+daymis);
                        }
                    })
                    //console.log("处理后的数据",retMap)
                    this.calendarData = retMap
                    //显示红点
                    if(retMap.unfinish){
                        let redArr = []
                        for(var key in retMap.unfinish){
                            let redKey = key.substring(key.length-2)
                            if(redKey.charAt(0) == 0){
                                redArr.push(parseInt(redKey.charAt(1)))
                            }else{
                                redArr.push(parseInt(redKey))
                            }
                            this.renderingDay(redArr);
                        }
                    }else{
                        this.renderingDay([]);
                    }
                })

            },
            loadByCardIds(data,type){
                //console.log("type",type)
                //console.log("data",data)
                let cardIdStr = ""
                data.forEach(item =>{
                     cardIdStr += item.cardId + ";"
                })
               /* let params = {
                    cardIdStr:cardIdStr,
                    routing:"company52589645100001"
                }*/
                let params = {
                    cardIdStr:cardIdStr,
                    routing:this.companyId
                }
                let url = "/ZingMH/ZDesk/card/mater/loadByCardIds.action?cardIds="+params.cardIdStr
                +"&routing="+params.routing
                this.$http.post(url,{}).then(res => {
                    if(type == "plan"){
                        this.planDataArr = res.data.data
                    }else if(type == "unfinish"){
                        //console.log("unfinish返回的数据",res.data.data)
                        this.unfinishDataArr = res.data.data
                    }
                })
            },
            showDetails(dateStr){
                if(this.calendarData && this.calendarData["plan"] && this.calendarData["plan"][dateStr]){
                    let planDataArr = this.calendarData["plan"][dateStr]
                    this.loadByCardIds(planDataArr,"plan")
                }else{
                    this.planDataArr = []
                }
                if(this.calendarData && this.calendarData["unfinish"] && this.calendarData["unfinish"][dateStr]){
                    let unfinishDataArr = this.calendarData["unfinish"][dateStr]
                    this.loadByCardIds(unfinishDataArr,"unfinish")
                }else{
                    this.unfinishDataArr = []
                }
               
            },
            onChange (val) {
                this.showDetails(val)
              
            },
            onViewChange (val, count) {//切换视图
               this.curShowDay = this.format(new Date()).nyr
               this.firstCurrentMonthDate = val.firstCurrentMonthDate
               this.lastCurrentMonthDate = val.lastCurrentMonthDate
               this.getUserInfo(val.firstCurrentMonthDate,val.lastCurrentMonthDate)

            },
            renderingDay(arr){//显示红点
                    this.buildSlotFn = (line, index, data) => {
                        return arr.indexOf(data.date)>=0 ? '<div style="font-size:12px;text-align:center;"><span style="display:inline-block;width:5px;height:5px;background-color:red;border-radius:50%;"></span></div>' : '<div style="height:19px;"></div>'
                    }
            },
            backClick(){
                this.$router.go(-1);
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
            strToDate(str){//字符串转日期
                let strArr = str.split(" ")[0].split("-")
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

<style lang="stylus">
   .content{
        overflow-y: scroll;
        height calc(100% - 50px);
   }
</style>
