<template>
    <div class="chat-settings">
        <popup v-model="reviseFlag" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div>
                <chat-header cancelText="取消" :title="reviseTitle" @doSome="handleClick" :isComeBack="isComeBack">
                    <div slot="header-right" style="margin-right:10px">
                    <span class="determine-modify-owner"
                          @click = "handleClick('determine',$event)"
                    >完成</span>
                    </div>
                </chat-header>
                <div style="width: 100%;height: 100%;overflow: auto;">
                    <group>
                        <x-input v-show="reviseNumber !== 3" class="chat-settings-textarea" :max="reviseLimit" :placeholder="revisePlaceholder" v-model="reviseTextSettings"></x-input>
                        <x-textarea v-show="reviseNumber === 3" class="chat-settings-textarea" :placeholder="revisePlaceholder" :height="parseFloat(maxHeight)" v-model="reviseTextSettings"></x-textarea>
                    </group>
                </div>
                <p v-show="reviseNumber===2" class="chat-settings-text">在这里你可以设置你在这个群里的昵称,这个昵称只会在这里群内显示</p>
                <toast @on-hide="leave" v-model="promptFlag" :type="promptType" :is-show-mask="promptTrue">{{promptText}}</toast>
            </div>
        </popup>
    </div>
</template>
<script>
    import { XTextarea,XHeader ,Popup,Group,Toast,XInput } from "vux";
    import { forwardingMeg } from "./chat-details"
    import ChatHeader  from "../../../components/zingHead/ZingHead.vue"  //公共头部
    import Qs from "qs"
    export default {
        name: 'ChatSetting',
        components: {
            ChatHeader,XTextarea, XHeader,Popup,Group,Toast,XInput
        },
        props:{
            mySelfName: {
              type : String,
              default : "我"
            },
            //显示隐藏当前页面
            reviseFlag: {
                type: Boolean,
                default: false
            },
            //当前页面的标题
            reviseTitle: {
                default: "标题",
                type: String
            },
            //修改的内容
            reviseText: {
                type: String
            },
            //字数限制
            reviseLimit: {
                type: Number,
                default: 9999
            },
            //did当前群id
            did : {
                type : String,
                required: true
            },
            chatType:{   //当前群类型
                type : String,
                required: true
            },
            //标识
            reviseNumber:{
                type:Number,
                required: true
            },
            groupAnnouncement:{
                type:[String,Boolean]
            },
            companyId : {
                type : String,
                default:""
            },
            revisePlaceholder: {
                type : String,
                default:''
            }
        },
        data() {
            return {
                isComeBack:false,
                promptTrue :true,
                promptText : "设置成功",
                promptFlag : false,
                promptType : "success",
                reviseTextSettings : "",
                maxHeight: 400
            }
        },
        computed:{
            urlGroupType() {
                return this.chatType === "ORG" ? "updateOrgChatInfo" : "updateGroupInfo";
            }
        },
        watch : {
            reviseText() {
                this.reviseTextSettings = this.reviseText
            }
        },
        methods:{
            //离开当前页面
            leave() {
                if (this.reviseNumber === 1 || this.reviseNumber === 3) {
                    let messageText = `'${this.mySelfName}'把群名改为'${this.reviseTextSettings}'`;
                    let message = PSMU.chatInfo.initInfoMessage(messageText);
                    if (this.reviseNumber === 3) {
                         messageText = `@全体: '${this.mySelfName}'把群公告改为'${this.reviseTextSettings}'`;
                         message = PSMU.chatInfo.initTextMessage(messageText);
                    }
                    let chatTitle = [{ did: this.did, type: this.chatType, companyId: this.companyId }];
                    forwardingMeg(chatTitle,message,this.forwardSuccess,this.$vux.toast.show);
                } else {
                    this.$emit("reviseClick",this.reviseNumber,this.reviseTextSettings)
                }
            },
            forwardSuccess () {
                this.$emit("reviseClick",this.reviseNumber,this.reviseTextSettings);
            },
            goBack() {
                this.$emit("reviseClick",this.reviseNumber,this.reviseTextSettings);
            },
            handleClick() {
                console.log('请求');
                if (arguments.length >= 2 && this.reviseTextSettings !== this.reviseText && this.reviseTextSettings.length > 0) {
                    let url;
                    let params = {};
                    switch (this.reviseNumber) {
                        case 1: //修改群名称
                            params.oTitle = this.reviseTextSettings;
                            params.did = this.did;
                            params.oDesc = this.groupAnnouncement ? this.groupAnnouncement : "";
                            url = `/ZingMH/ZDesk/MENHUWX/MHChat/${this.urlGroupType}.action`;
                            break;
                        case 2:  //修改群昵称
                            params.nickname = this.reviseTextSettings;
                            params.chatId = this.did;
                            url = `/ZingMH/ZDesk/myCustom/updateMyChatNickname.action`;
                            break;
                        case 3:  //修改群公告
                            params.oDesc = this.reviseTextSettings;
                            params.did = this.did;
                            url = `/ZingMH/ZDesk/MENHUWX/MHChat/${this.urlGroupType}.action`;
                            break;
                    }
                    this.$http.post(url,Qs.stringify(params)).then(res => {
                        if (res.data.retcode !== 0 && !res.data.success) {
                            this.reviseTextSettings = this.reviseText;
                            this.promptText = "设置失败";
                            this.promptType = "warn"
                        }
                        this.promptFlag = true;
                    });
                } else {
                    this.reviseTextSettings = this.reviseText;
                    this.goBack();
                }
            }
        }
    }
</script>
<style>
   .chat-details-html .weui-cell__bd input {
        text-align: left !important;
    }
    .chat-details-html .weui-cell__bd textarea {
        text-align: left !important;
    }
</style>
<style lang="stylus" scoped>
    .chat-settings-textarea
        color:#777;
    .determine-modify-owner
        font-size:15px;
        border:none;
        color:#FF8000;
        margin-right:2px;
    .chat-settings-text
        margin:5px 10px 0
        color:#b2b2b2
</style>

<!--<x-textarea class="chat-settings-textarea" placeholder="请设置" :height="parseFloat(maxHeight)" v-model="reviseTextSettings"></x-textarea>-->
