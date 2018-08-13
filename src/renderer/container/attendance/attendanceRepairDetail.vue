<template>
     <div  class="attendanceRepairDetail">
            <zing-head  :title="title" ></zing-head>
            <div class="content">
                 <GridCard>
                    <div slot="cardLeft" class="left">
                        <div v-if="headImg && headImg != ''">
                            <Avatar :src="headImg"></Avatar>
                        </div>
                        <div v-else>
                             <Avatar src="../../assets/img/userDef_.jpg"></Avatar>
                        </div>
                        <div class="left-wrapper">
                            <p class="left-wrapper-title">{{userName}}</p>
                        </div>
                    </div>
                    <div slot="cardRight"  >
                        <p v-if="isReview == '0'" class="left-wrapper-title statusName">待审核</p>
                    </div>
                </GridCard>
                <group label-width="5em" >
                    <cell  title="补卡班次"  v-model="shift_name"></cell>
                    <cell  title="申请编号"  v-model="code"></cell>
                    <cell  title="所在部门"  v-model="orgNames"></cell>
                    <cell  title="补卡原因"  v-model="bk_remark"></cell>
                    <cell  title="图片"  ></cell>
                    <div v-if="imgList.length == 0"></div>
                    <div  class="imgDiv" v-for="(item, index) in imgList"  >
                       <img class="previewer-demo-img attenImg"  :src="item.src" @click="showPreview(index)"> 
                    </div>
                    <div v-transfer-dom>
                        <previewer  :list="imgList" ref="previewer" :options="options" ></previewer>
                    </div>
                    <cell  title="审核人"  v-model="reviewRealName"></cell>
                </group>
                <div v-if="pageType == 'punch'">
                    <div v-if="isReview == '0'">
                        
                    </div>
                    <div v-if="isReview == '1'" style="text-align: center;">
                        <img  src="../../assets/img/bk_tg.png" >
                    </div>
                    <div v-if="isReview == '2'" style="text-align: center;">
                        <img  src="../../assets/img/bk_jj.png" >
                        <x-button v-if="cardUrl === curCardUrl" style=" margin-top: 50px;" type="primary" 
                            @click.native="cxshBtn">重新申请
                        </x-button>
                    </div>
                </div>
                <div v-if="pageType == 'exmine'">
                    <div v-if="isReview == '0'">
                        <flexbox :gutter="0" >
                            <flexbox-item>
                                <x-button type="primary btn-save" @click.native="jjBtn">拒绝</x-button>
                            </flexbox-item>
                            <flexbox-item>
                                <x-button type="warn btn-common" @click.native="tyBtn">同意</x-button>
                            </flexbox-item>
                        </flexbox>
                    </div>
                    <div v-if=" isReview == '2'" style="text-align: center;">
                        <img  src="../../assets/img/bk_jj.png" >
                    </div>
                    <div v-if="isReview == '1'" style="text-align: center;">
                        <img  src="../../assets/img/bk_tg.png" >
                    </div>
                </div>
            </div>
     </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead"
    import GridCard from '@/components/gridcard/GridCard';
    import Avatar from "@/components/avatar/Avatar"

    import {Group,Cell,Flexbox,FlexboxItem,XButton,Previewer,TransferDom} from 'vux'
    export default {
        name: "attendanceRepairDetail",
        components: {
            ZingHead,GridCard,Avatar,
            Group,Cell,Flexbox,FlexboxItem,XButton,Previewer
        },
        directives: {
            TransferDom
        },
        data() {
            return {
                rowId:"",
                pageType:"",//punch --打卡页面    exmine --审核页面
                cardUrl:"",

                curCardUrl:"",//操作者
                headImg:"../../assets/img/userDef_.jpg",
                userName:"",
                orgNames:"",
                shift_name:"",
                bk_remark:"",
                code:"",
                title:"补卡申请",
                reviewRealName:"",
                imgList:[],//图片地址
                isReview:"",//0-- 审核中    1-- 已审核   2 -- 拒绝中
                attendanceReportId:"",//打卡主表记录
                attenType:"",
                attenNum:""




            };
        },
        //钩子加载完触发
        created: function () {
           this.rowId =  this.$route.query.rowId
           this.pageType =  this.$route.query.pageType
           this.cardUrl =  this.$route.query.cardUrl

            let bType = this.$route.query.bType
            let tarId = this.$route.query.tarId
            if(bType && tarId){
                this.clerAlert(bType,tarId)
            }
           this.getBkInfo()

        },  
        methods: {
           clerAlert(bType,tarId){
                let url = "/zingbiz/attendance/attenPunch/updateDisAlert"
                let params = {
                    bType:bType,
                    tarId:tarId
                }
                this.$http.post(url,params).then(res => {})
           },
           getBkInfo(){
                let url = "/zingbiz/attendance/attenPunch/getBkInfo"
                let params = {
                    cardUrl:this.cardUrl,
                    attenSetId:this.attenSetId,
                    rowId:this.rowId
                }
                this.$http.post(url,params).then(res => {
                    let retData = res.data.data
                    if(retData.user){
                        if(retData.user.headImg){
                             this.headImg = retData.user.headImg
                        }
                        if(retData.user.userName){
                             this.userName = retData.user.userName
                        }
                    }
                    if(retData.orgNames){
                        this.orgNames = retData.orgNames
                    }
                    if(retData.curCardUrl){
                       this.curCardUrl =  retData.curCardUrl
                    }
                    if(retData.attenDetail){
                        let attenDetail = retData.attenDetail
                        if(attenDetail.rowId){
                            this.code = attenDetail.rowId
                        }
                        if(attenDetail.bk_remark){
                             this.bk_remark = attenDetail.bk_remark
                        }
                        if(attenDetail.isReview){
                            this.isReview = attenDetail.isReview
                        }
                        if(attenDetail.reviewRealName){
                            this.reviewRealName = attenDetail.reviewRealName
                        }
                        if(attenDetail.attendanceReportId){
                            this.attendanceReportId = attenDetail.attendanceReportId
                        }
                        if(attenDetail.attenNum){
                            this.attenNum = attenDetail.attenNum - 1
                        }
                        let mess = ""
                        if(attenDetail.type){
                            if(attenDetail.type === 'clockIn'){
                                mess = "上班时间"
                            }else if(attenDetail.type === 'clockOut'){
                                mess = "下班时间"
                            }
                        }
                        if(attenDetail.groupName && attenDetail.gd_date){
                            this.shift_name = attenDetail.groupName+"   "+mess+attenDetail.gd_date
                        }
                        if(attenDetail.bk_img){
                            //处理图片
                            let img = attenDetail.bk_img
                            if(img && img != ""){
                                let imgArr = img.split(" ")
                                    imgArr.forEach( imgUrl => {
                                        this.imgList.push({src:imgUrl})
                                })
                            }
                        }
                    }
                })
           },
           jjBtn(){
                let _this = this
                let url = "/zingbiz/attendance/attenPunch/bkRefuse"
                let params = {
                     rowId:this.rowId,
                     isReview:"2",
                     messAlertTitle:this.userName+": 申请补卡",
                     cardUrl:this.cardUrl
                }
                
                this.$http.post(url,params).then(res => {
                    this.$vux.toast.show({text:"操作成功！",type:"success",onHide () {
                        _this.$router.go(-1)
                    }})
                })
           },
           tyBtn(){
                let _this = this
                let url = "/zingbiz/attendance/attenPunch/bkAgree"
                let params = {
                    rowId:this.rowId,
                    attendanceReportId:this.attendanceReportId,
                    messAlertTitle:this.userName+": 申请补卡",
                    cardUrl:this.cardUrl
                }
                this.$http.post(url,params).then(res => {
                    this.$vux.toast.show({text:"操作成功！",type:"success",onHide () {
                        _this.$router.go(-1)
                    }})
                })
           },
           cxshBtn(){
                this.$router.push({
                    path: "/attendanceHome/attendanceRepair",
                    query:{
                          rowId:this.rowId,
                          pageType:"repairDetail"
                    }
                })
           },
           showPreview(index){
                this.$refs.previewer.show(index)
           },
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
   @import '../../assets/stylus/variable.styl';
   @import '../../assets/stylus/mixin.styl';
   .attendanceRepairDetail{
        height:100%;
   }
   .content{
        overflow-y: scroll;
        height calc(100% - 50px);
   }
   .statusName{
        background-color: #409eff;
        border-radius: 5px;
        color: #fff;
   }
   .left-wrapper-title{
        margin-bottom: 0px;
        padding: 5px;
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
</style>
