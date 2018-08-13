<!--标签-->
<template>
    <div v-transfer-dom>
        <div class="popupWrap">
            <popup v-model="showChoseLable" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
                <div class="lableWrap">
                    <zing-head :isShowQuery="false" title="标签" :isComeBack="false" @doSome="backAddManage">
                        <div slot = "header-right" @click="addLable">
                            <span style="font-size: 16px;margin-right: 30px">添加</span>
                        </div>
                    </zing-head>
                    <div class="lableContent-scroll">
                        <!--<div class="warning" v-show="flag">-->
                        <div class="warning" v-if="tagCells.length<0">
                            {{nodata}}
                        </div>
                        <div class="lableVariable" v-if="tagCells.length>0">
                            {{tagCells.length}}
                            <div class="lableContentWrap" v-for="(tag,index) in tagCells" :key="index">
                                <div class="lableIcon"><input type="checkbox" name = "select" :value="index"></div>
                                <div class="lableMine" :style="'background-color:' + tag.tagIndex">{{tag.content}}</div>
                                <span class="lableEdit" @click="showLabelConfirm(index)">编辑</span>
                            </div>
                        </div>
                        <div class="lableBottom">
                            <div>
                                <x-button class="subject-picker-button" type="primary" @click.native="selectLable">选择</x-button>
                            </div>
                        </div>
                    </div>
                </div>
            </popup>
        </div>

        <!--标签弹出框-->
        <div class="aa" v-transfer-dom>
            <confirm v-model="showLabel"
                     ref="confirm5"
                     title="标签管理"
                     @on-cancel="onCancel"
                     @on-confirm="onConfirm"
                     @on-hide="onHide">
                <slot>
                    <div class="box">
                        <input v-model="tagManagerName" type="text">
                        <checker v-model="demo3" default-item-class="demo3-item" selected-item-class="demo3-item-selected"
                                 @on-change="tagChange">
                            <checker-item value="1">
                                <span class="color color1"></span>
                            </checker-item>
                            <checker-item value="2">
                                <span class="color color2"></span>
                            </checker-item>
                            <checker-item value="3">
                                <span class="color color3"></span>
                            </checker-item>
                            <checker-item value="4">
                                <span class="color color4"></span>
                            </checker-item>
                            <checker-item value="5">
                                <span class="color color5"></span>
                            </checker-item>
                            <checker-item value="6">
                                <span class="color color6"></span>
                            </checker-item>
                        </checker>
                    </div>
                </slot>
            </confirm>
        </div>
    </div>
</template>
<script>
    import {
        XButton,
        Popup,
        Selector,
        Confirm,Checker,
        CheckerItem,
    } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    import _ from "lodash"
    export default{
        components: {
            ZingHead,XButton,
            Popup,Selector,
            Confirm,Checker,
            CheckerItem
        },
        props: {
            showChoseLable: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            cardId:{
              type:String
            },
            routing:{
                type:String
            },
            tagCells:{
              type:Array
            },
            updatetags:{
                type:Function
            }
        },
        data() {
            return {
                labelPosition: "right",
                chosetag:false,//是否勾选
                showLabel:false,//标签
                demo3:'',//标签选择
                tagManagerName:'',//标签内容
                // tagCells:[],//标签数组
                nodata:'暂无标签，请添加',
                flag:false,
                isEditObj:{ isEdit:false,index:0 } //判断是否编辑
            }
        },
        watch: {
            showChoseLable(isShown) {
                if (isShown) {

                }
            },
        },
        methods: {
            onCancel() {
                //清空
                this.demo3 = ''
                this.tagManagerName = ''
                //清空编辑状态
                this.isEditObj.isEdit = false
                this.isEditObj.index = 0
            },
            onConfirm() {
                const map = {
                    '1':'rgba(23,194,149,1)',
                    '2':'rgba(77,169,235,1)',
                    '3':'rgba(247,181,94,1)',
                    '4':'rgba(242,114,94,1)',
                    '5':'rgba(209,137,226,1)',
                    '6':'rgba(0,204,204,1)',
                }
                if (this.demo3 && this.tagManagerName.trim()) {
                    let newtag = {}
                    newtag.tagIndex = map[this.demo3]
                    newtag.colorIndex = this.demo3
                    newtag.content = this.tagManagerName
                  if (this.isEditObj.isEdit) {
                        this.tagCells[this.isEditObj.index] = newtag
                    } else {
                        this.tagCells.push(newtag)
                    }
                }
                //清空
                this.demo3 = ''
                this.tagManagerName = ''
                //清空编辑状态
                this.isEditObj.isEdit = false
                this.isEditObj.index = 0
            },
//            delTag() {
//
//            },
            tagChange() {

            },
            //编辑
            showLabelConfirm(index) {
                this.showLabel = true
                this.demo3 = this.tagCells[index].colorIndex
                this.tagManagerName = this.tagCells[index].content
                this.isEditObj.isEdit = true
                this.isEditObj.index = index
            },
            selectLable() {
                this.showChoseLable = false
                let arr = this.tagCells

                //查找选中的元素
                let obj = document.getElementsByName("select");
                let check_val = [];
                for (let k in obj) {
                    if (obj[k].checked) {
                        check_val.push(parseInt(obj[k].value));
                    }
                }
                let tagManagerName = ''
                let tagIndex = ''
                for (let i=0 ; i<arr.length ; i++) {
                  //判断是否选中
                  if (check_val.indexOf(i) !== -1) {

                      if (i === arr.length - 1) {
                          tagIndex += arr[i].colorIndex
                          tagManagerName += arr[i].content
                      } else {
                          tagIndex += arr[i].colorIndex + '_'
                          tagManagerName += arr[i].content + ' '
                      }
                  }
                }
                let url = 'ZingMH/ZDesk/card/mater/updateCard.action'
                let Params = {
                    tags:tagManagerName + '&index&' + tagIndex,
                    cardId: this.cardId,
                    routing: this.routing,
                }
                this.$http.get(url,{ params:Params })
                    .then(res => {
                      this.updatetags(true)
                      this.showChoseLable = false
                    })
                    .catch(err => {
                        console.log(err)
                    });
            },
            addLable(){
                this.showLabel = true
            },
            backAddManage() {
                this.$emit("abort")
            },
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../../../assets/stylus/variable.styl';
    @import '../../../../assets/stylus/mixin.styl';
    .aa
        width 100%
        .box
            .weui-dialog input
               margin 0
            input
                width 100%
                height 30px
                border 1px solid gray
                border-radius 3px
            .demo3-item
                height 50px
                width 30%
                padding: 5px 5px
                font-size: 0
                .color
                    background-color red
                    display inline-block
                    width 100%
                    height 100%
                .color1
                    background-color rgba(23,194,149,1)
                .color2
                    background-color rgba(77,169,235,1)
                .color3
                    background-color rgba(247,181,94,1)
                .color4
                    background-color rgba(242,114,94,1)
                .color5
                    background-color rgba(209,137,226,1)
                .color6
                    background-color rgba(0,204,204,1)
            .demo3-item-selected
                outline: 1px solid #8B8AEE
    .popupWrap
        .lableWrap
            height 100%
            .lableContent-scroll
                display flex
                flex-flow row wrap
                width 100%
                background-color white
                height calc(100% -50px) !important
                .lableVariable
                    width 100%
                    height calc(100% -50px);
                    align-self flex-start
                    overflow auto
                    .lableContentWrap
                        height 40px
                        line-height 40px
                        display flex
                        .lableIcon
                            width 20px
                            margin-left 5px
                        .lableMine
                            display inline-block
                            width 248px !important
                            margin 10px 20px 0 25px
                            height 26px
                            line-height 26px
                            text-align center
                            color white
                        .lableEdit
                            width 50px !important
                            display inline-block
                            background-color #ff8800
                            height 30px
                            line-height 30px
                            text-align center
                            color white
                            border-radius 5px
                            margin 7.5px 13px 0 0
            .lableBottom
                width 100%
                height 50px
                align-self flex-end
</style>
