<template>
    <div  class="employeeBasicInfo">
        <group label-width="5em" label-margin-right="2em" label-align="left">
            <div class="headImgDiv">
                <img class="previewer-demo-img headImg" v-for="(item, index) in list" :src="item.src" @click="showPreview(index)">
                <div v-transfer-dom>
                    <previewer  :list="list" ref="previewer" :options="options" ></previewer>
                </div>
                <img v-show="authIsShow" src="../../../assets/img/auth.png" style="position: absolute;right: 70px;top: -10px;display: none;width: 100px;">
                <img v-show="noAuthIsShow" src="../../../assets/img/noAuth.png" style="position: absolute;right: 70px;top: -10px;display: none;width: 100px;">
            </div>
            <flexbox>
                <flexbox-item>
                    <div v-if="btnType == 'rztg'">
                        <x-button  style="border-radius:10px;" type="primary btn-common" @click.native="saveBtn('通过')">认证通过</x-button>
                    </div>
                    <div v-if="btnType == 'qxrz'">
                        <x-button  style="border-radius:10px;" type="primary btn-common" @click.native="saveBtn('待审核')">取消认证</x-button>
                    </div>
                </flexbox-item>
            </flexbox>
            <cell title="基本信息" class="hr_title"></cell>
            <cell title="姓名" :value="formData.userName"></cell>
            <cell title="性别" :value="formData.sex"></cell>
            <cell title="民族" :value="formData.nation"></cell>
            <cell title="学历" :value="formData.education"></cell>
            <cell title="籍贯" :value="formData.placeOfOrigin"></cell>
            <cell title="证件类型" :value="formData.IDNumberType"></cell>
            <cell title="证件号码" :value="formData.IDNumber"></cell>
            <cell title="毕业院校" :value="formData.graduateInstitutions"></cell>
            <cell title="入职时间" :value="formData.joinThisUnitTime"></cell>
            <cell title="婚姻状况" :value="formData.maritalStatus"></cell>
            <cell title="政治面貌" :value="formData.politicalOutlook"></cell>
            <cell title="户口所在地" :value="formData.accountLocation"></cell>
            <cell title="联系方式" class="hr_title"></cell>
            <cell title="手机" :value="formData.telPhone"></cell>
            <cell title="邮箱" :value="formData.email"></cell>
            <cell title="QQ" :value="formData.qqNumber"></cell>
            <cell title="微信" :value="formData.weChatNumber"></cell>
            <cell title="家庭信息" class="hr_title"></cell>
            <cell title="家庭电话" :value="formData.homePhone"></cell>
            <cell title="家庭邮编" :value="formData.homeZipCode"></cell>
            <cell title="家庭住址" :value="formData.homeAddress"></cell>
            <div class="chatIcon" @click="chatFun" v-if="cookieUser.cardUrl != formData.cardUrl"> 
                <i class="iconfont icon-icon--" style="color: #ff8000;"></i>
            </div>
        </group>
    </div>
</template>


<script>
    import { doOneChat } from "@/utils/fn";
    import {Previewer, TransferDom,XImg,Group,Cell,Flexbox,FlexboxItem,XButton} from 'vux'
    export default {
        directives: {
          TransferDom
        },
        components: {
           Previewer,
           XImg,
           Group,
           Cell,
           Flexbox,
           FlexboxItem,
           XButton
        },
        props:{
            formData: {},
            cookieUser: {}
        },
        watch: {
            formData(data){
                if(data.headImg){
                    this.list[0].src = data.headImg
                }
                //特殊处理的数据
                if(data.file_status == "待审核"){
                        this.noAuthIsShow = true
                        this.btnType = "rztg"
                }else if(data.file_status == "通过"){
                        this.authIsShow = true
                        this.btnType = "qxrz"
                }
            }
        },
        data() {
            return {
                authIsShow:false,
                noAuthIsShow:false,
                btnType:"",//"qxrz"-取消认证    "rztg"-认账通过
                list: [{src:""}],
                options: {
                    getThumbBoundsFn (index) {
                        // find thumbnail element
                        let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                        // get window scroll Y
                        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                        // optionally get horizontal scroll
                        // get position of element relative to viewport
                        let rect = thumbnail.getBoundingClientRect()
                        // w = width
                        return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
                        // Good guide on how to get element coordinates:
                        // http://javascript.info/tutorial/coordinates
                    }
                }
            }
        },

        methods: {
            showPreview(index){
                this.$refs.previewer.show(index)
            },
            saveBtn(type){
                let mess = ""
                let url = ""
                let _this = this
                if(type == "通过"){
                        mess="你确认要认证通过?"
                        url = "/zingbiz/hrManager/PersonnelFile/attestPass"
                }else if(type == "待审核"){
                        mess="你确认要取消认证?"
                        url = "/zingbiz/hrManager/PersonnelFile/attestUnPass"
                }
                this.$vux.confirm.show({
                    title: "提示",
                    content:mess,
                    onCancel(){},
                    onConfirm(){
                        let params = {
                            file_status:type,
                            rowId:_this.formData.rowId,
                            companyId:_this.formData.companyId,
                            cardUrl:_this.formData.cardUrl
                        }
                        _this.$http.post(url,params).then(res => {
                            _this.$vux.toast.show({
                                    text: "操作成功！",
                                    type: "success",
                                    onHide () {
                                        _this.$router.back(-1)
                                    }
                            })
                        })
                    }
                })
            },
            chatFun(){
                let cardUrl = this.formData.cardUrl
                doOneChat(cardUrl,true,this.$router)
            }
        }
    }
</script>
<style>
    .vux-dialog-leave-active {
      animation: unset !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .headImgDiv {
        margin-top: 20px;
        margin-bottom: 10px
        text-align:center;
    }
    .headImg {
        border: 1px solid #CCC;
        background-color: #FFF;
        padding: 4px;
        display: inline-block;
        width: 200px;
        height: 200px;
    }
    .hr_title{
        color: #FF8000;
        font-weight: bold;
    }
    .chatIcon{
        position: fixed;
        bottom: 80px;
        right: 0px;
        height: 50px !important;
        width:50px;
    }
    .iconfont {
        font-size: 25px;
        position: relative;
        float: right;
        top: 20%;
    }
</style>
