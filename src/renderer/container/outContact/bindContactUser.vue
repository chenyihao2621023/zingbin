<template>
    <div class="outerwarpper">
       <div v-show="innerwrapper">
           <ZingHead title="绑定外联人"></ZingHead>
           <div class="userInfo">
               <div class="userInfo-companyName">{{companyName}}</div>
               <div class="userInfo-showCard">
                   <div class="userInfo-showCard-head">
                       <img v-bind:src="imgSrc" class="userInfo-showCard-head-imgSrc">
                       <div class="userInfo-showCard-head-content">
                           <div class="userInfo-showCard-head-content-RealName">{{RealName}}</div>
                           <div class="userInfo-showCard-head-content-position">
                               <span>{{departmentAndName}}</span>
                               <span>{{WorkTitle}}</span>
                           </div>
                           <div class="userInfo-showCard-head-content-Company">
                               {{Company}}
                           </div>
                       </div>
                   </div>
                   <div></div>
               </div>
               <group class="userInfo-info">
                   <x-input title="手机" v-model="Cellphone" disabled></x-input>
                   <x-input title="邮箱" v-model="Email" disabled></x-input>
                   <x-input title="地址" v-model="Address" disabled></x-input>
               </group>
           </div>
           <div></div>
           <div class="ExternalContact">
               <div class="ExternalContact-choose" @click="chooseBtn()" v-show="choose">选择要绑定的外联人</div>
               <div class="ExternalContact-info" v-show="info">
                   <div v-for="(item,index) in ExternalContact" :key="index" class="child">
                       <span class="ExternalContact-info-title">{{item.title}}</span>
                       <span class="ExternalContact-info-value">{{item.value}}</span>
                   </div>
                   <div class="reset" v-show="reset" @click="resetContact()">重置</div>
               </div>
               <x-button type="primary" class="btn-save" @click.native="confirmRelation()" v-show="btnFlag">确认绑定</x-button>
           </div>
       </div>
        <externalContactPicker
            :popup="popup"
            @cancle="cancle"
            @contactDetail="contactDetail"
        >
        </externalContactPicker>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import externalContactPicker from "./template/externalContactPicker";
    import { XInput,Group,XButton } from 'vux'
    import { getThumbUrl,Z_DecodeU2 ,Z_IsEmpty20 } from '../../utils/fn'
    export default {
        name: "bind-contact-user",
        components:{
            ZingHead,
            XInput,
            Group,
            externalContactPicker,
            XButton
        },
        data () {
            return {
                cardurl:"2YV3emJ3MfiaARbu6jJVji2m",
                companyName:"",
                CardData:"",
                imgSrc:"",
                RealName:"",
                departmentAndName:"",
                WorkTitle:"",
                Company:"",
                Cellphone:"",
                Email:"",
                Address:"",
                ExternalContact:[],
                popup:false,
                innerwrapper:true,
                choose:true,
                info:false,
                btnFlag:false,
                reset:false,
                item:""
            }
        },
        created() {
            this.showCard()
            this.getBindExternalContact()
            this.getServiceNumInfo()
            if (!Z_IsEmpty20(this.$route.query.go)) {
                this.chooseBtn()
            }
        },
        methods:{
            showCard() {
                this.$http.post("/zingbiz/auth/user/showCard",{
                    cardUrl:this.cardurl
                }).then((res) => {
                    this.CardData = res.data.data
                    this.RealName = this.CardData.cardInfo.RealName
                    this.departmentAndName = this.CardData.cardInfo.departmentAndName
                    this.WorkTitle = this.CardData.cardInfo.WorkTitle
                    this.Company = this.CardData.cardInfo.Company
                    this.Cellphone = this.CardData.cardInfo.Cellphone
                    this.Email = this.CardData.cardInfo.Email
                    this.Address = this.CardData.cardInfo.Address
                    let headimgurl = Z_DecodeU2(this.CardData.cardInfo.headimgurl) + '?_t=' + new Date().getTime();
                    this.imgSrc = getThumbUrl(headimgurl,80,80,'/JsLib/dist/app/images/defaultImgs/userDef_.jpg',true)
                })
            },
            getBindExternalContact() {
                this.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/getBindExternalContact",{
                    // bindUser:"vQFVj2AFnYNjmye6jyNne2uq"
                    bindUser:"2YV3emJ3MfiaARbu6jJVji2m"
                }).then((res) => {
                    if (res.data.data.total === "0") {
                        this.choose = true
                        this.info = false
                    } else {
                        this.choose = false
                        this.info = true
                        this.ExternalContact.push({
                            title:"姓名",
                            value:res.data.data.data[0].externalContactsName
                        })
                        this.ExternalContact.push({
                            title:"手机号",
                            value:res.data.data.data[0].telPhone
                        })
                        this.ExternalContact.push({
                            title:"证件类型",
                            value:res.data.data.data[0].idCardType
                        })
                        this.ExternalContact.push({
                            title:"证件号码",
                            value:res.data.data.data[0].idCard
                        })
                    }
                })
            },
            getServiceNumInfo() {
                this.$http.post("/zingbiz/auth/user/loadUserCurrentCompanyInfo",{
                }).then((res) => {
                    this.companyName = res.data.data.companyName
                })
            },
            //绑定外联人
            chooseBtn() {
                this.innerwrapper = false
                this.popup = true
            },
            //返回
            cancle() {
                this.popup = false
                this.innerwrapper = true
            },
            //绑定外联人数据
            contactDetail(item) {
                this.popup = false
                this.innerwrapper = true
                this.reset = true
                this.btnFlag = true
                this.info = true
                this.choose = false
                this.ExternalContact.push({
                    title:"姓名",
                    value:item.contactsName
                })
                this.ExternalContact.push({
                    title:"手机号",
                    value:item.telPhone
                })
                this.ExternalContact.push({
                    title:"证件类型",
                    value:item.idCardType
                })
                this.ExternalContact.push({
                    title:"证件号码",
                    value:item.idCard
                })
                this.item = item
            },
            //重置绑定外联人
            resetContact() {
                this.ExternalContact = []
                this.reset = false
                this.btnFlag = false
                this.info = false
                this.choose = true
            },
            //确认绑定
            confirmRelation() {
                this.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/bindUserToExternalContact",{
                    bindUser:"vQFVj2AFnYNjmye6jyNne2uq",
                    contactsId:this.item.contactsId,
                }).then((res) => {
                    if (!res.data.success) {
                        this.$vux.toast.text("用户已绑定其他外联人");
                    } else {
                        //跳页
                        this.$router.go(-1)
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outerwarpper{
        height 100%
        background-color #E4E6E9
    }
    .userInfo{
        margin 13px
        &-companyName{
            color: rgba(16, 16, 16, 1);
            font-size: 18px;
            font-family: Arial;
        }
        &-showCard{
            &-head{
                position relative
                margin-top 13px
                &-imgSrc{
                    width: 60px;
                    height: 60px;
                    border-radius: 5px;
                }
                &-content{
                    position absolute
                    top:0
                    left 86px
                    &-RealName{
                        margin-bottom 8px
                    }
                    &-Company{
                        margin-top 8px
                    }
                }
            }
        }
        &-info{
            margin-top 13px
        }
    }
    .ExternalContact{
        margin 13px
        &-choose{
            color: rgba(77, 169, 235, 1);
            font-size: 14px;
            font-family: Arial;
        }
        &-info{
            position relative
            background-color white
            padding 13px
            margin-bottom 13px
            &-title{
                font-size 14px
                font-weight: 600
                color:#333
            }
        }
    }
    .child{
        margin-top 10px
    }
    .reset{
        position absolute
        top 10px
        right 13px
        color #478fca
    }
</style>
