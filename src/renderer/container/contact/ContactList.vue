<template>
  <div>
      <template v-if="conTactType === 1">
             <div v-for="(item ,index) in list " :key="index" style=" position: relative">
                 <grid-card>
                     <div slot="cardLeft" class="left">
                         <avatar shape="square" :src="item.src" size="large"></avatar>
                         <i class="friend-dot" v-show="item.hasRead ==='false' && item.favtype ==='shenqing'"></i>
                         <div class="left-wrapper">
                             <p class="left-wrapper-title">{{item.title}}</p>
                             <div class="left-wrapper-desc">{{item.desc}}</div>
                         </div>
                     </div>
                     <div slot="cardRight" class="right_contact" v-show="showRight">
                         <p v-show="!showRightIcon&&item.text" :style="{color:item.c,backgroundColor:item.bc}"
                            class="cont-right-text"
                         >
                             {{item.text}}
                         </p>
                     </div>
                 </grid-card>
                 <div
                     @click="clickItem(item)"
                      @longpress="itemLongPress(item)"
                      v-long-press
                      class="handling-events"
                 >
                     <span v-if="showRightIcon" class="iconfont icon-icon-- icon-right-chat" @click.stop="clickChat(item)" style="color: #ff8000;font-size: 30px"></span>
                     <div class="icon-right-chat" v-show="!showRight">
                         <span v-if="item.type==='shenqing'" class="contact-remove-verify">等待验证</span>
                         <button style="background: #ff8000" v-else class="contact-remove-btn" @click.stop="acceptRequest(item)">接受</button>
                         <button class="contact-remove-btn" @click.stop="removeRequest(item)">删除</button>
                     </div>
                </div>
             </div>
      </template>
      <template v-if="conTactType === 2">
        <div v-for="(itemData,index) in titleList" :key="index">
            <div class="contact-list" v-show="itemData.listData.length">
                <h3 class="contact-list-title">{{itemData.title}}</h3>
                <div style="position: relative" v-for="(item ,i) in itemData.listData " :key="i">
                    <grid-card >
                        <div slot="cardLeft" class="left">
                            <avatar shape="square" :src="item.src" size="large"></avatar>
                            <div class="left-wrapper">
                                <p class="left-wrapper-title">{{item.title}}</p>
                                <div class="left-wrapper-desc">{{item.desc}}</div>
                            </div>
                        </div>
                        <div slot="cardRight" class="right_contact">

                            <p v-show="!showRightIcon&&item.text" :style="{color:item.c,backgroundColor:item.bc}"
                               class="cont-right-text"
                            >
                                {{item.text}}
                            </p>
                        </div>
                    </grid-card>
                    <div
                        @click="clickItem(item)"
                        @longpress="itemLongPress(item)"
                         v-long-press
                         style="position: absolute;top: 0;right: 53px; bottom: 0;left: 0;z-index: 3;"></div>
                </div>
            </div>
        </div>
      </template>
      <p class="contact-list-nav-text" v-show="!list.length">{{promptTitle}}</p>
  </div>
</template>
<script>
   import GridCard from "../../components/gridcard/GridCard.vue"
   import Avatar from "../../components/avatar/Avatar.vue"
   import LongPress from '../../directives/longpress/long-press'
  export default {
    name: 'ContactList',
     directives: {
          LongPress
    },
    components: {
        GridCard,
        Avatar
    },
      props:{
          list:{
              type:Array,
              default() {
                  return []
              }
          },
          usedList:{
              type:Array,
              default() {
                  return []
              }
          },
          unUsedList:{
              type:Array,
              default() {
                  return []
              }
          },
          showRightIcon: {
              type: Boolean,
              default: false
          },
          conTactType: {
              type: Number,
              default: 1
          },
          showRight: {
              type: Boolean,
              default: false
          },
          promptTitle: {
              type: String,
              default: '暂无内容'
          }
      },
    data() {
      return {
//          titleList:[
//              { title:'常用群组',listData: this.usedList },
//              { title:'30天内无消息的群组',listData:this.unUsedList }
//              ]
      }
    },
      computed: {
          titleList() {
              return [
                  { title:'常用群组',listData: this.usedList },
                  { title:'30天内无消息的群组',listData:this.unUsedList }
              ]
          }
      },
    methods: {
        clickItem(item) {
            this.$emit('clickItem',item)
        },
        clickChat(item) {
            this.$emit('goChat',item)
        },
        itemLongPress(item) {
            this.$emit('getTags',item);
        },
        removeRequest(item) {
            this.$emit('onRemoveRequest',item);
        },
        acceptRequest(item) {
            this.$emit('onAcceptRequest',item);
        }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
    .left-wrapper-title
        margin-bottom: -2px
        font-size 16px
        width 80%
    .left-wrapper-desc
        margin-top: 5px
    .right_contact
      position absolute
      right  13px
      top 15px
      p
       height: 20px
       border-radius: 5px
       line-height: 20px
       width 50px
       text-align:center
    .contact-list-title
      padding:15px 0 7px 10px
      width:100%
      background-color:#e5e5e5
      color:#A1A1A1
      font-size:18px
    .handling-events
      position: absolute
      top: 0
      right: 0
      bottom: 0
      left: 0
      z-index: 3
      .icon-right-chat
          position absolute
          right 13px
          top: 50%
          font-size:20px
          transform translateY(-50%)
          z-index:100!important
    .contact-list-nav-text
        text-align: center
        color: #ff8000
        width 100%
        font-size 16px
        margin-top :15px
    .contact-remove-btn
        background:#40AFFC
        border-radius: 5px
        font-size: 14px;
        border none
        outline none
        color #fff
        padding 8px 11px
    .contact-remove-verify
        display inline-block
        color #F2725E
        font-size 14px
        background  #FCDAD4
    .friend-dot
       position: absolute
       left: 60px
       top: 2px
       width: 8px
       height: 8px
       z-index: 2
       border-radius: 50%
       color: #ffffff
       text-align: center
       background-color: #f43531
</style>
