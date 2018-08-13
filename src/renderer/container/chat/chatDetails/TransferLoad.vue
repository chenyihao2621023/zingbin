<template>
    <div>
        <popup v-model="showTransferLoad" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <remove-transfer
                :max="max"
                :cardUrl="cardUrl"
                :showMark="showTransferLoad"
                @clickConfirm="transferCrew"
                @onOperationCrew="hideTransfer"
                :operationCrewTitle="transferTitle"
                :operationCrewBtn="transferBtn"
                :operationCrewPrompt="transferPrompt"
                :operationCrewList="transferCrewList"
            ></remove-transfer>
        </popup>
    </div>
</template>
<script>
    import { Popup } from "vux";
    import  RemoveTransfer from "./RemoveTransfer.vue";
    import Qs from "qs";
    import { forwardingMeg } from "./chat-details";
    export default {
        name: 'RemoveMember',
        components: {
            RemoveTransfer,
            Popup
        },
        props:{
            outGroupMark: {
                type: false,
                default: false
            },
            showTransferLoad: {
                type: Boolean,
                default: false
            },
            transferCrewList: {
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
                transferTitle: '转让群主',
                transferBtn: '转让',
                transferPrompt:'请选择转让成员',
                max: 1,
                cardUrlPeer: ''
            }
        },
        computed: {
            urlTransferOwner() { //设置选择路径
                return this.chatType === "ORG" ? "OrgTransferAndOut" : "TransferAndOut";
            },
        },
        methods: {
            hideTransfer() {
                this.$emit('onHideTransferLoad')
            },
            forwarding( transferLoadName) {
                let message = PSMU.chatInfo.initInfoMessage(`'${transferLoadName}'已经成为新群主`);
                let transferGroupList = [{ did: this.did, type: this.chatType, companyId: this.companyId }];
                forwardingMeg(transferGroupList,message,this.forwardSuccess,this.$vux.toast.show);
            },
            forwardSuccess() {
                this.$emit('transferSuccess',this.cardUrlPeer)
            },
            transferCrew(returnInitData,transferLoadName,selectedList) {
                let cardUrlPeer = Array.isArray(selectedList) ? selectedList[0] : null;
                this.cardUrlPeer = cardUrlPeer;
                let urlChangeOwner = `/ZingMH/ZDesk/MENHUWX/MHChat/${this.urlTransferOwner}.action`;
                let paramsChangeOwner = {
                    groupId : this.did,
                    cardUrlPeer : cardUrlPeer
                };
                this.$http.post(urlChangeOwner,Qs.stringify(paramsChangeOwner)).then(res => {
                    const _this = this;
                    if (res.data && res.data.success) {
                        this.$vux.toast.show({
                            text: "转让群主成功，正在转发！",
                            type: 'text',
                            position: 'bottom',
                            onHide() {
                                returnInitData();
                                console.log(_this.outGroupMark);
                                _this.forwarding(transferLoadName);
                            }
                        })
                    } else {
                        this.$vux.toast.show({
                            text: '转让群主失败',
                            type: 'text',
                            position: 'bottom'
                        })
                    }
                }, error => {
                    this.$vux.toast.show({
                        text: '转让群主失败',
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

