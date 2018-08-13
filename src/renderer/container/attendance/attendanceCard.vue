 <template>
    <div class="attendanceCard">
        <ZingHead title="考勤打卡">
        </ZingHead>
        <span class="wqTitle" @click="goWQ">外勤考勤</span>
        <div class="content" style="position: relative">
            <GridCard>
                <div slot="cardLeft" class="left">
                    <span  class="ei-avatar ei-avatar-square ei-avatar-lg ei-avatar-image" >
                        <img v-if="userInfo.headImg" :src="userInfo.headImg">
                        <img v-else src="../../assets/img/userDef_.jpg">
                    </span>
                    <div class="left-wrapper">
                        <p class="left-wrapper-title">{{userInfo.userName}}</p>
                        <div v-if="attenSetInfo.groupName == undefined" class="left-wrapper-desc" style="color:#999;">未加入任何考勤组</div>
                        <div v-else class="left-wrapper-desc" style="color:#999;">考勤组：{{attenSetInfo.groupName}}</div>
                    </div>
                </div>
            </GridCard>
            <div style="top: 10px;right: 0px;position: absolute;">
                  <datetime format="YYYY-MM-DD" :value="curDay" @on-change="change" :end-date="endDate">
                       <p>{{curDay}}<i class="iconfont icon-xiajiantou"></i></p>
                  </datetime>
            </div> 
            <cell  title="考勤位置" :value="addressDetail"></cell>
            <cell  title="考勤时间" :value="curDay+'  '+week"></cell>
            <div v-if="curDay == endDate">
                <!-- 当天 -->
                <timeline>
                    <timeline-item v-for="(data, index) in attenDetail" :key="index">
                        <div style="margin-left:5px; padding-top: 10px;">
                            <p style="position: relative">
                                <i  class="icon iconfont icon-ICon-"></i> {{data.title}} &nbsp;{{data.gdDate}}
                                <span v-if="data.resultCodeName" class="attenStatus">{{data.resultCodeName}}</span>
                            </p></br>
                            <p v-if="data.address_Name">
                                  <i class="icon iconfont icon-dizhiguanli"></i> {{data.address_Name}}
                            </p>
                            <div v-if='data.rowId' class="left-wrapper-title atten-title">
                                打卡时间：{{data.generate_time}}
                            </div>
                            <div v-if="data.rowId && data.resultCode == '0'">
                                <span class="left-wrapper-title" style="color:#ff8000" @click="updateAttenCard(data)">更新打卡 ></span>&nbsp;&nbsp;&nbsp;&nbsp;
                                <span v-if="data.isReview && data.isReview == '1'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡已审核 ></span>
                            </div>
                            <div v-if="data.rowId && data.resultCode != '0'">
                                <span class="left-wrapper-title" style="color:#ff8000" @click="updateAttenCard(data)">更新打卡 ></span>&nbsp;&nbsp;&nbsp;&nbsp;
                                <span class="left-wrapper-title" style="color:#ff8000" @click="goDetail(data)">查看备注 ></span>&nbsp;&nbsp;&nbsp;&nbsp;
                                <span v-if="!data.isReview" class="left-wrapper-title" style="color:#ff8000" @click="bkAttenCard(data,index)">申请补卡 ></span>
                                <span v-if="data.isReview && data.isReview == '0'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡审核中 ></span>
                                <span v-if="data.isReview && data.isReview == '2'" class="left-wrapper-title" style="color:#ff8000" @click="bkyjjBtn(data)">补卡已拒绝 ></span>
                                <span v-if="data.isReview && data.isReview == '1'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡已审核 ></span>
                            </div>
                           
                            <div  v-if="punchBtnIndex == index" @click="checkClick(data,index)" class="divForAttendanceCard">
                                <i class="weui-icon-text weui-icon_msgText yellowBtn">
                                    <p style="color: white;margin-top:10px;">{{data.btnName}}</p>
                                    <p style="color: white;margin-top:4px;">{{curTime}}</p>
                                </i>
                            </div>
                        </div>
                    </timeline-item>
                </timeline>
                <p class="noData" v-if="attenMess !='' "  style="margin-bottom: 30px;">{{attenMess}}</p>
            </div>
            <div v-else>
                <!-- 以往的 -->
                <timeline>
                    <timeline-item v-for="(data, index) in attenDetail" :key="index">
                        <div style="margin-left:5px; padding-top: 10px;">
                            <p style="position: relative">
                                <i  class="icon iconfont icon-ICon-"></i> {{data.title}} &nbsp;{{data.gdDate}}
                                <span v-if="data.resultCodeName" class="attenStatus">{{data.resultCodeName}}</span>
                            </p>
                            <p v-if="data.address_Name">
                                    <i class="icon iconfont icon-dizhiguanli"></i> {{data.address_Name}}
                            </p>
                            <div v-if='data.rowId' class="left-wrapper-title atten-title">
                                打卡时间：{{data.generate_time}}
                            </div>
                            <div v-if="data.rowId && data.resultCode == '0'">
                                <span v-if="data.isReview && data.isReview == '1'" class="left-wrapper-title" style="color:#ff8000" @click="bkshzBtn(data)">补卡已审核 ></span>
                            </div>
                            <div v-if="data.rowId && data.resultCode != '0'">
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
        </div>
        <!-- 考勤备注组件 -->
        <attendance-remark
            :paramesData="formData"
            :showAttendanceRemark="showAttendanceRemark"
            @backClick="goAtten"
            @submit="submit"
            @cancel="goAtten">
        </attendance-remark>
    </div>
</template>

<script>
    import GridCard from '@/components/gridcard/GridCard';
    import ZingHead from "@/components/zingHead/ZingHead";
    import attendanceRemark from './components/attendanceRemark';
    import { Toast,FormPreview,Timeline, TimelineItem,Cell ,Datetime } from 'vux'
    //地图
    import { getWXLocationHX ,getQMapLocation} from '@/utils/wx'
    import { mapState, mapMutations } from 'vuex'
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";

    export default {
        components: {
            GridCard,ZingHead,Toast,attendanceRemark,FormPreview,Timeline,
            TimelineItem,Cell,Datetime,
            getWXLocationHX,getQMapLocation
        },
        data() {
            return {
                addr:"",//打卡位置详情
                addressDetail:"",//考勤位置详情
                endDate:"",
                curDay:"",
                curTime:"",
                week:"",
                isPc:false ,//pc  端的状态

                formData:{},
                userInfo:{},//用户数据
                attenSetInfo:{},//考勤配置数据
                attenDetail:[],//考勤打卡明细的数据
                attenDetailData:[],

                showAttendanceRemark:false,//备注组件是否显示的标识
                remarkData:{},//备注组件的数据
               
                longitude:116.30242,//经度
                latitude:40.05346,//纬度
                nextPunchNum:"",//今天第几次打卡
                regulationsDate:"",//初始打卡时间
                punchBtnIndex:0,
                attenMess:"",

                shiftName:"",//班次名称
                groupName:""//考勤组名称
            };
        },
        computed: {
            ...mapState({
                wxLocationStatus: state => state.wx.wxLocationStatus,
                wxLocation: state => state.wx.wxLocation
            })
        },
        watch: {
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
            curDay(dateStr){
                this.week = this.getWeek(dateStr)
            }
        },
        created() {
            if (isWeiXin() || isMhApp()) {
                getWXLocationHX();
                getQMapLocation();
                this.isPc  = false
            }else{
                this.$vux.toast.show({
                    type: 'text',
                    width: '9.5em',
                    text: '请在微信端打开！'
                });
                this.isPc  = true
            }

            this.mapHeight = document.documentElement.clientHeight/2 ;
            //考勤配置的id
            this.curDay = this.getCurDate().nyr
            this.endDate = this.getCurDate().nyr

            let weekNum = this.getCurDate().weekNum
            this.getNeedData();
            this.handleCurTime();

            if(this.addr == ""){
                setTimeout(() =>{
                     getQMapLocation();
                },3000)
            }
        },
        methods: {
            getNeedData(){//初始化页面数据
                let _this = this
                let url = "/zingbiz/attendance/attenPunch/getAttenPunchData"
                this.$http.post(url,{atten_day:this.curDay}).then(res => {
                    let retData = res.data.data;
                    if(!retData && !retData.type){
                        return false;
                    }
                    if(retData.userInfo){
                        this.userInfo = retData.userInfo
                    }
                    if(retData.type === 'noAtten'){
                        this.attenMess = "管理员当天未给你排班！"
                        return false;
                    }else if(retData.type === 'moreOrg' || retData.type === 'orgRoleConflict'){
                        this.attenMess = "所属考勤组冲突，请联系管理员！"
                        return false;
                    }
                    if(retData.attenSetInfo){
                        this.attenSetInfo = retData.attenSetInfo
                        if(retData.attenSetInfo.addressDetail){
                            this.addressDetail = retData.attenSetInfo.addressDetail
                        }
                        if(retData.attenSetInfo.groupName){
                            this.groupName = retData.attenSetInfo.groupName
                        }
                        if(retData.attenDateInfo.dateName){
                            this.shiftName = retData.attenDateInfo.dateName
                        }
                        if(this.attenSetInfo  && this.attenSetInfo.groupName && this.attenSetInfo.groupName.length > 10){
                            this.attenSetInfo.groupName = this.attenSetInfo.groupName.substring(0,10)+"..."
                        }
                    }
                    if(retData.attenSetInfo && retData.attenSetInfo.weekdays){
                        let weekdays = retData.attenSetInfo.weekdays
                        let weekNum = this.getCurDate().weekNum
                        if(weekdays.indexOf(weekNum) < 0){
                            this.attenMess = "休息日，无需打卡！"
                            return false;
                        }
                    }
                    if(retData.attenDateInfo){
                        let attenDateInfo = retData.attenDateInfo
                        let attenDetailData = []
                        if(attenDateInfo){
                            if(attenDateInfo.dateType == '1'){
                                attenDetailData.push({'btnName':'签到','type':"clockIn",'title':"上班时间",'gdDate':attenDateInfo.one_signIn_Date,'gdNum':'1'});
                                attenDetailData.push({'btnName':'签退','type':"clockOut",'title':"下班时间",'gdDate':attenDateInfo.one_signOut_Date,'gdNum':'2'});
                            }else if(attenDateInfo.dateType == '2'){
                                attenDetailData.push({'btnName':'签到','type':"clockIn",'title':"上班时间",'gdDate':attenDateInfo.one_signIn_Date,'gdNum':'1'});
                                attenDetailData.push({'btnName':'签退','type':"clockOut",'title':"下班时间",'gdDate':attenDateInfo.one_signOut_Date,'gdNum':'2'});
                                attenDetailData.push({'btnName':'签到','type':"clockIn",'title':"上班时间",'gdDate':attenDateInfo.two_signIn_Date,'gdNum':'3'});
                                attenDetailData.push({'btnName':'签退','type':"clockOut",'title':"下班时间",'gdDate':attenDateInfo.two_signOut_Date,'gdNum':'4'});
                            }else if(attenDateInfo.dateType == '3'){
                                attenDetailData.push({'btnName':'签到','type':"clockIn",'title':"上班时间",'gdDate':attenDateInfo.one_signIn_Date,'gdNum':'1'});
                                attenDetailData.push({'btnName':'签退','type':"clockOut",'title':"下班时间",'gdDate':attenDateInfo.one_signOut_Date,'gdNum':'2'});
                                attenDetailData.push({'btnName':'签到','type':"clockIn",'title':"上班时间",'gdDate':attenDateInfo.two_signIn_Date,'gdNum':'3'});
                                attenDetailData.push({'btnName':'签退','type':"clockOut",'title':"下班时间",'gdDate':attenDateInfo.two_signOut_Date,'gdNum':'4'});
                                attenDetailData.push({'btnName':'签到','type':"clockIn",'title':"上班时间",'gdDate':attenDateInfo.three_signIn_Date,'gdNum':'5'});
                                attenDetailData.push({'btnName':'签退','type':"clockOut",'title':"下班时间",'gdDate':attenDateInfo.three_signOut_Date,'gdNum':'6'});
                            }else if(attenDateInfo.dateType == 'special'){
                                attenDetailData.push({'btnName':'签到','type':"clockIn",'title':"上班打卡",'gdDate':attenDateInfo.one_signIn_Date,'gdNum':'1'});
                                attenDetailData.push({'btnName':'签退','type':"clockOut",'title':"下班打卡",'gdDate':attenDateInfo.one_signOut_Date,'gdNum':'2'});
                            }else{
                                this.attenMess = '今日休息，无需打卡！'
                            }
                        }
                        this.attenDetailData = attenDetailData
                        //处理打卡明细数据
                        this.dealRetData(retData.attenDetail)
                    }
                })
            },
            checkClick(data,index){//签到签退按钮
                if(this.regulationsDate == ""){
                    this.regulationsDate = new Date().getTime();
                }else{
                    let curTime = new Date().getTime();
                    var valTime = curTime - this.regulationsDate;
                    if(valTime < 15000){//15秒
                        this.$vux.toast.text("15秒内不能连续打卡！", 'bottom')
                        return false;
                    }else{
                        this.regulationsDate = curTime;
                    }
                }
                var params = {
                    "type":data.type,
                    "atten_week":this.getCurDate().week,
                    "groupType":this.attenSetInfo.groupType,
                    "attenSetId":this.attenSetInfo.rowId,
                    "longitude":this.longitude,
                    "latitude":this.latitude,
                    "nextPunchNum":index+1,
                    "curDay":this.curDay,
                    "gd_date":data.gdDate,
                    "address_Name":this.addr,
                    "shiftName":this.shiftName,
                    "groupName":this.groupName
                }

                let url = "/zingbiz/attendance/attenPunch/getAttendanceResult"
                let _this = this
                this.$http.post(url,params).then(res => {
                        let retData = res.data.data
                        if(retData.resultCode == "0"){//正常
                            let mess = "操作成功！"
                            if(params.type == 'clockIn'){
                                mess = "签到成功！"
                            }else if(params.type == 'clockOut'){
                                mess = "签退成功！"
                            }
                            this.$vux.toast.show({text:mess,type:"success",onHide () {
                                _this.dealRetData(retData.attenDetail)
                            }})
                        }else{//迟到早退 ，，处理的数据
                            params.resultCode = retData.resultCode
                            params.remark = ""
                            this.formData = params
                            this.showAttendanceRemark = true
                        }

                });
            },
            submit(data){//备注页面的提交按钮
                let _this = this
                let url = " /zingbiz/attendance/attenPunch/ordinaryPunch"
                this.$http.post(url,data).then(res => {
                    let retData = res.data.data
                    this.$vux.toast.show({
                            text: "操作成功!",
                            type: "success",
                            onHide () {
                                _this.dealRetData(retData)
                                _this.showAttendanceRemark = false;
                            }
                    })
                })
            },
            goAtten(){//返回签到签退页面
                this.showAttendanceRemark = false;
            },
           
            updateAttenCard(data){//更新打卡
                var params = {
                    "type":data.type,
                    "groupType":this.attenSetInfo.groupType,
                    "attenSetId":this.attenSetInfo.rowId,
                    "longitude":this.longitude,
                    "latitude":this.latitude,
                    "nextPunchNum":data.attenNum,
                    "cardUrl":data.cardUrl,
                    "companyId":data.companyId,
                    "attendanceDetailId":data.rowId,
                    "attendanceReportId":data.attendanceReportId,
                    "curDay":this.curDay,
                    "addrssName":this.addr
                }
                let url = "/zingbiz/attendance/attenPunch/updateAttendanceResult"
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    this.attenDetail = []
                    this.dealRetData(retData)
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
            bkyjjBtn(data){
                this.$router.push({
                        path:"/attendanceHome/attendanceRepairDetail",
                        query:{
                            rowId:data.rowId,
                            cardUrl:data.cardUrl,
                            pageType:"punch"
                        }
                })
            },
            handleCurTime(){
                setInterval(() => {
                    this.curTime = this.getCurDate().sfm;
                }, 1000)
            },
            getCurDate(){
                let dateObj = new Date(); //表示当前系统时间的Date对象
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
                    week:week,
                    weekNum:day
                }

            },
            getWeek(dateStr){
                 let dateArray = dateStr.split("-")
                 let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2])
                 return "星期" + "日一二三四五六".charAt(date.getDay())
            },
            getResultCodeName(result){
                if(result == "0"){
                    return "正常"
                }else if(result == "1"){
                    return "迟到"
                }else if(result == "2"){
                    return "早退"
                }else if(result == "3"){
                    return "缺卡"
                }else if(result == "4"){
                    return "范围外"
                }else if(result == "5"){
                    return "补卡"
                }else if(result == "6"){
                    return "休息"
                }else if(result == "7"){
                    return "旷工"
                }else{
                    return "异常"
                }
            },
            getTypeName(type){
                if(type == "clockIn"){
                    return "上班打卡"
                }else if(type == "clockOut"){
                    return "下班打卡"
                }
                
            },
            change(value){
                this.curDay = value;
                this.getNeedData()
            },
            goWQ(){
                this.$router.push({
                        path:"/attendanceHome/fieldAttendance"
                })
            },
            dealRetData(detailData){
                let attenDetail = {}
                detailData.forEach(item =>{
                    item.typeName = this.getTypeName(item.type)
                    item.resultCodeName = this.getResultCodeName(item.resultCode)
                    attenDetail[item.attenNum] =  item
                })
                this.attenDetailData.forEach(item =>{
                    let newItem = attenDetail[item.gdNum]
                    if(newItem){
                        for (var p in newItem){
                            item[p] = newItem[p];
                        }
                    }
                })

                this.punchBtnIndex = detailData.length;
                this.attenDetail = this.attenDetailData

                if(detailData.length != 0 && detailData.length == this.attenDetail.length){
                    this.attenMess = "今日已完成打卡！"
                }
            },
            goDetail(data){
                this.$router.push({
                    path:'/attendanceHome/attendanceDetail',
                    query:{rowId:data.rowId,companyId:data.companyId}
                })
            },
        }
    };
</script>
<style>
    .content .vux-timeline-item-content{
         padding-bottom: 40px;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    
    .grid-card{
        padding: 10px 13px;
    }
    .attendanceCard {
        height: 100%;
    }


    .yellowBtn {
        background-color: #f1b752;
    }
    .weui-icon_msgText {
        height: 93px;
        width: 93px;
        border-radius: 50%;
        text-align: center;
    }
    .weui-icon-text:before {
        content: attr(data-text);
        display: inline-block;
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        font-size: 13px;
        color: white;
    }
    
    .content{
        overflow-y: scroll;
        height calc(100% - 50px);
    }
    .noData{
        text-align: center;
        font-size: 16px;
        color: #ff8000;
        padding-top: 15px;
    }
    .vux-datetime.weui-cell.weui-cell_access{
        float: right;
    }

    .atten-title{
        height:30px;
        font-weight: bold;
        line-height: 30px;
        font-size:16px !important;
        margin-top: 10px;
        margin-bottom: 10px;
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
    .divForAttendanceCard{
        margin:0 auto;
        width:100px;
        margin-top: 30px;
    }
    .left-wrapper-title{
        font-size:16px;
    }
    .wqTitle{
        font-size: 14px;
        text-align: center;
        width: 65px;
        height: 30px;
        line-height: 30px;
        color: #ff8000;
        border-radius: 5px;
        border: 1px solid #ff8000;
        margin-top: 10px;
        margin-right: 10px;
        top: 0;
        right: 0;
        position: absolute;
        
    }
</style>

