<template>
    <div>
        <popup v-model="showPage" height="100%" width="100%" position="right" :popup-style="{'overflow-y': 'auto','zIndex':1002}">
            <forwarder @hideForwarder="hideForwarder" :message="message"></forwarder>
        </popup>
    </div>
</template>
<script>
    import { Popup } from 'vux'
    import Forwarder from 'container/chat/Forwarder.vue'
    import ChatInfo from '../../utils/chatInfo'

    export default {
        name: 'ShareMessage',
        components: {
            Forwarder, Popup
        },
        data() {
            return {
                message: null,
                myCardUrl: null,
                mySelfName: null,
                showPage: false,

                link: '',
                title: '',
                content: '',
                logoUrl: '',
                sourceType: '',
                fileId: ''
            }
        },
        computed: {},
        watch: {
            showPage(val) {
                if (val) {
                    let shareMessage = () => {
                        let chatInfo
                        if (PSMU && PSMU.chatInfo) {
                            chatInfo = PSMU.chatInfo
                        } else {
                            chatInfo = new ChatInfo.ChatInfo()
                            chatInfo.setSelf(this.myCardUrl)
                            chatInfo.setVal('nick', this.mySelfName)
                        }

                        let message = chatInfo.initLinkCardMessage(this.link, this.title, this.content, this.logoUrl, this.sourceType, this.fileId);
                        this.message = message;
                    }

                    if (!this.myCardUrl) {
                        this.getMyInfo().then(shareMessage)
                    } else {
                        shareMessage()
                    }
                }
            }
        },
        mounted() {
            this.getMyInfo()
        },
        methods: {
            hideForwarder() {
                this.showPage = false
            },
            getMyInfo() {
                return new Promise((resolve, reject) => {
                    let url = '/zingbiz/auth/user/getThisUserInfo'
                    this.$http.post(url, {}).then(res => {
                        if (res.data.success) {
                            this.myCardUrl = res.data.data.cardUrl
                            this.mySelfName = res.data.data.cardUrlName
                            resolve()
                        } else {
                            console.warn('ShareMessage get user cardUrl failed')
                            reject(new Error('ShareMessage get user cardUrl failed'))
                        }
                    }).catch(err => {
                        console.error('ShareMessage get user cardUrl failed', err)
                        reject(err)
                    })
                })
            }
        },
    }
</script>
<style scoped>
</style>
