<template>
    <div  class="tjMonthDetail">
        <!-- 头部 -->
        <zing-head :title="title"></zing-head>

        <div class="content" :style="{ height: screenHeight + 'px'}">
                <div style="position: relative">
                    <datetime
                        format="YYYY-MM"
                        :value="curMonth"
                        @on-change="change">
                        <p style="color:#ff8000;">{{curMonth}}<i class="iconfont icon-xiajiantou"></i></p>
                    </datetime>
                    <div style="position: absolute;top:10px;right: 13px;">
                        <a href="javascript:void(0);" @click="openYL" style="color:#ff8000;">
                                <i class="iconfont icon-kaoqintongji"></i>
                         打卡月历</a>
                    </div>
                </div>
                <GridCard>
                    <div slot="cardLeft" class="left">
                        <div v-if="myData.headImg && myData.headImg != ''">
                            <Avatar :src="myData.headImg"></Avatar>
                        </div>
                        <div v-else>
                             <Avatar src="../../assets/img/userDef_.jpg"></Avatar>
                        </div>
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{myData.userName}}</p>
                            <div class="left-wrapper-desc">考勤组：{{myData.groupName}}</div>
                        </div>
                    </div>
                </GridCard>
                <div style="height:5px;background-color: #eaeefb;width:100%;"></div>
                <group>
                    <cell title="迟到"
                      is-link
                      :value="attenCountData.lateNum"
                      :arrow-direction="showContent4 ? 'up' : 'down'"
                      @click.native="cellClick(4)">
                    </cell>
                    <template v-if="showContent4">
                            <cell-box class="sub-item" is-link v-for="(item ,index) in myData.lateNum" :key="index" @click.native="goAttenDetail(item.rowId,item.companyId)">
                            {{item.atten_day}}({{item.atten_week}})</cell-box>
                    </template>
                </group>
                <group>
                    <cell title="早退"
                      is-link
                      :value="attenCountData.leaveEarlyNum"
                      :arrow-direction="showContent5 ? 'up' : 'down'"
                      @click.native="cellClick(5)">
                    </cell>
                    <template v-if="showContent5">
                            <cell-box class="sub-item" is-link v-for="(item ,index) in myData.leaveEarlyNum" :key="index" @click.native="goAttenDetail(item.rowId,item.companyId)">
                            {{item.atten_day}}({{item.atten_week}})</cell-box>
                    </template>
                </group>
                <group>
                    <cell title="缺卡"
                      is-link
                      :value="attenCountData.qkNum"
                      :arrow-direction="showContent6 ? 'up' : 'down'"
                      @click.native="cellClick(6)">
                    </cell>
                    <template v-if="showContent6">
                            <cell-box class="sub-item" is-link v-for="(item ,index) in myData.qkNum" :key="index" >
                            {{item.atten_day}}({{item.atten_week}})</cell-box>
                    </template>
                </group>
                <group>
                    <cell title="旷工"
                      is-link
                      :value="attenCountData.kgNum"
                      :arrow-direction="showContent7 ? 'up' : 'down'"
                      @click.native="cellClick(7)">
                    </cell>
                    <template v-if="showContent7">
                            <cell-box class="sub-item" is-link v-for="(item ,index) in myData.kgNum" :key="index">
                            {{item.atten_day}}({{item.atten_week}})</cell-box>
                    </template>
                </group>
                <group>
                    <cell title="外勤"
                      is-link
                      :value="attenCountData.wqNum"
                      :arrow-direction="showContent8 ? 'up' : 'down'"
                      @click.native="cellClick(8)">
                    </cell>
                    <template v-if="showContent8">
                            <cell-box class="sub-item" is-link v-for="(item ,index) in myData.wqNum" :key="index" @click.native="goAttenDetail(item.rowId,item.companyId)">
                            {{item.atten_day}}({{item.atten_week}})</cell-box>
                    </template>
                </group>
                <group>
                    <cell title="补卡"
                      is-link
                      :value="attenCountData.fillCardNum"
                      :arrow-direction="showContent9 ? 'up' : 'down'"
                      @click.native="cellClick(9)">
                    </cell>
                    <template v-if="showContent9" >
                            <cell-box class="sub-item" is-link v-for="(item ,index) in myData.fillCardNum" :key="index" @click.native="goBkDetail(item)">
                            {{item.atten_day}}({{item.atten_week}})</cell-box>
                    </template>
                </group>
                <group>
                    <cell title="范围外"
                      is-link
                      :value="attenCountData.outWorkNum"
                      :arrow-direction="showContent10 ? 'up' : 'down'"
                      @click.native="cellClick(10)">
                    </cell>
                    <template v-if="showContent10" >
                            <cell-box class="sub-item" is-link v-for="(item ,index) in myData.outWorkNum" :key="index"  @click.native="goAttenDetail(item.rowId,item.companyId)">
                            {{item.atten_day}}({{item.atten_week}})</cell-box>
                    </template>
                </group>
        </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from '@/components/gridcard/GridCard';
    import Avatar from "@/components/avatar/Avatar"
    import {Group,Datetime,Cell,CellBox} from 'vux'

    export default {
        name: "tjMe",
        components: {
            ZingHead,GridCard,Avatar,
            Group,Datetime,Cell,CellBox
        },
        data() {
            return {
                myData:{},
                attenCountData:{},

                showContent4:false,
                showContent5:false,
                showContent6:false,
                showContent7:false,
                showContent8:false,
                showContent9:false,
                showContent10:false,
                screenHeight:"0",
                title:"明细",
                isWQ:false
            };
        },
        //钩子加载完触发
        created: function () {
            this.isWQ = this.$route.query.isWQ
            this.screenHeight = document.documentElement.clientHeight - 50;
            let date = new Date();
            this.curMonth = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
            this.dealTitle()
            this.getMyData();
        },
        methods: {
            cellClick(index){
                if(index == 4){
                    this.showContent4 = !this.showContent4
                    this.showContent5 = false
                    this.showContent6 = false
                    this.showContent7 = false
                    this.showContent8 = false
                    this.showContent9 = false
                    this.showContent10 = false
                }else if(index == 5){
                    this.showContent4 = false
                    this.showContent5 = !this.showContent5
                    this.showContent6 = false
                    this.showContent7 = false
                    this.showContent8 = false
                    this.showContent9 = false
                    this.showContent10 = false
                }else if(index == 6){
                    this.showContent4 = false
                    this.showContent5 = false
                    this.showContent6 = !this.showContent6
                    this.showContent7 = false
                    this.showContent8 = false
                    this.showContent9 = false
                    this.showContent10 = false
                }else if(index == 7){
                    this.showContent4 = false
                    this.showContent5 = false
                    this.showContent6 = false
                    this.showContent7 = !this.showContent7
                    this.showContent8 = false
                    this.showContent9 = false
                    this.showContent10 = false
                }else if(index == 8){
                    this.showContent4 = false
                    this.showContent5 = false
                    this.showContent6 = false
                    this.showContent7 = false
                    this.showContent8 = !this.showContent8
                    this.showContent9 = false
                    this.showContent10 = false
                }else if(index == 9){
                    this.showContent4 = false
                    this.showContent5 = false
                    this.showContent6 = false
                    this.showContent7 = false
                    this.showContent8 = false
                    this.showContent9 = !this.showContent9
                    this.showContent10 = false
                }else if(index == 10){
                    this.showContent4 = false
                    this.showContent5 = false
                    this.showContent6 = false
                    this.showContent7 = false
                    this.showContent8 = false
                    this.showContent9 = false
                    this.showContent10 = !this.showContent10
                }
                
            },
            dealTitle(){
                let resultCode = this.$route.query.resultCode
                let isWQ = this.$route.query.isWQ
                if(resultCode === '1'){
                    this.title = "迟到"
                    this.showContent4 = true
                }else if(resultCode === '2'){
                    this.title = "早退"
                    this.showContent5 = true
                }else if(resultCode === '3'){
                    this.title = "缺卡"
                    this.showContent6 = true
                }
                else if(resultCode === '4'){
                    if(isWQ === 'true'){
                        this.title = "外勤"
                        this.showContent8 = true
                    }else{
                        this.title = "范围外"
                        this.showContent10 = true
                    }
                }else if(resultCode === '5'){
                    this.title = "补卡"
                    this.showContent9 = true
                }else if(resultCode === '7'){
                    this.title = "旷工"
                    this.showContent7 = true
                }
            },
            change (value) {//选择时间
                this.curMonth = value;
                this.getMyData();
            },
            getMyData(){
                let url = "/zingbiz/attendance/attendancereport/getMyModel"
                this.$http.post(url,{
                    atten_month:this.curMonth,
                    cardUrl:this.$route.query.cardUrl
                }).then(res => {
                    let retData = res.data.data
                    this.myData = retData
                    let attenCountData = {}
                    if(retData.lateNum && retData.lateNum.length > 0){
                        attenCountData.lateNum = retData.lateNum.length + "次"
                    }else{
                       attenCountData.lateNum = 0 + "次"
                    }
                    if(retData.leaveEarlyNum && retData.leaveEarlyNum.length > 0){
                        attenCountData.leaveEarlyNum = retData.leaveEarlyNum.length + "次"
                    }else{
                       attenCountData.leaveEarlyNum = 0 + "次"
                    }
                    if(retData.qkNum && retData.qkNum.length > 0){
                        attenCountData.qkNum = retData.qkNum.length + "次"
                    }else{
                       attenCountData.qkNum = 0 + "次"
                    }
                    if(retData.kgNum && retData.kgNum.length > 0){
                        attenCountData.kgNum = retData.kgNum.length + "次"
                    }else{
                       attenCountData.kgNum = 0 + "次"
                    }
                    if(retData.wqNum && retData.wqNum.length > 0){
                        attenCountData.wqNum = retData.wqNum.length + "次"
                    }else{
                       attenCountData.wqNum = 0 + "次"
                    }
                    if(retData.fillCardNum && retData.fillCardNum.length > 0){
                        attenCountData.fillCardNum = retData.fillCardNum.length + "次"
                    }else{
                       attenCountData.fillCardNum = 0 + "次"
                    }
                    if(retData.outWorkNum && retData.outWorkNum.length > 0){
                        attenCountData.outWorkNum = retData.outWorkNum.length + "次"
                    }else{
                       attenCountData.outWorkNum = 0 + "次"
                    }
                    this.attenCountData  = attenCountData
                   
                });
            },
            goAttenDetail(id,companyId){
                this.$router.push({
                    path: "attendanceDetail",
                    query: {
                        rowId:id,
                        companyId:companyId
                    }
                });
            },
            goBkDetail(data){
                this.$router.push({
                        path:"/attendanceHome/attendanceRepairDetail",
                        query:{
                            rowId:data.rowId,
                            cardUrl:data.cardUrl,
                            pageType:"punch"
                        }
                })
            },
            openYL(){
                let params = {
                    cardUrl:this.myData.cardUrl,
                    atten_day:this.getCurDate().nyr,
                    atten_month:this.curMonth,
                    resultCode:"",
                    isWQ:this.isWQ
                }
                this.$router.push({path: "attendanceCalendar",query: params});
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
                    week:week
                }

            }
        }
    };
</script>

<style lang="stylus" scoped>
    .tjMonthDetail{
        display flex
        flex-direction column
        width 100%
        height 100%
    }
    .content{
        flex-grow 1;
        overflow-y auto;
    }
</style>
