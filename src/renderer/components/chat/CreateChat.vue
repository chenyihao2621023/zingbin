<template>
    <popup v-model="showPage" height="100%" width="100%" position="right" :popup-style="{'overflow-y': 'auto'}">
        <create-chat ref="createChat" :forwardChat="true" :forwardChatMode="'push'" :mySelfName="mySelfName" :refreshSeed="refreshSeed" @created="onCreated" @canceled="onCancel"></create-chat>
    </popup>
</template>

<script>
    import { Popup } from 'vux'
    import CreateChat from 'container/chat/CreateChat'

    export default {
        name: 'CreateChatPage',
        components: {
            Popup,
            CreateChat
        },
        data () {
            return {
                showPage: false,
                mySelfName: '',
                myCardUrl: '',
                refreshSeed: false,
            }
        },
        watch: {
            showPage(val) {
                if (val) {
                    if (!this.myCardUrl) {
                        this.getMyInfo()
                    }
                    this.refreshSeed = !this.refreshSeed
                }
            }
        },
        mounted() {
            this.getMyInfo()
        },
        methods: {
            onCreated() {
                console.log('create-chat.js onCreated')
               /* window.setTimeout(() => {
                    this.showPage = false
                }, 2500)*/

                let unwatch = this.$watch('$route', (to, from) => {
                    this.showPage = false
                    unwatch()
                })
            },
            onCancel() {
                this.showPage = false
            },
            getMyInfo() {
                let url = '/zingbiz/auth/user/getThisUserInfo'
                this.$http.post(url, {}).then(res => {
                    if (res.data.success) {
                        this.mySelfName = res.data.data.cardUrlName
                        this.myCardUrl = res.data.data.cardUrl
                    } else {
                        console.warn('CreateChatPage get user nick failed')
                    }
                }).catch(err => {
                    console.error('CreateChatPage get user nick failed', err)
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .create-chat-page
        width 100%
        height 100%
</style>
