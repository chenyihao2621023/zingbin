<template>
    <div class="attendanceCalendar">
        <zing-head title="考勤月历" >
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
                <GridCard>
                    <div slot="cardLeft" class="left">
                        <div v-if="hrInfo.headImg && hrInfo.headImg != ''">
                            <Avatar :src="hrInfo.headImg"></Avatar>
                        </div>
                        <div v-else>
                             <Avatar src="../../assets/img/userDef_.jpg"></Avatar>
                        </div>
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{hrInfo.userName}}</p>
                        </div>
                    </div>
                    <div slot="cardRight" class="right" style="width:50px;">
                        <p>{{curShowDay}}  {{curShowWeek}}</p>
                    </div>
                </GridCard>
                <inline-calendar ref="calendar"
                                 :show-last-month=false
                                 :show-next-month=false
                                 :highlight-weekend=true
                                 :render-function="buildSlotFn"
                                 @on-change="onChange"
                                 @on-view-change="onViewChange"
                                 v-model="curShowDay">
                </inline-calendar>
                <div class="divCell">考勤组：{{groupName}}&nbsp;&nbsp;&nbsp;&nbsp;班次：{{shiftName}}</div>

                <div class="divCell" style="background-color:#fff;">
                        今日打卡{{attendanceData.length}}次
                </div>
                <div v-show="isShowDetails">
                    <div v-if="curShowDay == curDate">
                            <timeline>
                                <timeline-item v-for="(data, index) in attendanceData" :key="index">
                                    <div style="margin-left:5px; padding-top: 10px;">
                                        <p style="position: relative">
                                            <i  class="icon iconfont icon-ICon-"></i> {{data.typeName}} &nbsp;{{data.gd_date}}
                                            <span v-if="data.resultCodeName" class="attenStatus">{{data.resultCodeName}}</span>
                                        </p></br>
                                        <p v-if="data.address_Name">
                                                <i class="icon iconfont icon-dizhiguanli"></i> {{data.address_Name}}
                                        </p>
                                        <div v-if='data.rowId' class="left-wrapper-title atten-title">
                                            打卡时间：{{data.generate_time}}
                                        </div>
                                        <div v-if="data.rowId && data.resultCode == '0'">
                                            <!-- <span class="left-wrapper-title" style="color:#ff8000" @click="updateAttenCard(data)">更新打卡 ></span>&nbsp;&nbsp;&nbsp;&nbsp; -->
                                            <span v-if="data.isReview && data.isReview == '1'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡已审核 ></span>
                                        </div>
                                        <div v-if="data.rowId && data.resultCode != '0'">
                                            <!-- <span class="left-wrapper-title" style="color:#ff8000" @click="updateAttenCard(data)">更新打卡 ></span>&nbsp;&nbsp;&nbsp;&nbsp; -->
                                            <span class="left-wrapper-title" style="color:#ff8000" @click="goDetail(data)">查看备注 ></span>&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span v-if="!data.isReview" class="left-wrapper-title" style="color:#ff8000" @click="bkAttenCard(data,index)">申请补卡 ></span>
                                            <span v-if="data.isReview && data.isReview == '0'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡审核中 ></span>
                                            <span v-if="data.isReview && data.isReview == '2'" class="left-wrapper-title" style="color:#ff8000" @click="bkyjjBtn(data)">补卡已拒绝 ></span>
                                            <span v-if="data.isReview && data.isReview == '1'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡已审核 ></span>
                                        </div>
                                    </div>
                                </timeline-item>
                            </timeline>
                    </div>
                    <div v-else>
                        <timeline>
                            <timeline-item v-for="(data, index) in attendanceData" :key="index">
                                <div style="margin-left:5px; padding-top: 10px;">
                                    <p style="position: relative">
                                            <i  class="icon iconfont icon-ICon-"></i> {{data.typeName}} &nbsp;{{data.gd_date}}
                                            <span v-if="data.resultCodeName" class="attenStatus">{{data.resultCodeName}}</span>
                                    </p></br>
                                    <div v-if="data.resultCodeName == '缺卡'">
                                            <div v-if="data.resultCode == '0'">
                                                <span v-if="data.isReview && data.isReview == '1'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡已审核 ></span>
                                            </div>
                                            <div v-if="data.resultCode != '0'">
                                                <span v-if="!data.isReview" class="left-wrapper-title" style="color:#ff8000" @click="bkAttenCard(data,index)">申请补卡 ></span>
                                                <span v-if="data.isReview && data.isReview == '0'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡审核中 ></span>
                                                <span v-if="data.isReview && data.isReview == '2'" class="left-wrapper-title" style="color:#ff8000" @click="bkyjjBtn(data)">补卡已拒绝 ></span>
                                                <span v-if="data.isReview && data.isReview == '1'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡已审核 ></span>
                                            </div>
                                    </div>
                                    <div v-else>
                                            <p v-if="data.address_Name">
                                                        <i class="icon iconfont icon-dizhiguanli"></i> {{data.address_Name}}
                                            </p>
                                            <div  class="left-wrapper-title atten-title">
                                                打卡时间：{{data.generate_time}}
                                            </div>
                                            <div v-if="data.resultCode == '0'">
                                                <span v-if="data.isReview && data.isReview == '1'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡已审核 ></span>
                                            </div>
                                            <div v-if="data.resultCode != '0'">
                                                <span class="left-wrapper-title" style="color:#ff8000" @click="goDetail(data)">查看备注 ></span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <span v-if="!data.isReview" class="left-wrapper-title" style="color:#ff8000" @click="bkAttenCard(data,index)">申请补卡 ></span>
                                                <span v-if="data.isReview && data.isReview == '0'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡审核中 ></span>
                                                <span v-if="data.isReview && data.isReview == '2'" class="left-wrapper-title" style="color:#ff8000" @click="bkyjjBtn(data)">补卡已拒绝 ></span>
                                                <span v-if="data.isReview && data.isReview == '1'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡已审核 ></span>
                                            </div>
                                    </div>
                                </div>
                            </timeline-item>
                        </timeline>
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from '@/components/gridcard/GridCard';
    import Avatar from "@/components/avatar/Avatar"
    import Dropdown from "@/components/dropdown/Dropdown";
    import { InlineCalendar,Timeline, TimelineItem } from 'vux'

     //地图
    import { getWXLocationHX ,getQMapLocation} from '@/utils/wx'
    import { mapState, mapMutations } from 'vuex'
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";

    export default {
        directives: {
            
        },
        name:"attendanceCalendar",
        components: {
            ZingHead,GridCard,Avatar,Dropdown,
            InlineCalendar,Timeline, TimelineItem ,
            getWXLocationHX ,getQMapLocation
        },
        data() {
            return {
                reqParams:{},//请求的参数
                hrInfo:{},//用户数据
                calendarData:{},//日历数据
                curShowWeek:"",//显示的周
                curShowDay:"",//显示的天
                curDate:"",
                firstCurrentMonthDate:"",//当前月的第一天
                lastCurrentMonthDate:"",//当前月的最后一天
                isShowDetails:false,//当天详情的标识
                attendanceData:[],//当天详情的数据
                buildSlotFn:() => '',
                datas: [
                    { content: "补卡历史记录"},
                ],
                shiftName:"暂无班次",
                groupName:"暂无考勤组",
                attenReportObj:{},//主表信息（月）
                attenSetInfo:{},//考勤组信息

                //位置信息
                longitude:"",
                latitude:"",
                addr:"",
                isPc:false


            }
        },
        computed: {
            ...mapState({
                wxLocationStatus: state => state.wx.wxLocationStatus,
                wxLocation: state => state.wx.wxLocation
            })
        },
        watch:{
            wxLocationStatus(st) {
                switch (st) {
                    case 'prepar':
                        break
                    case 'success':
                        this.longitude = this.wxLocation.longitude;
                        this.latitude = this.wxLocation.latitude;
                        this.addr = this.wxLocation.addr;

                        break
                    case 'failed':
                        break
                }
            },
            calendarData(val){
                let beginDate = this.firstCurrentMonthDate
                let endDate = this.lastCurrentMonthDate
                let status = this.compareDate(beginDate,endDate,this.curShowDay)
                if(status){
                    this.showDetails(this.curShowDay)
                }else{
                    this.attendanceData = []
                    this.isShowDetails = false
                }
            }
        },
        //钩子加载完触发
        created: function () {
            if (isWeiXin() || isMhApp()) {
                getQMapLocation();
                this.isPc  = false
            }else{
                this.isPc  = true
            }
            this.reqParams = this.$route.query
            this.curShowDay = this.$route.query.atten_day
            this.curShowWeek = this.getCurDate(this.curShowDay).week
            this.curDate = this.getCurDate().nyr
            this.getUserSetData({cardUrl:this.reqParams.cardUrl})

        },
        methods: {
            getGroupNameList(atten_month){
                let url = "/zingbiz/attendance/attendancereport/getAttenReportByMonth"
                let params = {
                    cardUrl: this.reqParams.cardUrl,
                    atten_month: this.reqParams.atten_month,
                }
                if(atten_month){
                    params.atten_month = atten_month
                }
                this.$http.post(url,params).then(res => {
                        this.attenReportObj = res.data.data
                })
            },
            getCalendarData(atten_month){//查询一个月的数据
                let params = {
                    cardUrl: this.reqParams.cardUrl,
                    atten_month: this.reqParams.atten_month,
                    isWQ:this.reqParams.isWQ
                }
                if(atten_month){
                    params.atten_month = atten_month
                }
                let url = "/zingbiz/attendance/attendancereport/getCalendarData"
                this.$http.post(url,params).then(res => {
                        this.calendarData =  res.data.data
                        
                        let redArr = []
                        for(var key in res.data.data){
                            let redKey = key.substring(key.length-2)
                            if(redKey.charAt(0) == 0){
                                redArr.push(parseInt(redKey.charAt(1)))
                            }else{
                                redArr.push(parseInt(redKey))
                            }
                        }
                        //日历显示红点
                        this.renderingDay(redArr);
                })
            },
            getUserSetData(params){//人员数据
                let url = "/zingbiz/attendance/attenPunch/getUserSetData"
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    this.attenSetInfo = retData.attenSetInfo
                    if(retData.attenDateInfo && retData.attenDateInfo.dateName){
                            if(retData.attenDateInfo.dateName.length > 6){
                               this.shiftName = retData.attenDateInfo.dateName.substring(0,6)+"..."
                            }else{
                               this.shiftName = retData.attenDateInfo.dateName 
                            }
                            
                    }else{
                            this.shiftName = "暂无考勤班次"
                    }
                    if(retData.attenSetInfo && retData.attenSetInfo.groupName){
                            if(retData.attenSetInfo.groupName.length > 6){
                                this.groupName = retData.attenSetInfo.groupName.substring(0,6)+"..."
                            }else{
                                this.groupName = retData.attenSetInfo.groupName
                            }
                            
                    }else{
                            this.groupName = "暂无考勤组"
                    }
                    if(retData.userInfo){
                            this.hrInfo =  retData.userInfo
                    }
                })
            },
            showDetails(dateStr){//展示某一天的数据
                let curDayArr = []
                let curDayList = this.calendarData[dateStr]
                if(curDayList){
                    curDayList.forEach(item => {
                        let typeName = this.getTypeName(item.type)
                        let resultCodeName = this.getResultCodeName(item.resultCode,item.isWQ)
                        
                        item.typeName = typeName,
                        item.resultCodeName = resultCodeName
                        curDayArr.push(item)
                    })
                }

                //考勤组 班次的变化
                if(this.attenReportObj[dateStr]){
                        if(this.attenReportObj[dateStr]["groupName"].length > 6){
                            this.groupName = this.attenReportObj[dateStr]["groupName"].substring(0,6)+"..."
                        }else{
                            this.groupName = this.attenReportObj[dateStr]["groupName"]
                        }
                        if(this.attenReportObj[dateStr]["shiftName"].length > 6){
                            this.shiftName = this.attenReportObj[dateStr]["shiftName"].substring(0,6)+"..."
                        }else{
                            this.shiftName = this.attenReportObj[dateStr]["shiftName"]
                        }
                }
                this.attendanceData = curDayArr
                this.isShowDetails = true
            },
            onChange (val) {
                this.curShowDate = val
                this.curShowWeek = this.getCurDate(val).week
                if(this.calendarData[val]){
                    this.showDetails(val)
                }else{
                    this.attendanceData = []
                    this.isShowDetails = false
                }
            },
            onViewChange (val, count) {//切换视图
                let atten_month = val.firstCurrentMonthDate.substring(0,7)+""
                this.getCalendarData(atten_month)
                this.getGroupNameList(atten_month)

                this.firstCurrentMonthDate = val.firstCurrentMonthDate
                this.lastCurrentMonthDate = val.lastCurrentMonthDate
            },
            goDetail(data){
                this.$router.push({
                    path:'/attendanceHome/attendanceDetail',
                    query:{rowId:data.rowId,companyId:data.companyId}
                })
            },
            renderingDay(arr){
                    this.buildSlotFn = (line, index, data) => {
                        return arr.indexOf(data.date)>=0 ? '<div style="font-size:12px;text-align:center;"><span style="display:inline-block;width:5px;height:5px;background-color:red;border-radius:50%;"></span></div>' : '<div style="height:19px;"></div>'
                    }
            },
            handleMenu(data) {
                if (data.content === '补卡历史记录'){
                    this.$router.push({
                         path:"/attendanceHome/bkReport",
                         query:{
                            cardUrl:this.$route.query.cardUrl,
                            atten_month:this.$route.query.atten_month
                         }
                    })
                } 
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
            getResultCodeName(result,isWQ){
                if(result == "0"){
                    return "正常"
                }else if(result == "1"){
                    return "迟到"
                }else if(result == "2"){
                    return "早退"
                }else if(result == "3"){
                    return "缺卡"
                }else if(result == "4"){
                if(isWQ === 'true'){
                        return "范围外(外勤)"
                    }else{
                        return "范围外"
                    }
                }else if(result == "5"){
                    return "补卡"
                }else if(result == "6"){
                    return "休息"
                }else if(result == "7"){
                    return "缺卡"
                }else{
                    return "异常"
                }
            },
            getTypeName(type){
                let typeName = "上班时间"
                if(type == "clockOut"){
                    typeName = "下班时间"
                }
                return typeName
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
            updateAttenCard(data){//更新打卡
                if(isPc){
                    this.$vux.toast.show({
                        type: 'text',
                        width: '9.5em',
                        text: 'pc端暂不支持更新打卡！'
                    });
                    return
                }
                var params = {
                    "type":data.type,
                    "cardUrl":data.cardUrl,
                    "nextPunchNum":data.attenNum,
                    "companyId":data.companyId,
                    "attendanceDetailId":data.rowId,
                    "attendanceReportId":data.attendanceReportId,
                    "attenSetId":data.attenSetId,

                    "groupType":this.attenSetInfo.groupType,
                    "longitude":this.longitude,
                    "latitude":this.latitude,
                    "addrssName":this.addr
                }
                let url = "/zingbiz/attendance/attenPunch/updateAttendanceResult"
                this.$http.post(url,params).then(res => {
                    this.getCalendarData()
                })
            },
            bkshzBtn(data){
                this.$router.push({
                        path:"/attendanceHome/attendanceRepairDetail",
                        query:{
                            rowId:data.rowId,
                            cardUrl:data.cardUrl,
                            pageType:"punch"
                        }
                })
            },
            goDetail(data){
                this.$router.push({
                    path:'/attendanceHome/attendanceDetail',
                    query:{rowId:data.rowId,companyId:data.companyId}
                })
            },
            bkAttenCard(data,index){
                this.$router.push({
                        path:"/attendanceHome/attendanceRepair",
                        query:{
                            rowId:data.rowId,
                        }
                })
            },
            bkyjjBtn(data){
                this.$router.push({
                        path:"/attendanceHome/attendanceRepairDetail",
                        query:{
                            rowId:data.rowId,
                            cardUrl:data.cardUrl,
                            pageType:"punch"
                        }
                })
            }
        }
    };
</script>

<style lang="stylus"  rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    .right span{
        padding:0px !important;
    }
    .attendanceCalendar{
        height:100%;
    }
    .content{
        overflow-y: scroll;
        height calc(100% - 50px);
    }
    .attenStatus{
        border: 1px solid #ffe7ba;
        background-color: #ffa940;
        margin-left: 10px;
        border-radius: 3px;
        line-height: 20px;
        padding-top: 2px;
        padding-left: 5px;
        padding-right: 5px;
        color: #fff;
        position: absolute;
        right: 0px;
    }
    .atten-title{
        height:30px;
        font-weight: bold;
        line-height: 30px;
        font-size:16px !important;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .left-wrapper-title{
        font-size:14px;
    }
    .divCell{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        height: 40px;
        width: 100%;
        line-height: 40px;
        font-size: 16px;
        background-color: #f5f5f5;
        padding: 0,10px;
        padding-left: 20px;
    }

</style>
