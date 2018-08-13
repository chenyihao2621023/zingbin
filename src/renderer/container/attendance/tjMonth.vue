<template>
    <div  class="tjMonth" style="position:relative;height:100%;">
                <cell value-align="left">
                    <datetime format="YYYY-MM" :value="curDate"  @on-change="change">
                        <p style="color:#ff8000;">{{curDate}}<i class="iconfont icon-xiajiantou"></i></p>
                    </datetime>
                </cell>
                <div style="position: absolute;top:20px;right: 10px;">考勤人数{{totalNum}}人</div>
                <div style="height:5px;background-color: #eaeefb;width:100%;"></div>
                <group>
                    <cell title="迟到" :value="attenData.lateNum" is-link @click.native="goMonthStatus(attenData.lateNum,'1','false')">
                    </cell>
                </group>
                <group>
                    <cell title="早退" :value="attenData.leaveEarlyNum" is-link @click.native="goMonthStatus(attenData.leaveEarlyNum,'2','false')">
                    </cell>
                </group>
                <group>
                    <cell title="缺卡" :value="attenData.qkNum" is-link @click.native="goMonthStatus(attenData.qkNum,'3','false')">
                    </cell>
                </group>
                <group>
                    <cell title="旷工" :value="attenData.kgNum" is-link @click.native="goMonthStatus(attenData.kgNum,'7','false')">
                    </cell>
                </group>
                <group>
                    <cell title="外勤" :value="attenData.wqNum" is-link @click.native="goMonthStatus(attenData.wqNum,'4','true')">
                    </cell>
                </group>
                <group>
                    <cell title="补卡" :value="attenData.fillCardNum" is-link @click.native="goMonthStatus(attenData.fillCardNum,'5','false')">
                    </cell>
                </group>
                <group>
                    <cell title="范围外" :value="attenData.outWorkNum" is-link @click.native="goMonthStatus(attenData.outWorkNum,'4','false')">
                    </cell>
                </group>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import {Group,Cell,Datetime} from 'vux'
    export default {
        name: "tjMonth",
        components: {
            ZingHead,
            Group,Cell,Datetime
        },
        data() {
            return {
                //搜索
                curDate:"",
                totalNum:"",
                attenData:{}

            };
        },

        created: function () {
            let date = new Date();
            this.curDate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1));
            this.getData()
        },
        methods: {
            getData(){//初始化数据
                let url = "/zingbiz/attendance/attendancereport/getAttendanceReportForMonth"
                this.$http.post(url,{atten_month:this.curDate}).then(res => {
                   let retData = res.data.data
                   let totalNum = retData.lateNum + retData.leaveEarlyNum + retData.qkNum
                   + retData.kgNum + retData.wqNum + retData.fillCardNum + retData.outWorkNum
                   this.totalNum = totalNum
                   if(retData.lateNum == 0){
                        retData.lateNum = 0 + "人"
                   }else{
                        retData.lateNum += "人"
                   }
                   if(retData.leaveEarlyNum == 0){
                        retData.leaveEarlyNum = 0 + "人"
                   }else{
                        retData.leaveEarlyNum += "人"
                   }
                   if(retData.qkNum == 0){
                        retData.qkNum = 0 + "人"
                   }else{
                        retData.qkNum += "人"
                   }
                   if(retData.kgNum == 0){
                        retData.kgNum = 0 + "人"
                   }else{
                        retData.kgNum += "人"
                   }
                   if(retData.wqNum == 0){
                        retData.wqNum = 0 + "人"
                   }else{
                        retData.wqNum += "人"
                   }
                   if(retData.fillCardNum == 0){
                        retData.fillCardNum = 0 + "人"
                   }else{
                        retData.fillCardNum += "人"
                   }
                   if(retData.outWorkNum == 0){
                        retData.outWorkNum = 0 + "人"
                   }else{
                        retData.outWorkNum += "人"
                   }
                   this.attenData = retData
                });
            },
            change (value) {//选择时间
                this.curDate = value;
                this.getData()
            },
            goMonthStatus(num,resultCode,isWQ){
                if(num != ''){
                    this.$router.push({
                        path: "/attendanceHome/tjMonthStatus",
                        query:{
                            resultCode:resultCode,
                            isWQ:isWQ,
                            curDate :this.curDate
                        }
                    })
                }
            }
        }
    };
</script>

<style lang="stylus" scoped>
    
</style>
