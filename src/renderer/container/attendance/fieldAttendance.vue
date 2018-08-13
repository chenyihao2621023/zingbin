<template>
    <div class="fieldAttendance">
            <ZingHead title="外勤考勤">
            </ZingHead>
            <div class="content">
                <group  label-margin-right="2em" label-align="left">
                    <cell  title="当前商号" :value="companyName"></cell>
                    <cell  title="当前日期" :value="curDate"></cell>
                    <cell  title="考勤时间" :value="curTime"></cell>
                    <cell is-link :value="reviewName" @click.native="selectInputPerson">
                             <span slot="title">考勤审核人<span style='color:red'>*</span></span>
                    </cell>
                    <cell  title="当前位置" :value="addr"></cell>
                    <cell  title="点击查看考勤位置" is-link @click.native="openLocation"></cell>
                    <!--显示地图-->
                    <!-- <div v-if="addressCanShow" class="mapDiv" :style="{ height: mapHeight + 'px'}">
                        <iframe
                            width="100%"
                            height="100%"
                            frameborder="0"
                            scrolling="no"
                            :src="address">
                        </iframe>
                    </div>
                    <div v-else style="width:100%;height:40%;text-align: center;border:1px solid #eaeefb">
                        <p style="margin-top:10px;">正在加载中，请稍等</p>
                    </div> -->
                    <cell></cell>
                </group>
                <flexbox style="position: absolute;bottom: 0px;">
                        <flexbox-item>
                            <x-button v-if="btnType == '提交'" type="primary" class="btn-common"  @click.native="commitBtn">提交</x-button>
                            <x-button v-if="btnType == '已提交'" type="primary" class="btn-common">已提交</x-button>
                        </flexbox-item>
                </flexbox>
            </div>

            <!-- 选人组件 -->
            <org-member-picker
                   :showPicker="showPersonPicker"
                   :multiple="false"
                   :showTab=showTab
                   :designatedCardUrls=designatedCardUrls
                   :initialSelected="attenUserList"
                   @picked="onPicked"
                   @abort="onPickAbort">
            </org-member-picker>

            <!-- 备注组件  -->
            <attendance-remark
                   :paramesData="paramesData"
                   :showAttendanceRemark="showAttendanceRemark"
                   @backClick="backClick"
                   @submit="submit"
                   @cancel="cancel">
           </attendance-remark>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead"
    import OrgMemberPicker from 'components/orgmemberpicker/OrgMemberPicker';
    import attendanceRemark from './components/attendanceRemark';
    import {Group, XInput, XButton, Flexbox, FlexboxItem,Toast,Cell } from 'vux'

    /*地图所需引入的*/
    import { getWXLocationHX,getQMapLocation,getQMapLocationSrc,dispWXLocationHX} from '@/utils/wx'
    import { mapState, mapMutations } from 'vuex'
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";

    export default {
        components: {
            ZingHead, OrgMemberPicker,attendanceRemark,
            XInput, XButton, Flexbox, FlexboxItem,Toast,Cell,Group,
            getWXLocationHX,getQMapLocation
        },
        data() {
            return {
                formData:{//提交的数据
                    rowId:"",
                    atten_week:this.getCurDate().week,
                    addressPos:"116.30242,40.05346",
                    remark:"",
                    reviewCardUrl:"",
                    reviewRealName:"",
                    companyId:"",
                    resultCode:"4"
                },

                curDate:"",
                curTime:"",
                curCardUrl:"",//当前用户的cardUrl
                companyName:"",//服务号名称
                reviewName:"请选择考勤审核人",//审核人的名称
                addr:"",
                openAddr:"",
                btnType:"提交",

                showAttendanceRemark:false,//备注组件是否显示的标识
                paramesData:{},//备注组件所需要的数据

                showPersonPicker: false,//选人组件是否显示的标识
                showTab:["designatedPersonnel"],//选人组件显示的tab
                designatedCardUrls:[],//选人组件初始化的人员数据
                attenUserList:[],//选人组件回显数据展示

                //address:"",//地图显示的地址
                //mapHeight:"",//地图显示的高度
                //addressCanShow:true,//地图组件是否显示的标识
            }
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
                        //this.addressCanShow = false;
                        break
                    case 'success':
                        //this.addressCanShow = true;
                        this.addr = this.wxLocation.addr;
                        this.longitude = this.wxLocation.longitude;
                        this.latitude = this.wxLocation.latitude;
                        this.openAddr = this.wxLocation.latitude +"_"+this.wxLocation.longitude

                        //let positionSrc = getQMapLocationSrc({lat: this.wxLocation.latitude,lng: this.wxLocation.longitude}, '位置信息')
                        //this.address = positionSrc
                        this.formData.addressPos = this.wxLocation.longitude+","+this.wxLocation.latitude
                        break
                    case 'failed':
                        //this.addressCanShow = false;
                        break
                }
            },
        },
        created() {
            if (isWeiXin() || isMhApp()) {
                getWXLocationHX()
                getQMapLocation()
            }else{
                this.$vux.toast.text("请在微信端打开!", 'bottom')
            }
             //处理日期显示
            this.curDate = this.getCurDate().nyr + " " + this.getCurDate().week;
            //this.mapHeight = document.documentElement.clientHeight/2 ;
             //处理时间显示
            this.handleCurTime();
            //获取RowId
            this.getRowId()
            //获取具有外勤审核权限的人员
            this.getWQAuth()

            if(this.addr == ""){
                setTimeout(() =>{
                     getQMapLocation();
                },3000)
            }
        },
        methods: {
            getWQAuth(){
                let url = "/zingbiz/auth/user/getUserByResInfoVal"
                let params = {resInfoVal:"40-80",pageSize:"500"}
                this.$http.post(url,params).then(res => {
                    let userList = res.data.data.user
                    let roleResList = res.data.data.roleRes
                    let userCard = []
                    roleResList.forEach(res =>{
                        userList.forEach(user => {
                            if(res.roleInfoId == user.roleCode){
                                    userCard.push(""+user.cardUrl)
                            }
                        })
                    })
                    this.designatedCardUrls = userCard



                })
            },
            commitBtn() {//提交按钮
                if (this.formData.reviewCardUrl === "") {
                    this.$vux.toast.text("请选择审核人!", 'bottom')
                    return false
                } else if (this.formData.reviewCardUrl === this.curCardUrl) {
                    this.$vux.toast.text("审核人不能选自己!", 'bottom')
                    return false
                }
                this.paramesData = this.formData
                this.showAttendanceRemark = true
            },
            handleCurTime() {
                setInterval(() => {
                    this.curTime = this.getCurDate().sfm
                }, 1000)
            },
            getCurDate() {
                let dateObj = new Date(); //表示当前系统时间的Date对象
                let year = dateObj.getFullYear(); //当前系统时间的完整年份值
                let month = dateObj.getMonth() + 1; //当前系统时间的月份值
                let date = dateObj.getDate(); //当前系统时间的月份中的日
                let day = dateObj.getDay(); //当前系统时间中的星期值
                let weeks = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
                let week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
                let hour = dateObj.getHours(); //当前系统时间的小时值
                let minute = dateObj.getMinutes(); //当前系统时间的分钟值
                let second = dateObj.getSeconds(); //当前系统时间的秒钟值
                //如果月、日、小时、分、秒的值小于10，在前面补0
                if (month < 10) {
                    month = "0" + month;
                }
                if (date < 10) {
                    date = "0" + date;
                }
                if (hour < 10) {
                    hour = "0" + hour;
                }
                if (minute < 10) {
                    minute = "0" + minute;
                }
                if (second < 10) {
                    second = "0" + second;
                }
                return {
                    nyr:year + "-" + month + "-" + date,
                    sfm:hour + ":" + minute + ":" + second,
                    week:week
                }

            },
            selectInputPerson() {//展现选人组件
                this.showPersonPicker = true
            },
            onPickAbort() {//选人组件返回按钮
                this.showPersonPicker = false
            },
            onPicked(list) {//选中人员的回调
                let retData = list[0]
                this.formData.reviewCardUrl = retData.cardUrl
                this.formData.reviewRealName = retData.userName
                this.reviewName = retData.userName
                this.showPersonPicker = false
                this.attenUserList = []
                this.attenUserList.push({
                        value:retData.cardUrl,
                        type:"user"
                })
            },
            getRowId() {
                  this.$http.post("/zingbiz/attendance/attenPunch/getRowId",{
                  }).then(res => {
                      this.formData.rowId = res.data.data.rowId
                      this.formData.companyId = res.data.data.companyId
                      this.curCardUrl = res.data.data.cardUrl
                      this.companyName = res.data.data.companyName
                  })
            },
            backClick() {
                this.showAttendanceRemark = false;
            },
            //真正提交的数据
            submit(data) {
                this.btnType = '已提交'
                let _this = this
                let url = " /zingbiz/attendance/attenPunch/getPunchWq"
                this.$http.post(url,data).then(res => {
                    this.$vux.toast.show({
                            text: "操作成功!",
                            type: "success",
                            onHide () {
                                _this.showAttendanceRemark = false;
                            }
                    })
                })
            },
            cancel() {
                this.showAttendanceRemark = false;
            },
            openLocation(){
                if(this.openAddr){
                    dispWXLocationHX(this.openAddr)
                }
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';

    .mapDiv{
        height: 30%;
        text-align: center;
        margin-top:-10px;
    }
    .fieldAttendance {
        height: 100%;
    }
    .content{
        overflow-y: scroll;
        height calc(100% - 50px);
    }
</style>

