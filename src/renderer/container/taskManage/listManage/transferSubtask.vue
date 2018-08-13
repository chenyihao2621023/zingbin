<!--可转接子任务列表-->
<template>
    <div v-transfer-dom>
        <popup v-model="showTransferSubtask" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="typeWrap">
                <zing-head :isShowQuery="false" title="可转交子任务" :isComeBack="false" @doSome="backAddManage">
                </zing-head>
                <div class="content">

                    <!--<div class="variable" v-for="(common,index) in commonList" :key="index">-->
                        <checklist ref="checklist" :label-position="labelPosition" :options="commonList" v-model="checklist001" @on-change="change"></checklist>
                        <!--<input type="checkbox" name = "select" :value="index">-->
                    <!--</div>-->

                    <div class="bottom">
                        <div>
                            <x-button class="subject-picker-button" type="primary" @click.native="selectedSubtask">选择</x-button>
                        </div>
                    </div>
                </div>
            </div>
        </popup>
    </div>
</template>
<script>
    import {
        Checklist,
        XButton,
        Popup,
    } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    import _ from "lodash"
    export default{
        components: {
            ZingHead,Checklist,XButton,Popup
        },
        props: {
            showTransferSubtask: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            //fu
            taskboardId:{ type: String },
            taskRouting:{ type: String },
            currentListId:{ type: String },
        },
        data() {
            return {
                labelPosition: "right",
                commonList: [],
                fullValues:[],
                checklist001:[] //选中
            }
        },
        watch: {
            showTransferSubtask(isShown) {
                if (isShown){
                    this._getloadLists()

                }
            }
        },
        methods: {
          //input checkbox 获取选中的方法
//            selectLable() {
//                //查找选中的元素
//                let obj = document.getElementsByName("select");
//                let check_val = [];
//                for (let k in obj) {
//                    if (obj[k].checked) {
//                        check_val.push(parseInt(obj[k].value));
//                    }
//                }
//                return check_val
//            },



            //_getloadLists请求
            _getloadLists() {
                let url = "/ZingMH/ZDesk/list/mater/loadUnfinishedLists.action"
                let params = {
                    boardId:this.taskboardId,
                    routing:this.taskRouting,
                }
                this.$http.get( url,{ params:params })
                    .then(res => {
                        let subtask = res.data.data
                        for (let j in subtask) {
                            if( subtask[j].listId !== this.currentListId){
                                this.commonList.push( { key:j + 1,value:subtask[j].title } )
                            }

                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })


//                let url = "/ZingMH/ZDesk/list/mater/loadLists.action"
//                let params = {
//                    boardId:this.taskboardId,
//                    routing:this.taskRouting,
//                    status:'start'
//                }
//                this.$http.get( url,{ params:params })
//                    .then(res => {
//                      let subtask = res.data.data
//                      this.commonList = []
//                      for (let j in subtask) {
//                          this.commonList.push( { key:j + 1,value:subtask[j].title } )
//                      }
//                    })
//                    .catch(err => {
//                        console.log(err)
//                    })
            },
            selectedSubtask() {
                this.fullValues = this.$refs.checklist.getFullValue()
//                this.fullValues = this.selectLable()

//                console.log("this.fullValues",this.fullValues)

                this.$emit("selectedSubtask",this.fullValues);
            },
            backAddManage() {
                this.$emit("abort")
            },
        }
    }


</script>

<style lang="stylus" rel="stylesheet/stylus">
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .typeWrap
        height 100%
        .content
            display flex
            flex-flow row wrap
            width 100%
            background-color white
            height calc(100% -50px) !important
            .variable
                width 100%
                height: calc(100% -50px);
                align-self flex-start
                overflow: auto;
        .bottom
            width 100%
            height 50px
            align-self flex-end
</style>
