
<template>
  <div class="my-groups">
      <chat-head class="message-my-group-head" @goBack="goBack" :title="'我的群组'" :hasDetail="false">
          <div slot="right">
              <x-button class="head-btn" :type="'primary'" :mini="true" @click.native="clickDetermine" :disabled="isClick" >确定</x-button>
          </div>
      </chat-head>
      <div class="message-my-group-list">
          <div class="message-my-group-list-scroll">
              <div class="message-my-group-list-content">
                  <check-panel v-model="selectedGroups" :list="myGroupList" :disabled="isMultiple" :type="'6'" :label-position="'left'"></check-panel>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
    import { XButton } from "vux"
    import ChatHead from './ChatHead'
    import CheckPanel from "../../components/checkpanel/CheckPanel"

    export default {
        components: {
            CheckPanel,
            ChatHead,
            XButton
        },
        props:{
        },
        data() {
          return {
              isMultiple: false,
              myGroupList:[],
              selectedGroups:[]
          }
         },
        computed: {
            recentChatKeyDict() {
                let map = {};
                this.myGroupList.forEach(item => {
                    map[item.key] = { did:item.key,type:item.type,companyId:item.companyId,headAvatar:"./static/images/userDef_.jpg" }
                });
                return map
            },
            isClick() {
                return this.selectedGroups.length > 0 ? false : true
            }
        },
        mounted() {
            this.getMyGroups();
     },
        methods: {
         getMyGroups() {
             let urlMyGroup = '/ZingMH/ZDesk/myGroup/loadMyAllGroupChat.action';
             this.$http.post(urlMyGroup).then(res => {
                if (res.data.success) {
                    let rData = res.data.data;
                    console.log("MyGroups",rData);
                    let messageObj = {};
                    let endData = rData.map(message => {
                        if (message.groupType === "org") {
                            messageObj = {
                                key: message.chatId,
                                title: message.Alias1,
                                source: message,
                                type:"org",
                                companyId:message.Alias3
                            }
                        } else {
                            messageObj = {
                                key: message.id,
                                title: message.groupTitle,
                                source: message,
                                type:"group",
                                companyId:null
                            }
                        }
                        return messageObj
                    });
                    this.myGroupList = endData
                }
             })
         },
         goBack() {
             this.$emit("onMyGroupsCanceled");
            this.selectedGroups = [];
        },
        clickDetermine() {
            let selectData = this.selectedGroups.map(key => this.recentChatKeyDict[key]);
            this.$emit("onMyGroupDetermine",selectData);
            this.selectedGroups = [];
        }
    }
  }
</script>
<style scoped lang="stylus">
    .head-btn
        height: 30px
        line-height: 30px
        margin-right: 1rem
    .my-groups
        width: 100%
        height: 100%
        flex-center(column, flex-start, flex-start)
        & > div
            width: 100%
         .message-my-group-list
            position:relative
            left :0
            top :44px
            overflow-y: auto
         .message-my-group-head
             position:fixed
             left :0
             top:0
             z-index:99
             flex-shrink:0

</style>
