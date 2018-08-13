<template>
    <div id="fuJianHuiQian">
        <div id="wfContent" style="height: 180px;overflow-y: scroll;">
            <!-- 执行人 -->
            <group-title>执行人</group-title>
            <grid :show-vertical-dividers="showVerticalDividers"
                  :cols="cols"
            >
                <grid-item v-for="(oneData,index) in zxrData" :key="index">
                    <span class="grid-center">
                        <img v-if="oneData.headImg!='' && oneData.headImg!=undefined" :src="oneData.headImg" style="width:30px;height:30px;"/>
                        <span v-else style="width:30px;height:30px;border-radius: 3px;display: block;cursor: pointer;text-align: center;font-size: 15px;">{{oneData.user_name}}</span>
                    </span>
                </grid-item>

            </grid>

            <!-- 参与人 -->
            <group-title>参与人</group-title>
            <grid :show-vertical-dividers="showVerticalDividers"
                  :cols="cols"
            >
                <grid-item v-for="(oneData,index) in cyrData" :key="index">
                    <img v-if="oneData.headImg!='' && oneData.headImg!=undefined" :src="oneData.headImg" style="width:30px;height:30px;"/>
                        <span v-else style="width:30px;height:30px;border-radius: 3px;display: block;cursor: pointer;text-align: center;font-size: 15px;">{{oneData.user_name}}</span>
                </grid-item>
                <grid-item v-if="workflowData.check_invite=='是'">
                    <span @click="selectInputPerson" class="grid-center"><i class="iconfont icon-icontjzp" style="font-size: 30px;"></i></span>
                </grid-item>

            </grid>
            <!-- 消息免打扰 -->
            <div>
                <group>
                    <x-switch title="消息免打扰"
                              :value-map="['0', '1']"
                              v-model="isNotAlert"
                              @on-change="chengeMDR"
                    ></x-switch>
                </group>
            </div>
        </div>
        <div style="border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>

        <!-- 任务 -->
        <div>

            <taskDetail
                :loadingSelf = "true"
                :showTaskDetail="false"
                :transCardId="workflowData.workflow_id"
                :transRouting= "workflowData.companyId"
                @taskDetailChang="taskDetailChang"
                :showTaskDetailHead="false"
                :clickEmojiOrClickMore="true"
                :style="taskContentHeight"
            >
            </taskDetail>
        </div>

        <!-- 选人组件 -->
        <org-member-picker :initialSelected="initSelectPerson"
                           :showTab="showTab"
                           :initialSelectedType="'cardUrl'"
                           :showPicker="showPersonPicker"
                           :multiple="multipleForSelPerson"
                           @picked="onPicked"
                           @abort="onPickAbort"></org-member-picker>

    </div>
</template>

<script>
    import taskDetail from "@/container/taskManage/taskDetail";
    import OrgMemberPicker from 'components/orgmemberpicker/OrgMemberPicker';
    import {
        Grid, GridItem, GroupTitle,XSwitch

    } from 'vux'
    export default {
        name:"fuJianHuiQian",
        components: {
            Grid, GridItem, GroupTitle,XSwitch,taskDetail,OrgMemberPicker
        },
        data() {
            return {
                cols:8,
                showVerticalDividers:false,
                isNotAlert:"",
                initSelectPerson:[],
                showPersonPicker: false,
                multipleForSelPerson:true,
                showTab:["colleague"],
                taskContentHeight:{
                    height:"0px"
                }
            };
        },
        //钩子加载完触发
        created: function () {
            let self = this;
            //获取当前窗口高度
            let a = document.body.clientHeight;
            self.taskContentHeight = {
                height:(a-285)+"px"
            };
            if(self.isSetMDR()){
                self.isNotAlert = "1";
            }

            if(this.zxrData!=undefined && this.zxrData.length!=0){
                let temp = [];
                let zxrDataTemp = [];
                this.zxrData.forEach(item => {
                    if(temp.indexOf(item.cardUrl)==-1){
                        temp.push(item.cardUrl);
                        zxrDataTemp.push(item);
                    }
                })
                this.zxrData = zxrDataTemp;
            }

            if(this.cyrData!=undefined && this.cyrData.length!=0){
                let temp = [];
                let cyrDataTemp = [];
                this.cyrData.forEach(item => {
                    if(temp.indexOf(item.cardUrl)==-1){
                        temp.push(item.cardUrl);
                        cyrDataTemp.push(item);
                    }
                })
                this.cyrData = cyrDataTemp;

            }
        },
        props: {
            initData:{
                type: Object,
                default:function(){
                    return {};
                }
            },
            workflowData:{
                type: Object,
                default:function(){
                    return {};
                }
            },
            zxrData:{
                type: Array,
                default:function(){
                    return [];
                }
            },
            cyrData:{
                type: Array,
                default:function(){
                    return [];
                }
            },
            bType:{
                type: String,
                default:function(){
                    return "";
                }
            },
            curUserCardUrl:{
                type: String,
                default:function(){
                    return "";
                }
            }
        },
        methods: {
            //查看当前人是否设置了免打扰
            isSetMDR(){
                let self = this;
                let isGet = false;
                let ret = false;
                if(self.zxrData!=undefined){
                    self.zxrData.forEach(item => {
                        if(item.cardUrl==self.curUserCardUrl){
                        isGet = true;
                        let isNotAlert = item.isNotAlert;
                        if(isNotAlert=="1"){
                            ret = true;
                        }
                    }
                })
                }

                if(self.cyrData!=undefined){
                    self.cyrData.forEach(item => {
                        if(item.cardUrl==self.curUserCardUrl){
                        isGet = true;
                        let isNotAlert = item.isNotAlert;
                        if(isNotAlert=="1"){
                            ret = true;
                        }
                    }
                })
                }
                return ret;
            },
            //处理免打扰
            chengeMDR(){
                let self =this;
                //设置免打扰
                if(self.isNotAlert === "1"){
                    self.setMDR("1");
                }else{
                    self.setMDR("0");
                }
            },
            //处理当前人的免打扰
            setMDR(isNotAlert){
                let self=this;
                let url = "/zingbiz/workflow/helper/setMDR.action";
                let pat = {};
                pat.workflowId = self.workflowData.workflow_id;
                pat.companyId = self.workflowData.companyId;
                pat.isNotAlert = isNotAlert;
                pat.tarId = self.bType+self.workflowData.workflow_id;

                self.$http.post(url,pat).then(res => {
                    try{
                        if(res.data.success){
                    self.$vux.toast.text(res.data.mgs,'top');
                }else{
                    self.$vux.toast.text(res.data.mgs,'top');
                }

            } catch(e){

                }
            });
            },
            taskDetailChang(type,data){
                let self = this;
                if(type===1){
                    //上传了图片
                    self.sendMsgForHDXX("在附件会签中上传了图片。");
                }else if(type===2){
                    //上传了附件
                    self.sendMsgForHDXX("在附件会签中上传了附件。");
                }else if(type===3){
                    //添加了评论
                    self.sendMsgForHDXX("在附件会签中发表评论："+data.commentVal);
                }

            },
            sendMsgForHDXX(msg){
                let self = this;
                let sendUrl = "/zingbiz/workflow/helper/sendComment";
                let params = {};
                params.wfid = self.workflowData.workflow_id;
                params.companyId = self.workflowData.companyId;
                params.msg = msg;
                self.$http.post(sendUrl,params).then(res => {
                    try{

                    } catch(e){

                    }
                });
            },
            selectInputPerson() {
                let self = this;
                self.initSelectPerson = [];
                self.cyrData.forEach(item => {
                    self.initSelectPerson.push({
                        key: item.executor,
                        value: item.cardUrl,
                        level: "default",
                    });
                })

                self.showPersonPicker = true;
            },
            onPickAbort() {
                this.showPersonPicker = false
            },
            onPicked(list) {
                this.showPersonPicker = false;
                let selTemp = list.map(item => {
                    let map = {}
                    map.text = item.userName
                map.id = item.cardUrl
                return map;
            });
                if (selTemp !== undefined && selTemp.length >= 1) {
                    this.submitYaoQing(selTemp);
                }

            },
            /**
             * 邀请参与人
             */
            submitYaoQing(uData){
                let self =this;
                var url = "/zingbiz/workflow/helper/handleYaoQing.action";
                var pat = {};
                pat.workflow_id=self.workflowData.workflow_id;
                pat.companyId=self.workflowData.companyId;
                pat.yaoQingRenData = JSON.stringify(uData);
                self.$http.post(url,pat).then(res => {
                    try{
                        if(res.data && res.data.success){
                            self.$emit("reLoad");
                            self.$vux.toast.text(res.data.mgs,'top');
                        }else{
                            self.$vux.toast.text(res.data.mgs,'top');
                        }
                    } catch(e){

                    }
                });

            }
        }
    };
</script>

<style lang="stylus" scoped>

    .weui-grid:after{
        border-bottom: 0px !important;
    }
    .weui-grid{
        padding: 5px 10px;
    }
    .weui-grids{
        height: 35px !important;
    }

</style>
