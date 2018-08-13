<template>
    <div>
        <popup style="overflow-y:scroll" v-model="showIncreasePersonnel" height="100%" width="100%" position="right"
               :popup-style="{'overflow': 'hidden'}">
            <contact-picker
                :companyId="companyId"
                :initialSelected="initialSelected"
                :currentCompanyMode="currentCompanyMode"
                :confirmMsg="confirmMsg"
                @goBack="onCanceled"
                @picked="onContactPicked">
            </contact-picker>
        </popup>
    </div>
</template>
<script>
    import { Popup } from 'vux'
    import Qs from "qs"
    import OrgMemberPicker from "../../../components/orgmemberpicker/OrgMemberPicker.vue"
    import ContactPicker from '../../../components/contactpicker/ContactPicker';
    import { forwardingMeg } from "./chat-details"
    export default {
        name: 'AddGroupUser',
        components: {
            OrgMemberPicker,
            ContactPicker,
            Popup,
        },
        props: {
            mySelfName: {
                type: String,
                default: "我"
            },
            initialSelected: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            showIncreasePersonnel: {
                type: Boolean,
                default: false
            },
            companyData: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            chatType: {
                type: String,
            },
            did: {
                type: String //当前的群ID
            },
            companyId: {
                type: String
            }
        },
        data () {
            return {
                cardUrl: "",
                addGroupMembers: [],
                confirmMsg: '确定邀请%s加入群聊'
            }
        },
        computed: {
            currentCompanyMode() {
                return this.chatType === "ORG" ? true : false;
            }
        },
        methods: {
            getCardUrl() {
                let urlCard = "/ZingMH/ZDesk/externalContacts/getCurrentCardUrl.action";
                this.$http.post(urlCard).then(res => {
                    console.log('getCardUrl', res);
                    if (res.data.success) {
                        this.cardUrl = res.data.data.cardUrl
                    } else {
                        console.error('getCardUrl failed', res)
                    }
                }).catch(err => {
                    console.error(err)
                })
            },

            onCanceled() {
                this.addGroupMembers = [];
                this.$emit("hideAddUsers");
            },
            forwardSuccess() {
                this.$emit("successAddUsers", this.addGroupMembers);
            },
            forwarding(addPeopleName) {
                let message = PSMU.chatInfo.initInfoMessage(`'${this.mySelfName}'邀请'${addPeopleName}'加入群聊`);
                let addGroupList = [{did: this.did, type: this.chatType, companyId: this.companyId}];
                forwardingMeg(addGroupList, message, this.forwardSuccess, this.$vux.toast.show);
            },
            onContactPicked(addGroupMembers, addPeopleName) { //跳转+清空数据
                this.addGroupMembers = addGroupMembers;
                let addCardUrlStr = [];
                addGroupMembers.forEach(item => {
                    addCardUrlStr.push({id: item.cardUrl})
                });

                addCardUrlStr = JSON.stringify(addCardUrlStr);
                let urlInciteUsers = "/ZingMH/ZDesk/MENHUWX/MHChat/inviteGroupFriends.action";
                let params = {
                    did: this.did,
                    inviteOrgFriendsData: addCardUrlStr,
                    inviteGroupFriendsData: addCardUrlStr
                };

                if (this.chatType === "ORG") {
                    params.companyId = this.companyId;
                    urlInciteUsers = `/ZingMH/ZDesk/MENHUWX/MHChat/inviteOrgFriends.action`;
                }
                this.$http.post(urlInciteUsers, Qs.stringify(params)).then(res => {
                    const _this = this;
                    if (res.data.retcode === 0) {
                        this.$vux.toast.show({
                            text: "成功添加，正在转发！",
                            type: 'text',
                            position: 'bottom',
                            onHide() {
                                _this.forwarding(addPeopleName)
                            }
                        })
                    } else {
                        this.$vux.toast.show({
                            text: '添加失败',
                            type: 'text',
                            position: 'bottom'
                        })
                    }
                }, error => {
                    this.$vux.toast.show({
                        text: '添加失败',
                        type: 'text',
                        position: 'bottom'
                    })
                })
            }
        }
    }
</script>




