<template>
    <div class="chat-list">
        <!--消息列表-->
        <div class="list-wrapper" v-if="allChatCpd && allChatCpd.length !== 0">
            <h1>消息列表</h1><hr>
            <GridCard v-for="(chat, index) in allChatCpd" :key="index">
                <div slot="cardLeft" class="left" @click="gotoChat(chat)">
                    <div class="left-wrapper">
                        <p class="left-wrapper-title">{{chat.ctitle}}</p>
                        <div class="left-wrapper-desc">{{chat.cd}}</div>
                    </div>
                </div>
                <div slot="cardRight" class="right">{{chat.ct}}</div>
            </GridCard>
        </div>
        <div class="list-wrapper prompt" v-else>暂无消息</div>
        <!--我的群组-->
        <div class="list-wrapper" v-if="groupChatCpd && groupChatCpd.length !== 0">
            <h1>我的群组</h1><hr>
            <GridCard v-for="(chat, index) in groupChatCpd" :key="index">
                <div slot="cardLeft" class="left" @click="gotoChat(chat)">
                    <div class="left-wrapper">
                        <p class="left-wrapper-title">{{chat.ctitle}}</p>
                        <div class="left-wrapper-desc">{{chat.cd}}</div>
                    </div>
                </div>
                <div slot="cardRight" class="right"></div>
            </GridCard>
        </div>
        <div class="list-wrapper prompt" v-else>暂无群聊</div>
    </div>
</template>
<script>
    import GridCard from '../../../components/gridcard/GridCard.vue'
    import Avatar from '../../../components/avatar/Avatar.vue'
    import { goChat, Z_IsEmpty20 } from "@/utils/fn";

    export default {
        components: {
            GridCard,
            Avatar,
        },
        data() {
            return {
                groupChat: [],
                alertChat: []
            }
        },
        computed: {
            groupChatCpd () {
                return this.groupChat.map(chat => {
                    let cid = chat.groupType === 'group' ? chat.id : chat.chatId
                    chat.cid = cid
                    chat.auc = cid.indexOf('alluserscompany') >= 0
                    chat.ct = chat.groupType === 'group' ? 'GROUP' : 'ORG'
                    chat.cd = chat.auc ? 'alluserscompany' : chat.ct
                    let gTitle = chat.groupType === 'group' ? chat.groupTitle : chat.Alias1
                    chat.companyId = chat.groupType === 'group' ? chat.companyId : chat.Alias3
                    chat.ctitle = chat.auc ? gTitle + ' ' + chat.companyId : gTitle
                    return chat
                })
            },
            allChatCpd () {
                return this.alertChat.map(chat => {
                    chat.cid = chat.tarId
                    chat.ct = chat.bType
                    chat.cd = chat.dispMsg
                    chat.companyId = chat.companyId
                    chat.ctitle = chat.peerRealName
                    return chat
                })
            }
        },
        created() {
            let url = '/ZingMH/ZDesk/myGroup/loadMyAllGroupChat.action';
            this.$http.get(url, {}).then(res => {
                this.groupChat = res.data.data
            }).catch((err) => {
                console.log(err)
            })
            let url2 = '/ZingMH/ZDesk/MENHUWX/MHHelper/loadUserAlert.action?loadType=chatAlert&pageSize=200'
            this.$http.get(url2, {}).then(res => {
                this.alertChat = res.data.data.data.filter(chat => {
                    return chat.bType.toLowerCase() === 'group' || chat.bType === 'ORG' || chat.bType === 'chat' || chat.bType === 'IM'
                })
            }).catch((err) => {
                console.log(err)
            })
        },
        methods: {
            gotoChat(chat) {
                if (chat.ct === 'ORG' && chat.companyId) {
                    /*加快进入聊天页面的速度，app端正常情况不需要切换companyId 有问题按bug处理*/
                    this.changeUserCompany(chat.companyId, () => {

                    })
                    goChat(chat.cid, chat.ct === 'ORG' ? chat.companyId : null, chat.ct, this.$router)
                } else {
                    goChat(chat.cid, chat.ct === 'ORG' ? chat.companyId : null, chat.ct, this.$router)
                }

               /* let params = {}
                params.did = chat.cid
                params.type = chat.ct
                if (chat.ct === 'ORG') {
                    params.companyId = chat.companyId
                }
                this.$router.push({
                    path: '/chat',
                    query: params
                })*/
            },
            changeUserCompany (companyId, callback) {
                if (!Z_IsEmpty20(companyId)) {
                    console.log('开始切换商号');
                    let url = '/ZingMH/ZDesk/MENHUWX/Company/updateCompany.action?mustCompanyUser=1&companyId=' + companyId
                    this.$http.post(url, {}).then(res => {
                        console.log('切换商号成功');
                        callback();
                    }).catch(err => {
                        console.error("操作失败", err);
                    })
                }
            },
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import '../../../assets/stylus/variable.styl'
    @import '../../../assets/stylus/mixin.styl'

    .chat-list
        width: 100%
        height: 100%
        overflow: hidden
        flex-center(row, start, start)
        .list-wrapper
            width: 50%
            height: 100%
            overflow-y: auto
    .grid-card
        padding-left: 0
        padding-right: 0
        overflow: hidden
</style>
