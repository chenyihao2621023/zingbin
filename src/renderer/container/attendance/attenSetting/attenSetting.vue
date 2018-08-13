<template>
    <div class="attenSetting">
        <ZingHead title="考勤设置" :isComeBack="false" @doSome="goMain">
        </ZingHead>
        <div class="content">
            <group   label-align="left">
                <x-input title="考勤名称<span style='color:red'>*</span>" v-model="formData.groupName" type="text"  placeholder="请输入考勤名称"></x-input>
                <x-input v-if="rowId == ''" title="排班方式<span style='color:red'>*</span>" type="text"  readonly>
                    <checker v-model="formData.groupType" slot="right"  radio-required="true" default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item :value="item.key" v-for="(item, index) in checkData" :key="index">{{item.value}}</checker-item>
                    </checker>
                </x-input>
                <x-input v-else title="排班方式<span style='color:red'>*</span>" type="text" v-model="groupTypeName" readonly>
                </x-input>
                <cell is-link value="请选择考勤人员" @click.native="selAttenUser">
                         <span slot="title">考勤人员<span style='color:red'>*</span></span>
                </cell>
                <tag-group :items="attenUserList"></tag-group>
                <div v-show="formData.groupType == 1">
                    <cell is-link value="请选择考勤时间" @click.native="selAttenDate('gd')">
                         <span slot="title">考勤时间<span style='color:red'>*</span></span>
                    </cell>
                    <cell  :value="selDateTitle"></cell>
                    <cell is-link value="请选择考勤日期" @click.native="selAttenWeek">
                         <span slot="title">考勤日期<span style='color:red'>*</span></span>
                    </cell>
                    <cell  :value="selWeekValue"></cell>
                </div>
                <div v-show="formData.groupType == 2">
                    <cell is-link value="请选择考勤时间" @click.native="selAttenDate('pb')">
                         <span slot="title">考勤时间<span style='color:red'>*</span></span>
                    </cell>
                    <cell  :value="selDateTitle"></cell>
                </div>
                <div v-show="formData.groupType == 3">
                    <datetime v-model="startDate" title="规定时间" format="HH:mm"></datetime>
                    <cell  value="注意:规定时间,也就是每天几点开始新考勤"></cell>
                    <popup-picker title="工作时长" :data="workingTimeData" v-model="workingTime"></popup-picker>
                    <cell is-link value="请选择考勤日期" @click.native="selAttenWeek">
                         <span slot="title">考勤日期<span style='color:red'>*</span></span>
                    </cell>
                    <cell  :value="selWeekValue"></cell>
                </div>
                <cell is-link @click.native="setPos" :value="addr">
                    <span slot="title">考勤位置<span style='color:red'>*</span></span>
                </cell>
                <popup-picker  v-model="selRangeVal"
                               value-text-align="right"
                               title="误差方式<span style='color:red'>*</span>"
                               placeholder="请选择误差方式"
                               :data="rangeData"
                               :columns="1"  >
                </popup-picker>
            </group>
            <group>
                <flexbox>
                    <flexbox-item>
                        <div v-if="formData.groupType == 2">
                            <x-button type="primary btn-common" @click.native="saveBtn('xyb')">下一步</x-button>
                        </div>
                        <div v-else>
                             <x-button type="primary btn-common" @click.native="saveBtn('bc')">保存</x-button>
                        </div>
                    </flexbox-item>
                </flexbox>
            </group>
        </div>
        <!-- 选人组件 -->
        <org-member-picker ref="picker"
                :initialSelected="initialSelected"
                :showPicker="showPersonPicker"
                :showTab ="showTab"
                @picked="onPicked"
                @abort="onPickAbort">
        </org-member-picker>
        <!-- 选时间组件 -->
        <attenDate-Tem
                :showAttenDatePicker="showAttenDatePicker"
                :multipleMode="multipleMode"
                :selDateIDs = "selDateIDs"
                @goAttenSetting=onGoAttenSetting
                @selDateClicked=onSelDateClicked>
        </attenDate-Tem>
        <!-- 选日期组件 -->
        <attenWeek-Tem
                :showAttenWeekPicker="showAttenWeekPicker"
                :selWeekKey="selWeekKey"
                @goAttenSetting=onGoAttenSetting
                @selWeekClicked=onSelWeekClicked>
        </attenWeek-Tem>
        <!-- 弹出框组件 -->
        <div v-transfer-dom>
             <confirm v-model="confirmShow"
                 ref="confirm1"
                 title="选择规则生效时间"
                 content="立即生效：今日考勤结果将按新规则重算"
                 confirm-text="立即生效"
                 cancel-text="明日生效"
                 @on-cancel="onCancel"
                 @on-confirm="onConfirm">
             </confirm>
        </div>
        <!-- 地图选点组件  -->
        <attenMap-Tem
                :showAttenMapPicker="showAttenMapPicker"
                :coord="coord"
                @goAttenSetting=onGoAttenSetting
                @selMapClicked=onSelMapClicked>
        </attenMap-Tem>
    </div>
</template>


<script>
    import Vue from 'vue'
    import {Checklist,Confirm,Cell ,CheckerItem,Checker,PopupPicker,Selector, XInput,Group, XButton,  Flexbox, FlexboxItem, Datetime,TransferDom } from 'vux';
    import ZingHead from "@/components/zingHead/ZingHead"
    import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
    import TagGroup from "components/taggroup/TagGroup";
    import AttenDateTem from "./attenDateTem";
    import AttenWeekTem from "./attenWeekTem";
    import AttenMapTem from "./attenMapTem";

    import { getWXLocationHX,getQMapLocation } from '@/utils/wx'
    import { mapState, mapMutations } from 'vuex'
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";


    export default {
        directives: {
            TransferDom
        },
        components: {
            XInput,XButton,Group,Flexbox,FlexboxItem,Datetime,Confirm,Selector,
            PopupPicker,Checker,CheckerItem,TagGroup,Cell,
            getQMapLocation,getWXLocationHX,
            ZingHead,AttenDateTem,AttenWeekTem,AttenMapTem,OrgMemberPicker
        },
        data () {
            return {
                attenUser:[],//考勤人员字典
                attenOrg:[],//考勤组织字典
                attenRole:[],//考勤角色字典
                orgUserMap:{},//组织下的人员字典
                
                //选人组件
                showPersonPicker: false,
                attenUserList:[],
                initialSelected:[],
                showTab:["org","colleague",'role'],
                
                //时间组件
                showAttenDatePicker:false,
                selDateIDs:"",//选中时间的id
                multipleMode:false,//控制按钮 true-多选 false-单选
                selDateTitle:"",//选中的时间名称
                
                //日期组件
                showAttenWeekPicker:false,//选日期组件是否显示标识
                selWeekKey:"",//选中周的id
                selWeekValue:"",//选中周的名称

                //地图选点组件
                showAttenMapPicker:false,
                coord:"40.05346,116.30242",


                //弹出框
                confirmShow:false,

                upNum:"-1", 
                btnType:"",
                rowId:"",
                groupTypeName:"",
                clickStatus:true,//按钮初始化状态
                selRangeVal:[],//选中范围的值
                startDate:"08:00",//自由-规定时间
                workingTime:['8'],//自由-工作时长
                addr:"请选择考勤位置",//地址详情
                longitude:"116.30242",
                latitude:"40.05346",
                formData:{
                    rowId:"",
                    groupName:"",
                    attenUser:"",
                    attenOrg:"",
                    attenRole:"",
                    groupType:"1",
                    attenDateId:"",
                    weekdays:"",
                    longitude:"",
                    latitude :"",
                    addressDetail:"",
                    range:"",
                    startDate:"",
                    workingTime :"",
                    messCardUrl:"",//提示的用户
                    messOrg:"",//提示的组织
                    messRole:"",//提示的角色
                    oldAttenDateId:""
                },
                workingTimeData:[['1', '2', '3', '4', '5', '6', '7','8','9','10','11','12']],
                checkData: [
                    {key:"1",value:"固定"},
                    {key:"2",value:"排班"},
                    {key:"3",value:"自由"}],
                rangeData: [//误差方式数据
                    {value: 100, name: '100米'},
                    {value: 200, name: '200米'},
                    {value: 300, name: '300米'},
                    {value: 400, name: '400米'},
                    {value: 500, name: '500米'},
                    {value: 600, name: '600米'},
                    {value: 700, name: '700米'},
                    {value: 800, name: '800米'},
                    {value: 900, name: '900米'},
                    {value: 1000, name: '1000米'},
                    {value: 2000, name: '2000米'},
                    {value: 3000, name: '3000米'}]
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
                        break
                    case 'success':
                        this.longitude = this.wxLocation.longitude;
                        this.latitude = this.wxLocation.latitude;
                        break
                    case 'failed':
                        break
                }
            }
        },
        created: function () {
            let rowId = this.$route.query.rowId
            if(rowId) {
                this.getAttenSettingById(rowId)
                this.rowId = rowId
            }else{
                if (isWeiXin() || isMhApp()) {
                    getWXLocationHX();
                }
            }
            this.getOrgList()
            this.getAttenSettingList()
        },
        methods: {
            setPos(){
               this.upNum = "-2"
               this.coord = this.latitude +","+this.longitude
               this.showAttenMapPicker = true
            },
            onPicked(list) {
                this.showPersonPicker = false;
                let _this = this
                let oldCardUrlArr = []
                let oldOrgArr = []
                let oldRoleArr = []

                let newCardUrlArr = []
                let newOrgArr = []
                let newRoleArr = []

                let nameMap = {}
                let retMap = list.map(item => {
                    nameMap[item.id] = item.title
                    if(item.type == "dept"){//组织
                        if(this.formData.attenOrg.indexOf(item.id) < 0){
                                 newOrgArr.push(item.id)
                        }else{
                                 oldOrgArr.push(item.id)
                        }
                    }else if(item.type ==  "user"){//人员
                        if(this.formData.attenUser.indexOf(item.id) < 0){
                                newCardUrlArr.push(item.id)
                        }else{
                                oldCardUrlArr.push(item.id)
                        }
                    }else if(item.type ==  "role"){//角色
                        if(this.formData.attenRole.indexOf(item.id) < 0){
                                newRoleArr.push(item.id)
                        }else{
                                oldRoleArr.push(item.id)
                        }
                    }
                    let map = {
                        key: item.title,
                        value: item.id,
                        level: this.$refs.picker.getLevel(item.type)
                    };
                    return map;
                });
                oldCardUrlArr = oldCardUrlArr.concat(newCardUrlArr)
                oldOrgArr = oldOrgArr.concat(newOrgArr)
                oldRoleArr = oldRoleArr.concat(newRoleArr)

                let retStatus = this.validateOrgAndUser(newCardUrlArr,newOrgArr,newRoleArr,nameMap)
                if(retStatus.status){
                        _this.formData.attenUser = oldCardUrlArr.join(" ")
                        _this.formData.attenOrg = oldOrgArr.join(" ")
                        _this.formData.attenRole = oldRoleArr.join(" ")
                        _this.showPersonPicker = false;
                        _this.attenUserList = retMap
                }else{
                     _this.$vux.confirm.show({
                          title: "提示",
                          content:retStatus.mess,
                         onCancel () {
                            _this.showPersonPicker = true;
                         },onConfirm () {
                            _this.formData.attenUser = oldCardUrlArr.join(" ")
                            _this.formData.attenOrg = oldOrgArr.join(" ")
                            _this.formData.attenRole = oldRoleArr.join(" ")
                            _this.showPersonPicker = false;
                            _this.attenUserList = retMap
                         }
                    })
                }
                
            },
            validateOrgAndUser(cardUrlArr,orgArr,roleArr,nameMap){
                let messCardUrl = []
                cardUrlArr.forEach(cardUrl =>{
                    this.attenUser.forEach(attenUserStr =>{
                            if(attenUserStr.indexOf(cardUrl) >= 0){
                                    messCardUrl.push(cardUrl)
                            }
                    })
                })
                let messOrg = []
                orgArr.forEach(orgId =>{
                    this.attenOrg.forEach(attenOrgStr =>{
                            if(attenOrgStr.indexOf(orgId) >= 0){
                                    messOrg.push(orgId)
                            }
                    })
                })
                let messRole = []
                roleArr.forEach(roleId =>{
                    this.attenRole.forEach(attenRoleStr =>{
                            if(attenRoleStr.indexOf(roleId) >= 0){
                                    messRole.push(roleId)
                            }
                    })
                })

                let mess = ""
                if(messCardUrl.length > 0){
                    let userCardUrl = messCardUrl[0]
                    let userName = nameMap[userCardUrl]
                    if(messCardUrl.length >1){
                            mess += userName+"等"+messCardUrl.length+"人已在其他考勤组中,"
                    }else{
                            mess += userName+"已在其他考勤组中,"
                    }
                    this.formData.messCardUrl = messCardUrl.join(" ")
                }else{
                    this.formData.messCardUrl = ""
                }
                if(messOrg.length > 0){
                    let orgId = messOrg[0]
                    let orgName = nameMap[orgId]
                    if(messOrg.length  >1){
                            mess += orgName+"等"+messOrg.length+"个部门已在其他考勤组中,"
                    }else{
                            mess += orgName+"已在其他考勤组中,"
                    }
                    this.formData.messOrg = messOrg.join(" ")
                }else{
                    this.formData.messOrg = ""
                }
                if(messRole.length > 0){
                    let roleId = messRole[0]
                    let roleName = nameMap[roleId]
                    if(messRole.length  >1){
                            mess += roleName+"等"+messRole.length+"个角色已在其他考勤组中,"
                    }else{
                            mess += roleName+"已在其他考勤组中,"
                    }
                    this.formData.messRole = messRole.join(" ")
                }else{
                    this.formData.messRole = ""
                }
                mess += "是否改为此考勤组中考勤"
                if(messCardUrl.length > 0 || messOrg.length > 0 || messRole.length > 0){
                    return {mess:mess,status:false}
                }
                return {status:true}
            },
            onPickAbort() {
                this.showPersonPicker = false;
            },
            selAttenUser() {
                this.initialSelected = this.attenUserList
                this.showPersonPicker = true;
            },
            selAttenDate(type) {
                this.showAttenDatePicker = true
                if(type == "gd"){//固定
                    this.multipleMode = false
                }else if(type == "pb"){//排班
                    this.multipleMode = true
                }
            },
            selAttenWeek() {
                this.showAttenWeekPicker = true
            },
            onGoAttenSetting() {
                this.showAttenDatePicker = false
                this.showAttenWeekPicker = false
                this.showAttenMapPicker = false
            },
            onSelDateClicked(idstr,valStr){
                if(this.formData.groupType == '1'){//固定
                    if(this.selDateIDs != idstr){
                        this.formData.oldAttenDateId = this.selDateIDs
                    }
                }
                this.selDateTitle = valStr
                this.formData.attenDateId = idstr
                this.onGoAttenSetting()
            },
            onSelWeekClicked(keyStr,valueStr){
                this.selWeekValue = valueStr
                this.formData.weekdays = keyStr
                this.onGoAttenSetting()
            },
            onSelMapClicked(data){
                this.addr = data.poiaddress
                this.latitude = data.latlng.lat
                this.longitude = data.latlng.lng
                this.showAttenMapPicker = false
            },
            checkForm(){
                if(this.formData.groupName == ""){
                    this.$vux.toast.text("请输入考勤名称!")
                    return false
                }
                if(this.formData.groupName.length > 8){
                    this.$vux.toast.text("考勤名称过长!")
                    return false
                }
                if(this.formData.attenUser == "" && this.formData.attenOrg == "" && this.formData.attenRole == ""){
                    this.$vux.toast.text("请选择考勤人员!")
                    return false
                }
                if(this.formData.groupType == ""){
                    this.$vux.toast.text("请选择排版方式!")
                    return false
                }
                let groupType = this.formData.groupType
                if(groupType == '1'){
                    if(this.formData.attenDateId == ""){
                        this.$vux.toast.text("请选择考勤时间!")
                        return false
                    }
                    if(this.formData.weekdays == ""){
                        this.$vux.toast.text("请选择考勤日期!")
                        return false
                    }
                }else if(groupType == '2'){
                    if(this.formData.attenDateId == ""){
                        this.$vux.toast.text("请选择考勤时间!")
                        return false
                    }

                }else if(groupType == '3'){

                    if(this.formData.weekdays == ""){
                        this.$vux.toast.text("请选择考勤日期!")
                        return false
                    }
                    this.formData.startDate = this.startDate
                    this.formData.workingTime = this.workingTime[0]
                    if(this.formData.startDate == ""){
                        this.$vux.toast.text("请选择规定时间!")
                        return false
                    }
                    if(this.formData.workingTime == ""){
                        this.$vux.toast.text("请选择工作时长!")
                        return false
                    }
                }
                if(this.longitude == "" || this.latitude == "" || this.addr == "请选择考勤位置"){
                    this.$vux.toast.text("请设置考勤地点!")
                    return false
                }
                if(this.selRangeVal.length == 0){
                    this.$vux.toast.text("请选择误差方式!")
                    return false
                }else{
                    this.formData.range = this.selRangeVal[0]
                }
                return true
            },
            saveBtn(type) {
                this.btnType = type
                if(this.clickStatus){
                    if(this.checkForm()){
                        this.clickStatus = false
                        this.confirmShow = true
                    }
                }
            },
            onCancel(){
                 let params = {}
                 if(this.formData.rowId){//修改
                    params.rowId = this.formData.rowId
                    params.nextStatus = "true"
                 }else{
                    params = this.formData
                    params.attenStatus = "false"
                    params.nextStatus = "true"
                 }
                 params.nextGroupName = this.formData.groupName
                 params.nextAttenUser = this.formData.attenUser
                 params.nextAttenOrg = this.formData.attenOrg
                 params.nextAttenRole = this.formData.attenRole
                 params.nextAttenDateId = this.formData.attenDateId
                 params.nextWeekdays = this.formData.weekdays
                 params.nextLongitude = this.longitude
                 params.nextLatitude = this.latitude
                 params.nextAddressDetail = this.addr
                 params.nextRange = this.formData.range
                 params.nextStartDate = this.formData.startDate
                 params.nextWorkingTime = this.formData.workingTime
                 this.submitBtn(params)
            },
            onConfirm(){
                this.formData.attenStatus = "true"  //考勤配置生效
                this.formData.nextStatus = "false"
                this.formData.longitude = this.longitude
                this.formData.latitude = this.latitude
                this.formData.addressDetail = this.addr
                this.submitBtn(this.formData)
            },
            submitBtn(data){
                Vue.$vux.loading.show({text: '加载中'})
                let _this = this
                let url = "/zingbiz/attendance/attendancesetting/addAttendanceSetting"
                if(this.formData.rowId){//修改
                    url = "/zingbiz/attendance/attendancesetting/updateAttendanceSetting"
                }
                this.$httpSilent.post(url,data).then(res => {
                    Vue.$vux.loading.hide()
                    if(this.btnType == "bc"){
                        this.$vux.toast.show({
                           text: "操作成功！",
                           type: "success",
                           onHide () {
                                _this.$router.go(_this.upNum)
                           }
                        })
                    }else if(this.btnType == "xyb"){
                        let rowId = ""
                        if(this.formData.rowId){
                            rowId = this.formData.rowId
                        }else{
                            rowId = res.data.data
                        }
                        this.xybBtn(rowId);
                    }
                })                
            },
            xybBtn(rowId){
                let url = "/zingbiz/attendance/attenPunch/getShiftCardUrl"
                let params = {
                      userStr:this.formData.attenUser,
                      orgStr:this.formData.attenOrg,
                      roleStr:this.formData.attenRole
                }
                this.$http.post(url,params).then(res => {
                      if(res.data.data){
                          let retData = res.data.data
                          if(retData.length <= 0){
                               this.$vux.toast.text("没有可查看的排班人员!", 'conter')
                               return
                          }
                          let attenUser = ""
                          retData.forEach(cardUrl　=>{
                              attenUser += " "+cardUrl　
                          })
                          attenUser = attenUser.substring(1,attenUser.length)
                          this.$router.push({
                                path:'arrangeCalendar',
                                query:{
                                      attenUser:attenUser,
                                      rowId:rowId,
                                      attenDateId:this.formData.attenDateId
                                }
                          })
                      }else{
                          this.$vux.toast.text("排班人员获取失败!", 'conter')
                      }
                })
            },
            getAttenSettingById(rowId) {
                let _this = this
                let url = "/zingbiz/attendance/attendancesetting/getAttendanceSettingById"
                this.$http.post(url,{"rowId":rowId})
                    .then(res => {
                        let retData = res.data.data.atten
                        this.formData.groupName = retData.groupName
                        this.formData.attenUser = retData.attenUser
                        this.formData.attenOrg = retData.attenOrg
                        this.formData.attenRole = retData.attenRole
                        this.formData.groupType = retData.groupType
                        this.formData.weekdays = retData.weekdays
                        this.formData.longitude = retData.longitude
                        this.formData.latitude = retData.latitude
                        this.formData.range = retData.range
                        this.formData.rowId = retData.rowId
                        this.formData.attenDateId = retData.attenDateId
                       
                        //特殊处理数据
                        this.addr = retData.addressDetail
                        this.latitude = retData.latitude
                        this.longitude = retData.longitude
                        this.selRangeVal.push(this.formData.range)
                        let groupType = this.formData.groupType
                        if(groupType == "1"){
                            this.groupTypeName = "固定班制"
                            this.getWeekValue()
                            this.selWeekKey = retData.weekdays
                            this.selDateTitle = retData.attenDateName
                            this.selDateIDs = retData.attenDateId
                            this.multipleMode = false
                        }else if(groupType == "2"){
                            this.groupTypeName = "排班班制"
                            this.selDateTitle = retData.attenDateName
                            this.selDateIDs = retData.attenDateId
                            this.multipleMode = true
                        }else if(groupType == "3"){
                            this.groupTypeName = "自由班制"
                            this.getWeekValue()
                            this.selWeekKey = retData.weekdays

                            this.startDate = retData.startDate
                            this.workingTime = [retData.workingTime]
                        }
                        
                        let attenUserList = []
                        //组织数据
                        let orgMap = {}
                        res.data.data.org.forEach(item => {
                            orgMap[item.id] = item
                        })
                        let orgArr = retData.attenOrg.split(" ")
                        orgArr.forEach(id => {
                            let orgObj = orgMap[id]
                            if(orgObj){
                                attenUserList.push({
                                    key:orgObj.text,
                                    value:id,
                                    level:"info",
                                    type:"dept"
                                })
                            }
                        })
                        //人员数据
                        let userMap = {}
                        res.data.data.user.forEach(item => {
                            userMap[item.cardUrl] = item
                        })
                        let userArr = retData.attenUser.split(" ")
                        userArr.forEach(cardUrl => {
                            let userObj = userMap[cardUrl]
                            if(userObj){
                                attenUserList.push({
                                    key:userObj.userName,
                                    value:cardUrl,
                                    level:"default",
                                    type:"user"
                                })
                            }
                        })
                        //角色数据
                        let roleMap = {}
                        res.data.data.role.forEach(item => {
                            roleMap[item.roleInfoId] = item
                        })
                        let roleArr = retData.attenRole.split(" ")
                        roleArr.forEach(roleId => {
                            let roleObj = roleMap[roleId]
                            if(roleObj){
                                attenUserList.push({
                                    key:roleObj.roleInfoName,
                                    value:roleId,
                                    level:"default",
                                    type:"role"
                                })
                            }
                        })
                        this.attenUserList = attenUserList
                    })
            },
            getWeekValue(){//处理周数据
                let keys = this.formData.weekdays
                let weekObj = {"0":"星期日",
                               "1":"星期一",
                               "2":"星期二",
                               "3":"星期三",
                               "4":"星期四",
                               "5":"星期五",
                               "6":"星期六"}
                let valueList = []
                keys.split(",").forEach(key => {
                    valueList.push(weekObj[key])
                })
                this.selWeekValue = valueList.join(",")
            },
            getAttenSettingList(){
                let url = '/zingbiz/attendance/attendancesetting/getAttendanceSettingList'
                this.$http.post(url,{"pageNumber":"1","pageSize":"100"}).then(res => {
                        let retData = res.data.data.data
                        let attenUser = []
                        let attenOrg = []
                        let attenRole = []
                        retData.forEach(item =>{
                                if(item.attenUser && item.attenUser != ""){
                                    attenUser.push(item.attenUser)
                                }
                                if(item.attenOrg && item.attenOrg != ""){
                                    attenOrg.push(item.attenOrg)
                                }
                                if(item.attenRole && item.attenRole != ""){
                                    attenRole.push(item.attenRole)
                                }
                        })
                        this.attenUser = attenUser
                        this.attenOrg = attenOrg
                        this.attenRole = attenRole
                        
                })
            },
            getOrgList(){
                let url = '/zingbiz/auth/org/getOrgByCompanyId'
                this.$http.post(url,{}).then(res => {
                        let retData = res.data.data
                        let orgUserMap = {}
                        
                        retData.forEach(item => {
                                if(item.userList){
                                    let orgUserArr = []
                                    let userArr = item.userList.trim().split(" ")
                                    if(userArr.length > 0){
                                         userArr.forEach(cardUrl =>{
                                                if(cardUrl != ""){
                                                     orgUserArr.push(cardUrl.split("#")[1])
                                                }
                                         }) 
                                    }
                                    if(orgUserArr.length > 0){
                                        orgUserMap[item.id] = orgUserArr.join(" ")
                                    }
                                }else{
                                    orgUserMap[item.id] = ""
                                }
                        })
                        this.orgUserMap = orgUserMap
                        
                })
            },
            goMain(){
                 this.$router.go(this.upNum)
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    @import '../../../assets/stylus/unify.styl';
    
    vux-x-dialog-absolute .weui-dialog {
        animation:unset !important ;
    }
    .vux-dialog-leave-active {
        animation:unset !important ;
    }
    .attenSetting{
        height: 100%;
    }
    .content {
        overflow-y: auto;
        height calc(100% - 50px);
        background: #fbf9fe;
    }
    .weui-cell {
        padding-right: 10px;
    }
    .vux-checker-box {
        border: 1px solid #ff0000;
        border-radius:5px;
    }
    .demo1-item {
        border-left: 1px solid #ff8000;
        padding: 5px 10px;
    }
    .demo1-item:first-child {
        border-left: 0px;
    }
    .demo1-item-selected {
        color: #fff;
        background-color:  #ff8000;
    }
    .tag-group {
        padding-left: 25px;
    }
</style>
