<template>
    <div>
        <popup v-model="showRemoveMember" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
          <remove-transfer
           :cardUrl="cardUrl"
           :showMark="showRemoveMember"
           @clickConfirm="removeCrew"
           @onOperationCrew="hideRemove"
          :operationCrewTitle="removeTitle"
          :operationCrewBtn="removeBtn"
          :operationCrewPrompt="removePrompt"
          :operationCrewList="removeCrewList"
          ></remove-transfer>
        </popup>
    </div>
</template>
<script>
    import { Popup } from "vux";
    import  RemoveTransfer from "./RemoveTransfer.vue";
    import Qs from "qs";
    import { forwardingMeg } from "./chat-details"
    export default {
        name: 'RemoveMember',
        components: {
            RemoveTransfer,
            Popup
        },
        props:{
            showRemoveMember: {
                type: Boolean,
                default: false
            },
            removeCrewList: {
                type: Array,
                default() {
                    return []
                }
            },
            cardUrl: {
                type: String,
                default: ''
            },
            did: {
                type: String,
                default:''
            },
            chatType: {
                type: String,
                default:''
            },
            companyId: {
                type: String,
                default:''
            }
        },
        data() {
            return {
             removeTitle: '移除群成员',
             removeBtn: '删除',
             removePrompt:'请选择移除该成员',
             selectedList: []
            }
        },
        computed: {},
        methods: {
            hideRemove() {
                this.$emit('onHideRemoveMember')
            },
            forwarding( removeMembersName) {
                let message = PSMU.chatInfo.initInfoMessage(`'${removeMembersName}'移除群聊`);
                let removeGroupList = [{ did: this.did, type: this.chatType, companyId: this.companyId }];
                forwardingMeg(removeGroupList,message,this.forwardSuccess,this.$vux.toast.show);
            },
            forwardSuccess() {
                this.$emit('removeSuccess',this.selectedList)
            },
            removeCrew(returnInitData,removeMembersName,selectedList) {
                this.selectedList = selectedList;
                let cardUrlPeer = selectedList.join(" "); //要删除的成员
                let urlRemoveGroupMembers = "/ZingMH/ZDesk/MENHUWX/MHChat/deleteGroupMember.action";
                let paramsRemoveGroupMembers = {
                    cardUrlPeer:cardUrlPeer,
                    delType:"batch",
                    groupId:this.did,
                    type:this.chatType
                };
                if (this.chatType === "ORG") {
                    paramsRemoveGroupMembers.companyId = this.companyId;
                }
                this.$http.post(urlRemoveGroupMembers,Qs.stringify(paramsRemoveGroupMembers)).then(res => {
                    if (res.data && res.data.success) {
                        returnInitData();
                        this.$vux.toast.show({
                            text: "删除成功，正在转发！",
                            type: 'text',
                            position: 'bottom',
                        })
                        this.forwarding(removeMembersName,selectedList)
                    } else {
                        this.$vux.toast.show({
                            text: '删除失败',
                            type: 'text',
                            position: 'bottom'
                        })
                    }
                },error => {
                    this.$vux.toast.show({
                        text: '删除失败',
                        type: 'text',
                        position: 'bottom'
                    })
                });

            }
        }
    }
</script>
<style scoped>
</style>
