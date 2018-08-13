<template>
    <div class="member-details">
        <x-dialog v-model="showDetail" :dialog-style="{'max-width': '90%', width: '90%'}" mask-z-index="5000" >
            <!--<x-dialog v-model="showDetail">-->
                <!--:dialog-style="{'max-width': '95%', width: '95%', height: '95%'}"-->
            <!--<x-header style="background:#428bca;" :left-options="{showBack:false}">
                <h2 slot="left">用户详情</h2>
                <i @click="handleClick" slot="right" class="iconfont icon-shanchu3"></i>
            </x-header>-->

            <!--@click="handleClick"-->
               <!--<div class="member-details-scroll">
                   <div>
                       <div class="member-details-content">-->
                           <div class="org-member-details" >
                               <group>
                                   <div class="org-header">用户详情
                                   </div>
                                   <!--<x-header class="org-header" :left-options="{showBack: false}" style="background-color:#fff;">用户详情
                                   </x-header>-->
                                   <!--<zing-head :isComeBack="false" :title="'用户详情'">
                                       <div slot="header-right">fddddd</div>
                                   </zing-head>-->
                                   <flexbox justify="center" class="flex-demo">
                                       <flexbox-item :span="6">
                                           <div>
                                               <cell value-align="left" class="flex-demo-fontSize">姓名:{{personalDetails.userName}}</cell>
                                               <cell value-align="left" class="flex-demo-fontSize">商号:{{personalDetails.companyName}}</cell>
                                               <cell value-align="left" class="flex-demo-fontSize">角色:{{personalDetails.roleName}}</cell>
                                               <cell value-align="left" class="flex-demo-fontSize">部门:{{personalDetails.orgNames}}</cell>
                                           </div>
                                       </flexbox-item>
                                       <flexbox-item :span="4">
                                           <div class="flex-demo">
                                               <img style="width:100%;height:100%"
                                                    :src="getImageUrl(personalDetails.headImg,'./static/images/userDef_.jpg')"
                                                    onerror="this.src='./static/images/userDef_.jpg'"
                                               />
                                           </div>
                                       </flexbox-item>
                                   </flexbox>
                               <!--</group>
                               <br/>
                               <group>-->
                                   <div class="flex-introduce">
                                       <cell value-align="left">部门领导:{{personalDetails.orgLeader}}</cell>
                                       <!--<cell value-align="left">状态:{{personalDetails.jobInorNot}}</cell>-->
                                       <cell value-align="left">手机号:{{personalDetails.telPhone}}</cell>
                                       <!--<cell value-align="left">座机:{{personalDetails.workPhone}}</cell>-->
                                       <cell value-align="left">邮箱:{{personalDetails.email}}</cell>
                                   </div>
                               </group>
                           </div>

                           <div v-if="ownCardUrl === memberCardUrl && isAuth">
                               <flexbox class="user-details-flexbox" justify="space-around">
                                   <flexboxItem>
                                       <!--<x-button type="warn" @click.native="handleClick" action-type="button" text="关闭"></x-button>-->
                                       <div class="btn-height" @click="handleClick">
                                           关闭
                                       </div>
                                   </flexboxItem>
                               </flexbox>
                           </div>
                           <div v-else-if="ownCardUrl === memberCardUrl && !isAuth">
                               <flexbox class="user-details-flexbox" justify="space-around">
                                   <flexboxItem>
                                       <!--<x-button type="warn" @click.native="handleClick" action-type="button" text="关闭"></x-button>-->
                                       <div class="btn-height close" @click="handleClick">
                                           关闭
                                       </div>
                                   </flexboxItem>
                                   <flexboxItem>
                                       <!--<x-button @click.native="toAuth" style="background:orange;color:#fff" action-type="button" text="认证"></x-button>-->
                                       <div class="btn-height border-left" @click="toAuth">
                                           认证
                                       </div>
                                   </flexboxItem>
                               </flexbox>
                           </div>
                           <div v-else>
                               <flexbox class="user-details-flexbox" justify="space-around">
                                   <flexboxItem :span="3">
                                       <!--<x-button @click.native="toChatWith" style="background:orange;color:#fff" action-type="button" text="聊天"></x-button>-->
                                       <div class="btn-height" @click="handleClick">
                                           关闭
                                       </div>
                                   </flexboxItem>
                                   <flexboxItem :span="4">
                                   <div v-if="isFriend">
                                       <!--<x-button @click.native="findBusinessCard" type="primary" action-type="button" text="查看名片"></x-button>-->
                                       <div class="btn-height border-left-right" @click="findBusinessCard">
                                           查看名片
                                       </div>
                                   </div>
                                   <div v-else >
                                       <!--<x-button @click.native="addFriend" type="primary" action-type="button" text="添加好友"></x-button>-->
                                       <div class="btn-height border-left-right" @click="addFriend">
                                           添加好友
                                       </div>
                                   </div>
                                   </flexboxItem>
                                   <flexboxItem :span="3">
                                       <!--<x-button type="warn" @click.native="handleClick" action-type="button" text="关闭"></x-button>-->
                                       <div class="btn-height" @click="toChatWith">
                                           聊天
                                       </div>
                                   </flexboxItem>
                               </flexbox>
                           </div>
                       <!--</div>
                   </div>
               </div>-->
        </x-dialog>
    </div>
</template>
<script>
    import { XTextarea, XButton, XHeader, Flexbox, FlexboxItem , Popup,Group,XDialog,Cell } from "vux";
    import { getImageUrl } from "../../utils/fn"
    import LazyImage from '../../directives/lazyimage/lazy-image'
    import ZingHead from "@/components/zingHead/ZingHead";
    import { doOneChat } from "@/utils/fn";
    export default {
        name: 'OrgMemberDetail',
        directives: {
            LazyImage
        },
        components: {
            ZingHead,XTextarea, XButton, XHeader,Flexbox,FlexboxItem ,Popup,Group,XDialog,Cell
        },
        props:{
            //显示隐藏当前页面
            showDetail: {
                default: false,
                type: Boolean,
            },
            /*personalDetails:{
                type:Object,
                default:{},
            },*/
            memberCardUrl:{
                type:String
            },
            ownCardUrl:{
                type:String
            },
            companyId:{
                type:String
            },
            replaceChat: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isAuth: false,
                isFriend: false,
                personalDetails :{
                    headImg:"",
                    userName:"",
                    companyName:"",
                    roleName:"",
                    orgNames:"",
                    //jobInorNot:"",
                    orgLeader:"",
                    telPhone:"",
                    //workPhone:"",
                    email:"",
                }
            }
        },

        computed:{},
        watch: {
            showDetail: function (newVal, oldVal) {
                if (newVal) {
                    this.getPersonnelFile();
                }
            }
        },
        methods:{
            getPersonnelFile() {
                console.log('getPersonnelFile...............');
                let url = "/zingbiz/auth/user/getPersonnelFile";
                let params = {};
                params.companyId = this.companyId;
                params.cardUrl = this.memberCardUrl;
                this.$http.post(url,params).then(res => {
                    console.log(res);
                    let HrData = res.data.data
                    console.log(HrData);
                    if (HrData != null) {
                        this.personalDetails.headImg = HrData.headImg
                        this.personalDetails.userName = HrData.userName
                        this.personalDetails.companyName = HrData.companyName
                        this.personalDetails.roleName = HrData.roleName
                        this.personalDetails.orgNames = HrData.orgNames

                        //this.personalDetails.jobInorNot = HrData.jobInorNot
                        this.personalDetails.orgLeader = HrData.upleader

                        this.personalDetails.telPhone = HrData.telPhone
                        //this.personalDetails.workPhone = HrData.workPhone
                        this.personalDetails.email = HrData.email

                        if (HrData.isRelation === "true") {
                            this.isFriend = true
                        }
                        if (HrData.file_status === "待审核") {
                            /*this.file_status_name = "未认证"*/
                            this.isAuth = false
                        } else if (HrData.file_status === "通过") {
                            /*this.file_status_name = "已认证"*/
                            this.isAuth = true
                        } else if (HrData.file_status === "未建档") {
                            /*this.file_status_name = "未认证"*/
                            this.isAuth = false
                        }
                    }
                })
            },
            toAuth() { //去认证
                console.log('去认证');
                this.$router.push({ path:"/hrManager/userInfo",query:{ cardUrl:this.memberCardUrl,companyId:this.companyId }});
            },
            toChatWith() { //去聊天
                console.log('去聊天');
                doOneChat(this.memberCardUrl, true, this.$router, this.replaceChat)
            },
            addFriend(cardUrl) {
                let url = "/ZingMH/ZDesk/serviceFriend/insertFriendsEs.action";
                this.$http
                    .get(url, {
                        params: { cardUrlPeer: this.memberCardUrl }
                    })
                    .then(res => {
                        if ( res.success === "true" ) {
                            self.$vux.toast.show({
                                text: "已申请等待对方验证",
                                type: 'text',
                                position: 'bottom',
                            })
                        }
                    })
                    .catch(err => {
                        console.error(err)
                    });
            },
            findBusinessCard() { //查看名片
                this.$router.push(
                    { name:"cardDetails",query:{ cardUrl:this.memberCardUrl }});
            },
            handleClick() {
                this.$emit('hideDetail')
            },
            getImageUrl
        }
    }
</script>
<style>
    .member-details .vux-fade-leave-active,.vux-fade-leave-to,.vux-dialog-leave-active,.vux-dialog-leave-to {
        animation-duration: 0.2s!important;
        animation-name: none!important;
    }
</style>
<style lang="stylus" scoped>
    /*.member-details-scroll
        width:100%
        height:82%
        overflow-y: auto
        position:fixed
        left :0
        top:40px
    .org-member-details{
        color:#fff;
        margin:20px 10px
    }*/
    .flex-demo {
        color:#000;
        /*background-color:#eeeeee;*/
        border-radius: 4px;
        .flex-demo-fontSize{
            font-size:15px;
        }
    }
    .flex-introduce{
        /*background-color:#eeeeee;*/
        padding-left:24px;
        font-size:15px;
        box-sizing:border-box;
    }
    .org-header .vux-header-title {
        color: red;
    }

    .org-header {
        background-color: #fff;
        line-height: 2.11176471;
        font-size: 16px;
        overflow: hidden;
        position: relative;
        border-bottom-color: #f0f0f0;
        border-bottom-style: solid;
        border-bottom-width: 1px;
    }
    .btn-height {
        text-align: center;
        height: 36px;
        color: #ff8000;
        padding-top: 10px;
    }
    .border-left-right {
        border-left: 1px solid #f0f0f0;
        border-right: 1px solid #f0f0f0;
        color: #1abbfc;
    }
    .border-left {
        border-left: 1px solid #f0f0f0;
    }
    .btn-height.close{
        color: #000;
    }
    /*.user-details-flexbox*/
        /*position:fixed*/
        /*bottom:0*/
        /*left:0*/
        /*right:0*/
        /*width:100%*/
        /*height:60px*/
        /*padding:10px 0*/
        /*background-color:#f7f7f7*/
        /*box-sizing:border-box*/

</style>
