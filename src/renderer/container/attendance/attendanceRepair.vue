<template>
    <div class="attendanceRepair">
                <zing-head  title="补卡申请" ></zing-head>
                <div class="content">
                    <cell  value-align="left" class="shift_name" :value="shift_name"  type="text" ></cell>
                    <cell  title="补卡时间"  :value="curDate"></cell>
                    <cell >
                        <span slot="title">补卡原因<span class="span_title">*</span></span>
                    </cell>
                    <x-textarea :max="200"  v-model="remark"></x-textarea>
                    <cell  title="图片信息" value-align="left"></cell>
                    
                    <div v-if="imgList.length == 0"></div>
                    <div class="imgDiv" v-for="(item, index) in imgList"  >
                       <img class="previewer-demo-img attenImg"  :src="item.src" @click="showPreview(index)"> 
                       <i class="iconfont icon-shanchu2 delImg"   @click="delImg(item.src)"></i>
                    </div>
                    <div v-transfer-dom>
                        <previewer  :list="imgList" ref="previewer" :options="options" ></previewer>
                    </div>
                    <image-picker
                       :files="files"
                       :selectable="selectable"
                       :multiple="multiple"
                       :bId = "bId"
                       :bType = "bType"
                       @onChange="imgOkCallback"
                    />
                    <cell style="margin-top:30px;" is-link  :value="reviewRealName" @click.native="selectInputPerson">
                        <span slot="title">审核人<span class="span_title">*</span></span>
                    </cell>
                  
                    <x-button type="primary"  class="btn-save" @click.native="saveBtn">提交</x-button>
                         
                    
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
                </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead"
    import ImagePicker from '@/components/imagepicker/ImagePicker';
    import OrgMemberPicker from 'components/orgmemberpicker/OrgMemberPicker';
    import {XInput,XTextarea,Group,XButton, Cell,Previewer, TransferDom} from 'vux'
    

    import {getChatVoiceImgParam,touchstartUploadVoice,touchendUploadVoice,touchcancleuploadVoice} from '@/utils/wx'
    import { mapState, mapMutations } from 'vuex'
    import MaskOut from '@/container/chat/MaskOut'
    import AudioControl from '@/directives/audiocontrol/audio-control'

    export default {
        name: "attendanceRepair",
        components: {
            ZingHead,ImagePicker,OrgMemberPicker,
            XInput, XTextarea,Group,XButton, Cell,Previewer,
        },
        directives: {
            AudioControl,
            TransferDom
        },
        data() {
            return {
                imgList: [],//预览图片
                imgArr:[],//存储图片
                files:[],
                selectable:true,//添加按钮
                multiple:false,//是否多选
                bId:"id",
                bType:"hr_kq_img",
                
                rowId:"",
                curCardUrl:"",
                realName:"",
                reviewRealName: "请选择审核人",
                reviewCardUrl:"",
                curDate:"",//补卡时间
                remark:"",//补卡原因
                shift_name:"",//班次名称
                attendanceReportId:"",

                showPersonPicker: false,//选人组件是否显示的标识
                showTab:["designatedPersonnel"],//选人组件显示的tab
                designatedCardUrls:[],//选人组件初始化的人员数据
                attenUserList:[],//选人组件回显数据展示
            }
        },
       
       
        created() {
           this.rowId  = this.$route.query.rowId
           //外勤审核人员
           this.getWQAuth()
           this.getAttendanceDetail()
           this.curDate = this.getCurDate().nyr + " " + this.getCurDate().sfm

        },
        methods: {
            getAttendanceDetail(){
                let url = "/zingbiz/attendance/attenPunch/getAttendanceDetailById"
                let params = {rowId:this.rowId}
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    if(retData.attendanceReportId){
                        this.attendanceReportId = retData.attendanceReportId
                    }
                    if(retData.bk_remark){
                        this.remark = retData.bk_remark
                    }
                    if(retData.realName){
                        this.realName = retData.realName
                    }
                    if(retData.cardUrl){
                        this.curCardUrl = retData.cardUrl
                    }
                    if(retData.reviewCardUrl){
                         this.reviewCardUrl = retData.reviewCardUrl
                    }
                    if(retData.reviewRealName){
                        this.reviewRealName = retData.reviewRealName
                    }
                    if(retData.bk_img){
                        let img = retData.bk_img
                        if(img && img != ""){
                            let imgArr = img.split(" ")
                            imgArr.forEach( imgUrl => {
                                this.imgList.push({src:imgUrl})
                            })
                        }
                    }
                    let mess = ""
                    if(retData.type){
                        if(retData.type === 'clockIn'){
                            mess = "上班时间："
                        }else if(retData.type === 'clockOut'){
                            mess = "下班时间："
                        }
                    }
                    if(retData.shiftName && retData.gd_date){
                         this.shift_name = "班次名称："+retData.shiftName+",      "+mess+retData.gd_date
                    }
                })
            },
            getWQAuth(){
                let url = "/zingbiz/auth/user/getUserByResInfoVal"
                let params = {resInfoVal:"40-80",pageSize:"500"}
                this.$http.post(url,params).then(res => {
                    let userList = res.data.data.user
                    let roleResList = res.data.data.roleRes
                    if(userList && roleResList){
                        let userCard = []
                        roleResList.forEach(res =>{
                            userList.forEach(user => {
                                if(res.roleInfoId == user.roleCode){
                                        userCard.push(""+user.cardUrl)
                                }
                            })
                        })
                        this.designatedCardUrls = userCard
                    }
                })
            },
            saveBtn(){
                if(this.curCardUrl == this.reviewCardUrl){
                    this.$vux.toast.text("审核人不能选自己!", 'bottom')
                    return false
                }
                if(!this.remark || this.remark == ""){
                    this.$vux.toast.text("补卡原因不能为空!", 'bottom')
                    return false
                }
                if(!this.reviewCardUrl || this.reviewCardUrl == "" && this.reviewRealName && this.reviewRealName == ""){
                    this.$vux.toast.text("审核人不能为空!", 'bottom')
                    return false
                }
                let bk_img = ""
                if(this.imgArr.length > 0){
                    bk_img = this.imgArr.join(" ")
                }
                let url = "/zingbiz/attendance/attenPunch/askForPunch"
                let params = {
                    rowId:this.rowId,
                    attendanceReportId:this.attendanceReportId,
                    bk_date:this.curDate,
                    bk_remark:this.remark,
                    bk_img:bk_img,
                    bk_tag:"bk",
                    isReview:"0",
                    reviewCardUrl:this.reviewCardUrl,
                    reviewRealName:this.reviewRealName,
                    messAlertTitle:this.realName+" ：申请补卡",
                    cardUrl:this.curCardUrl
                }
                this.$http.post(url,params).then(res => {
                    let _this = this
                    this.$vux.toast.show({text:"操作成功！",type:"success",onHide () {
                            _this.$router.go(-1)
                    }})
                     
                })
            },
            showPreview(index){
                this.$refs.previewer.show(index)
            },
            delImg(src){
                this.imgList = this.imgList.filter(obj => {
                    return src !== obj.src
                })
                this.imgArr = this.imgArr.filter(newSrc =>{
                    return src !== newSrc
                })
            },
           
            //上传图片组件方法
            imgOkCallback(files, operationType, index) {
                let _this = this
                files.forEach(obj => {
                    if(obj.url.indexOf("/checkFile/") < 0){
                        obj.url = "/checkJpg/"+obj.url 
                    }
                    _this.imgArr.push(obj.url)
                    _this.imgList.push({src:obj.url})
                });
                this.files = []
            },
            selectInputPerson() {//展现选人组件
                let pageType = this.$route.query.pageType
                if(pageType && pageType == 'repairDetail'){//重新打卡
                    this.showPersonPicker = false
                }else{
                    this.showPersonPicker = true
                }
                 
            },
            onPickAbort() {//选人组件返回按钮
                this.showPersonPicker = false
            },
            onPicked(list) {//选中人员的回调
                let retData = list[0]
                this.reviewCardUrl = retData.cardUrl
                this.reviewRealName = retData.userName
                this.showPersonPicker = false
                this.attenUserList = []
                this.attenUserList.push({
                        value:retData.cardUrl,
                        type:"user"
                })
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
        }
    };
</script>
<style>
    .shift_name .weui-cell__ft{
        color: #FF8000 !important;
    }   
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../assets/stylus/variable.styl';
    @import '../../assets/stylus/mixin.styl';
    
    .attendanceRepair{
        height: 100%;

    }
    .content{
        overflow-y: scroll;
        height calc(100% - 50px);
    }
    
    
     /*图片的样式*/
    .attendanceRemark-picker .vux-popup-dialog[data-v-71c6d87a] {
        z-index: 1000;
    }
    .imgDiv {
        display: inline;
        position:relative;
    }
    .attenImg{
        margin-top: 20px;
        margin-left: 20px;
        width: 70px;
        height: 70px;
    }
    .delImg{
        position: absolute;
        margin-top: 10px;
        margin-left: -15px;
    }
    .iconfont{
        font-size: 20px;
    }
    .ei-image-picker{
        display: inline-block;
        margin-top: 30px;
    }
    .span_title{
        color: #D81E06;
    }
</style>

