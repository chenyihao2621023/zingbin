<template>
    <div class="tjDay">
        <div style="position:absolute;margin-top:22px;margin-left:20px;z-index:1;">
            <a href="javascript:" style="color:#ff8000" @click="showOrg()" >{{selOrgName}}<i class="iconfont icon-xiajiantou"></i></a>
        </div>
        <cell>
            <datetime format="YYYY-MM-DD" :value="curDate" @on-change="changeDate">
                 <p style="color:#ff8000">{{curDate}}<i class="iconfont icon-xiajiantou"></i></p>
            </datetime>
        </cell>
        <div style='width:150px;height:150px;margin: 0 auto;'>
            <x-circle :percent="proportion" :stroke-width="5" stroke-color="#04BE02">
                <p style="font-size: 9px;color:#ccc;">打卡人数 / 应到人数</p>
                <p style="margin-top: 10px;font-size: 24px;"><strong>{{attenData.peoInNum}} / {{attenData.peoNum}}</strong></p>
                <p style="margin-top: 10px;font-size: 9px;color:#ff8000;" @click="goTjDetail">未打卡{{attenData.peoOutNum}}人></p>
            </x-circle>
        </div>

        <div style="margin-top: 20px;">
            <card>
                <div slot="content" class="card-demo-flex card-demo-content01">
                    <div @click="goTjDayDetail('1','false',attenData.lateInNum)">
                        <strong>{{attenData.lateInNum}}</strong>
                        <p>迟到</p>
                    </div>
                    <div @click="goTjDayDetail('2','false',attenData.eralyOutNum)">
                        <strong>{{attenData.eralyOutNum}}</strong>
                        <p>早退</p>
                    </div>
                    <div @click="goTjDayDetail('4','true',attenData.wqNum)">
                        <strong>{{attenData.wqNum}}</strong>
                        <p>外勤</p>
                    </div>
                    <div @click="goTjDayDetail('4','false',attenData.outOutNum)">
                        <strong>{{attenData.outOutNum}}</strong>
                        <p>范围外</p>
                    </div>
                </div>
            </card>
        </div>
        <!-- 选人组件 -->
        <org-member-picker
                    ref="picker"
                   :initialSelected="initialSelected"
                   :showPicker="showPersonPicker"
                   :multiple="false"
                   :showTab ="showTab"
                   @picked="onPicked"
                   @abort="onAbort">
        </org-member-picker>
    </div>
</template>

<script>
    import OrgMemberPicker from '@/components/orgmemberpicker/OrgMemberPicker';
    import { Cell,Group,Datetime,Card,XCircle} from 'vux'
    export default {
        name: "tjDay",
        components: {
            OrgMemberPicker,
            Cell,Group,Datetime,Card,XCircle
        },
        data() {
            return {
                //搜索
                curDate:"",
                curSelOrg:"",

                //统计数据
                attenData:{},

                //百分比
                proportion:0,
                //部门组件
                initialSelected:[],
                showPersonPicker:false,
                showTab:['org'],
                selOrgName:"点击部门查看",

            };
        },
        created: function () {
            let date = new Date();
            this.curDate = date.getFullYear() + "-" + ((date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
            this.getData();
        },
        methods: {
            getData(){//初始化数据
                let params = {
                    orgId:this.curSelOrg,
                    atten_day:this.curDate
                }
                let url = "/zingbiz/attendance/attendancereport/getAttendanceReportForDay"
                this.$http.post(url,params).then(res => {
                   this.attenData = res.data.data
                   this.proportion = Math.round(this.attenData.peoInNum /this.attenData.peoNum * 10000) / 100.00
                });
            },
            showOrg() {//显示组织
                this.showPersonPicker = true
            },
            onAbort(){//组织返回
                this.selOrgName = "点选部门查看"
                this.curSelOrg = ""
                this.initialSelected = []
                this.getData()
                this.showPersonPicker = false
            },
            onPicked(list) {//选择组织
                this.initialSelected = list.map(item => {
                    let map = {
                        key: item.title,
                        value: item.id,
                        level: this.$refs.picker.getLevel(item.type)
                    };
                    return map;
                })
                if(list.length > 0){
                    this.curSelOrg = list[0].id
                    this.selOrgName = list[0].title
                }else{
                    this.curSelOrg = ""
                    this.selOrgName = "点选部门查看"
                }
                this.getData()
                this.showPersonPicker = false
            },
            changeDate (value) {//选择时间
                this.curDate = value;
                this.getData()
            },
            goTjDetail(){
                this.$router.push({
                    path: "/attendanceHome/tjDetail",
                    query:{
                        atten_day :this.curDate,
                        orgId:this.curSelOrg,
                        peoInNum:this.attenData.peoInNum,
                        peoOutNum:this.attenData.peoOutNum
                    }

                })
            },
            goTjDayDetail(resultCode,isWQ,num){
                if(num > 0){
                    this.$router.push({
                        path: "/attendanceHome/tjDayDetail",
                        query:{
                            resultCode:resultCode,
                            isWQ:isWQ,
                            atten_day :this.curDate,
                            orgId:this.curSelOrg
                        }
                    })
                }
            }
        }
    };
</script>

<style lang="stylus" scoped>
    .card-demo-flex {
        display: flex;
    }
    .card-demo-content01 {
        padding: 10px 0;
    }
    .card-padding {
        padding: 15px;
    }
    .card-demo-flex > div {
        flex: 1;
        text-align: center;
        font-size: 13px;
    }
    .card-demo-flex strong {
        font-size: 16px;
    }
    .card-demo-flex p {
        padding-top:10px;
        color:#ccc;
    }
</style>
