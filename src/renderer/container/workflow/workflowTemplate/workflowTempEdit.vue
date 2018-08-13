<template>
    <div class="popupDate-picker" style='z-index:1024'>
        <popup v-model="showPopupDate" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <zing-head :title="modelTitle" :isComeBack="false" @doSome="backClick"></zing-head>
                    <div class="scolley-div" style="overflow-y:scroll;" :data="dataTemplate">
                        <group label-width="8em" class="main-from" label-align="left">
                            <selector title="模板类型: " :options="templateTypeArray"
                                      v-model="dataTemplate.templateType" required placeholder="" @on-change="selectItem">
                            </selector>
                            <group>
                                <x-input title="技能组类型: " v-model="dataTemplate.skillType"
                                         @click.native="onFocus1" :disabled="readOnly" placeholder="选择技能组">
                                </x-input>
                            </group>
                            <x-input title="审批流模板名称: " v-model="dataTemplate.templateName" placeholder="" required>
                            </x-input>
                            <x-textarea title="审批流模板描述: " v-model="dataTemplate.templateDesc" placeholder="" required>
                            </x-textarea>
                            <x-input title="顺序号(1~999):" :min="1" :max="999" keyboard="number" type="number"
                                     v-model="dataTemplate.serialNumberForTemplate" required placeholder="请输入数字"></x-input>
                            <x-input title="凭证类型名称:" @click.native="onFocus" v-model="dataTemplate.temTypeModelName" placeholder="" v-show="ismoduleType"></x-input>
                            <!-- <cell title="设置模板图标" class="taskIcon" v-model="taskIcon">
                                <i :class="['iconfont', `icon-${taskIcon}`, taskIconBgColor]" @click="selectIocn()"
                                :style="{ 'background-color': taskIconBgColor}"></i>
                            </cell> -->
                            <cell title="设置模板图标" class="taskIcon" v-model="dataTemplate.taskIcon">
                                <i :class="['iconfont', `icon-${dataTemplate.taskIcon}`, taskIconBgColor]" @click="selectIocn()"
                                   :style="{ 'background-color': taskIconBgColor}"></i>
                            </cell>
                            <iconPicker :icon-picker-show="dialogIcon"
                                        :iconData="iconData"
                                        :bg-color="bgColor" :mask-z-index="8000"
                                        :dialog-z-index="10000" @cancel="iconPickerCancel
                    " @close="iconPickerClose" @confirm="iconPickerConfirm" />

                            <check-icon :value.sync="dataTemplate.isLinkTask" style="padding-bottom: 15px;"> 需要关联任务</check-icon>
                        </group>
                        <group>
                            <flexbox :gutter="0" class="main-footer">
                                <flexbox-item>
                                    <x-button class="btn-save" type="primary" @click.native="submit">提交</x-button>
                                </flexbox-item>
                                <flexbox-item>
                                    <x-button @click.native="cancle"  style="color: rgb(255, 255, 255);background-color: #ff8000;">取消</x-button>
                                </flexbox-item>
                            </flexbox>
                        </group>
                    </div>
                </div>

            </div>
        </popup>
        <workflow-Certificate :showPopupDate="certifShow"
                              :certificateTitle="certifiTitle"
                              :commonList="certifiData"
                              :checkItem="checkCurType"
                              @backClick="clickBack1"
                              @submitClick="submitCertif"
                              @cancleClick="cancleCertif"
                              @change="SelectClick"></workflow-Certificate>
    </div>

</template>

<script>
    import {
        Group,
        XButton,
        Flexbox,
        CheckIcon,
        FlexboxItem,
        XInput,
        Cell,
        Selector,
        XTextarea,
        Popup
    } from "vux";
    import workflowCertificate from "@/container/workflow/workflowTemplate/workflowCertificate";
    import ZingHead from "@/components/zingHead/ZingHead";
    import GridCard from "@/components/gridcard/GridCard";
    import IconPicker from "components/iconpicker/IconPicker";
    export default {
        components: {
            XTextarea,
            Popup,
            GridCard,
            CheckIcon,
            Cell,
            workflowCertificate,
            ZingHead,
            XInput,
            IconPicker,
            Selector,
            Flexbox,
            FlexboxItem,
            Group,
            XButton
        },
        data() {
            return {
                dialogIcon: false,
                bgColor: "",
                ismoduleType: false,
                certifShow: false,
                certifiData:[],
                taskIcon: "tianjia1",
                readOnly:false,
                certifiTitle:'',
                taskIconBgColor: "",
                screenHeight: 0, //页面高度
                certifChooseData:[],
                templateTypeArray:[],
                headImgSrc: [], // 图片文件
                jnzData:[],
                checkCurType:[],
                iconData:[
                    'benbanzushengchandingdanguanli',
                    'canting',
                    'jiudian',
                    'shangpu',
                    'caigou-tianchong',
                    'xiaoshougendanguanli',
                    'salesinvoice',
                    'shenpi1',
                    'tuihuo',
                    '02',
                    'shichang',
                    'renzhengziliao',
                    'baocun-tianchong',
                    'baobiao-selected',
                    'renwu',
                    'xiaolaba',
                    'caiwu',
                    'fabubiaoshu',
                    'cardb',
                    'weibiaoti4'
                ],
            };
        },
        props: {
            showPopupDate: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            modelTitle: {
                type: String,
                default: function() {
                    return "";
                }
            },
            // taskIcon:{
            //    type: String,
            //   default: function() {
            //     return "tianjia1";
            //   }
            // },
            dataTemplate: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            templateTypeModel: {
                type: Array,
                default: function() {
                    return [];
                }
            }
        },
        watch: {
            dataTemplate(){
                let vm = this;
                if(vm.dataTemplate.taskIcon!=undefined || vm.dataTemplate.taskIcon!=""){
                if(vm.iconData.indexOf(vm.dataTemplate.taskIcon)==-1){
                    vm.dataTemplate.taskIcon = 'tianjia1';
                }
            }
            }
        },
        created() {
            let vm = this
            // vm.dataTemplate.taskIcon = 'tianjia1'
            vm.paramsData = vm.$route.query;
            vm.certifChooseData = []
            if(vm.paramsData.moduleType ==='MODULE_TYPE_ZYK'){
                vm.ismoduleType = true
            } else{
                vm.ismoduleType = false;
            }
            console.info(vm.paramsData.moduleType)
            if (vm.paramsData.moduleType === "typeForPuTongShenPi" || vm.paramsData.moduleType === "") {
                console.info('dddddddddd')
                vm.templateTypeArray = [{
                    key: "YG",
                    value: "员工"
                },{
                    key: "KH",
                    value: "客户"
                }]
                vm.getJNZData();
            } else {
                vm.templateTypeArray = [{
                    key: "YG",
                    value: "员工"
                }]
            }
        },
        methods: {
            submit() {
                this.$emit("submitClick");
            },
            selectItem(val){
                // this.$emit('selectChange',val)
                let vm = this
                vm.type = val
                if (vm.type ==="YG") {
                    vm.readOnly = true;
                }else {
                    vm.readOnly = false;
                }
            },
            cancle() {
                this.$emit("cancleClick");
            },
            SelectClick(value, label) {
                let vm = this;
                vm.certifChooseData = value;
            },
            submitCertif() {
                let vm = this;
                let temp = "";
                let certifChoosetemps = "";
                let Temp = "";
                let tempType=""
                if(vm.paramsData.moduleType === "MODULE_TYPE_ZYK"){
                    let titleStr = "";
//                    if(vm.type ==="YG"){
                        if (vm.certifChooseData.length === 1) {
                            Temp = vm.certifChooseData +'';
                            vm.templateTypeModel.forEach(item => {
                                if(item.key == vm.certifChooseData[0]){
                                    titleStr = item.value;
                                }
                            })
                        } else {
                            vm.certifChooseData.forEach(function(item) {
                                temp += item + ",";
                                Temp = temp;
                                vm.templateTypeModel.forEach(vt => {

                                    if(vt.key == item){
                                        titleStr += vt.value+",";
                                    }
                                })
                            });

                            if(titleStr!=undefined && titleStr != ""){
                                titleStr = titleStr.substring(0,titleStr.length-1);
                            }
                            if(Temp!=undefined && Temp != ""){
                                Temp = Temp.substring(0,Temp.length-1);
                            }
                        }
//                    }
                    vm.dataTemplate.temTypeModelName = titleStr;
                    vm.dataTemplate.temTypeModel = Temp
                } else {
                    if (vm.certifChooseData.length === 1) {
                        tempType = vm.certifChooseData + '';
                    } else {
                        vm.certifChooseData.forEach(function(item) {
                            temp += item + ",";
                            tempType = temp;
                        });
                        if(Temp!=undefined && Temp != ""){
                            Temp = Temp.substring(0,Temp.length-1);
                        }
                    }
                    vm.dataTemplate.skillType= tempType
                }
                vm.certifShow = false;
            },
            cancleCertif() {
                this.certifShow = false;
            },
            // input 事件 技能组类型
            onFocus1(val, $event) {
                let vm = this
                if( vm.paramsData.moduleType === "MODULE_TYPE_ZYK"){
                    vm.certifShow = false
                } else {
                    if (vm.type ==="YG") {
                        vm.certifShow = false;
                    }else {
                        vm.certifShow = true;
                    }
                }
                vm.certifiTitle = "技能组类型选择";
                vm.certifiData = vm.jnzData;
            },
            getJNZData(){
                let self = this;
                let sendUrl = "/zingbiz/skillGroupInfo/skillGroupInfoRest/getAllSkType";
                let params = {};
                self.$http.post(sendUrl,params).then(res => {
                    try{
                        if(res.data.success){
                            let retData = res.data.data;
                            retData.forEach(item => {
                                if(self.jnzData.indexOf(item.skType)===-1){
                                    self.jnzData.push(item.skType);
                                }
                            });
                        }
                    } catch(e){

                    }
                });
            },
            selectIocn() {
                this.dialogIcon = true;
            },
            iconPickerConfirm(data) {
                this.dialogIcon = false;
                this.dataTemplate.taskIcon = data;
                this.taskIconBgColor = "wp";
            },
            iconPickerClose() {
                this.dialogIcon = false;
            },
            iconPickerCancel() {
                this.dialogIcon = false;
            },
            // input 事件 凭证类型
            onFocus() {
                let vm = this;
                vm.certifiTitle = "凭证类型选择";
                vm.certifiData = vm.templateTypeModel;
                let templateTypeModelTemp = vm.dataTemplate.temTypeModel;
                if(templateTypeModelTemp!=undefined && templateTypeModelTemp!=""){
                    vm.checkCurType = templateTypeModelTemp.split(",");
                }else{
                    vm.checkCurType = [];
                }
                vm.certifShow = true;

            },
            backClick(){
                this.$emit('backClick')
            },
            clickBack1() {
                this.certifShow = false
            },
        }
    };
</script>
<style lang= 'less' scoped>
    .weui-cell {
    /deep/ label {
        font-size: 16px;
    }
    }
    .main-from {
        height: 450px;
        padding: 15px;
    }
    .main-footer {
        padding: 15px;
    }
    .label-style {
        padding-top: 15px;
        padding-left: 15px;
    }
    .vux-check-icon {
    /deep/ .weui-icon-circle {
        font-size: 18px;
    }
    }
    .vux-check-icon {
        float: left;
        padding-left: 5px;
    }
    .weui-icon-circle {
        font-size: 14px;
    }
    .vux-check-icon > span {
        font-size: 96%;
    }
    .taskIcon {
        text-align: center;
    .iconfont{
        font-size: 35px;
    }
    }
</style>
