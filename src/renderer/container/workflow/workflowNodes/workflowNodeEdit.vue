<!--前序节点页面-->
<template>
    <div class="popupDate-picker">
        <popup style="z-index: 1024;" v-model="showPopupDate" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <zing-head :title="modelTitle" :isComeBack="false" @doSome="backClick"></zing-head>
                    <div class="scolley-div" style="overflow-y:scroll;" :data="getTempNodes">
                        <group label-width="8em" class="main-from">
                            <selector title="节点类型: " :options="templateTypeArray" v-model="getTempNodes.stepType" required placeholder="">
                            </selector>
                            <x-input title="顺序号(1~999):" :min="1" :max="999" keyboard="number" type="number" v-model="getTempNodes.serial" required placeholder=""></x-input>
                            <x-input title="节点名称: " v-model="getTempNodes.stepName" placeholder="">
                            </x-input>
                            <x-textarea title="节点描述: " v-model="getTempNodes.description" placeholder="" required>
                            </x-textarea>
                            <x-textarea title="默认执行内容: " v-model="getTempNodes.defaultContentForExecute" placeholder="" required>
                            </x-textarea>
                            <selector title="节点执行类型: " :options="context" v-model="getTempNodes.executeType" required placeholder="">
                            </selector>
                            <x-input v-show="getTempNodes.stepType=='YG'" title="节点范围-组织机构: " v-model="getTempNodes.fwForOrgName" @on-focus="onFocusOrg" placeholder="">
                            </x-input>
                            <x-input v-show="getTempNodes.stepType=='YG'" title="节点范围-角色: " v-model="getTempNodes.fwForRoleName" @on-focus="onFocusRole" placeholder="">
                            </x-input>
                            <x-input v-show="getTempNodes.stepType=='YG'" title="节点执行人: " v-model="getTempNodes.executor_name" @on-focus="onFocusUser" placeholder="">
                            </x-input>
                            <selector v-show="getTempNodes.stepType=='YG'" title="设定其他顺序号的执行人办理: " :options="templateNodeOthor" v-model="getTempNodes.linkNodeNum" required placeholder="">
                            </selector>
                            <check-icon :value.sync="getTempNodes.isDefCreator"> 是否默认发起审批流是该节点执行人为创建者</check-icon>
                        </group>
                    </div>
                    <group>
                        <flexbox :gutter="0" class="main-footer">
                            <flexbox-item>
                                <x-button class="btn-save" type="primary" @click.native="submit">提交</x-button>
                            </flexbox-item>
                            <flexbox-item>
                                <x-button @click.native="cancle" style="color: rgb(255, 255, 255);background-color: #ff8000;">取消</x-button>
                            </flexbox-item>
                        </flexbox>
                    </group>
                    <!-- 选人组件 -->
                    <org-member-picker :initialSelected="initSelectPerson"
                                       initialSelectedType="rowId"
                                       :showTab="showTab"
                                       :showPicker="showPersonPicker"
                                       @picked="onPicked"
                                       @abort="onPickAbort"></org-member-picker>
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
    import {
        XTextarea,
        CheckIcon,
        XInput,
        Group,
        XButton,
        Flexbox,
        FlexboxItem,
        Selector,
        Popup
    } from "vux";
    import ZingHead from "@/components/zingHead/ZingHead";
    import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
    import ImagePicker from "components/imagepicker/ImagePicker";
    export default {
        data() {
            return {
                screenHeight: 0, //页面高度
                initSelectPerson: [],
                showTab: [],
                showTabType: "",
                showPersonPicker: false,
                templateTypeArray: [
                    // {
                    //   key: "YG",
                    //   value: "员工"
                    // },
                    // {
                    //   key: "KH",
                    //   value: "客户"
                    // }
                ],
                context: [
                    {
                        key: "text",
                        value: "文本"
                    },
                    {
                        key: "language",
                        value: "语音"
                    }
                ]
            };
        },
        components: {
            OrgMemberPicker,
            CheckIcon,
            ImagePicker,
            ZingHead,
            XInput,
            Selector,
            Flexbox,
            FlexboxItem,
            Group,
            Popup,
            XTextarea,
            XButton
        },
        props: {
            showPopupDate: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            },
            templateNodeOthor: {
                type: Array,
                default: function() {
                    return [];
                }
            },
            modelTitle: {
                type: String,
                default: function() {
                    return "";
                }
            },
            getTempNodes: {
                type: Object,
                default: function() {
                    return {};
                }
            },
            connection: {
                // 是否显示
                type: Boolean,
                default: function() {
                    return false;
                }
            }
        },
        created() {
            let vm  = this
            vm.paramsData = vm.$route.query;
            if(vm.paramsData.templateType === 'YG'){
                vm.templateTypeArray= [
                    {
                        key: "YG",
                        value: "员工"
                    }
                ]
            } else{
                vm.templateTypeArray= [
                    {
                        key: "YG",
                        value: "员工"
                    },
                    {
                        key: "KH",
                        value: "客户"
                    }
                ]
            }
        },
        methods: {
            submit(data) {
                this.$emit("submitClick", data);
            },
            cancle(data) {
                this.$emit("cancleclick");
            },
            backClick() {
                this.$emit("backClick");
            },
            onFocusOrg(val, $event) {
                console.log("on focus", val, $event);
                this.showPersonPicker = true;
                this.showToast = false;
                this.showTab = ["org"];
                this.showTabType = "org";
            },
            onFocusRole(val, $event) {
                console.log("on focus", val, $event);
                this.showPersonPicker = true;
                this.showToast = false;
                this.showTab = ["role"];
                this.showTabType = "role";
            },
            onFocusUser(val, $event) {
                console.log("on focus", val, $event);
                this.showPersonPicker = true;
                this.showToast = false;
                this.showTab = ["colleague"];
                this.showTabType = "colleague";
            },
            onPickAbort() {
                this.showPersonPicker = false;
            },
            onPicked(list) {
                console.info(list);
                let vm = this;
                this.showPersonPicker = false;
                if (vm.showTabType === "role") {
                    console.info("role");
                    let fwForRoleId = "";
                    let fwForRoleName = "";
                    if (list !== undefined) {
                        if (list.length === 1) {
                            vm.getTempNodes.fwForRoleName = list[0].roleInfoName;
                            vm.getTempNodes.fwForRoleId = list[0].roleInfoId;
                        } else {
                            list.forEach(element => {
                                fwForRoleName += element.roleInfoName + ",";
                                fwForRoleId += element.roleInfoId + ",";
                        });
                            if(fwForRoleId.length!=0 && fwForRoleId!=undefined){
                                fwForRoleId=fwForRoleId.substring(0,fwForRoleId.length-1);
                            }
                            if(fwForRoleName.length!=0 && fwForRoleName!=undefined){
                                fwForRoleName=fwForRoleName.substring(0,fwForRoleName.length-1);
                            }
                            vm.getTempNodes.fwForRoleId = fwForRoleId;
                            vm.getTempNodes.fwForRoleName = fwForRoleName;
                        }
                        console.info(vm.getTempNodes.fwForRoleName);
                    }
                } else if (vm.showTabType === "org") {
                    console.info("org");
                    let orgTem = "";
                    let fwForOrgId="";
                    if (list !== undefined) {
                        if (list.length === 1) {
                            vm.getTempNodes.fwForOrgName = list[0].text;
                            vm.getTempNodes.fwForOrgId = list[0].id;
                        } else {
                            list.forEach(element => {
                                orgTem += element.text + ",";
                                fwForOrgId += element.id + ",";
                        });
                            if(orgTem.length!=0 && orgTem!=undefined){
                                orgTem=orgTem.substring(0,orgTem.length-1);
                            }
                            if(fwForOrgId.length!=0 && fwForOrgId!=undefined){
                                fwForOrgId=fwForOrgId.substring(0,fwForOrgId.length-1);
                            }
                            vm.getTempNodes.fwForOrgId = fwForOrgId;
                            vm.getTempNodes.fwForOrgName = orgTem;
                        }
                        console.info(vm.getTempNodes.fwForOrgName);
                    }
                } else {
                    let userName = "";
                    let userId = "";
                    if (list !== undefined) {
                        if (list.length === 1) {
                            vm.getTempNodes.executor = list[0].userName;
                            vm.getTempNodes.cardUrl = list[0].id;
                            vm.getTempNodes.executor_name = list[0].userName;
                        } else {
                            list.forEach(element => {
                                userName += element.userName + ",";
                                userId += element.id + ",";
                        });
                            if(userName.length!=0 && userName!=undefined){
                                userName=userName.substring(0,userName.length-1);
                            }
                            if(userId.length!=0 && userId!=undefined){
                                userId=userId.substring(0,userId.length-1);
                            }
                            vm.getTempNodes.executor = userName;
                            vm.getTempNodes.cardUrl = userId;
                            vm.getTempNodes.executor_name = userName;
                        }
                    }
                    console.info(vm.getTempNodes.getTempNodes);
                }
            }
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
        height: 460px;
    }
    .vux-check-icon {
    /deep/ .weui-icon-circle {
        font-size: 18px;
    }
    }
    .main-footer {
        padding: 15px;
    }
    .label-style {
        padding-top: 15px;
        padding-bottom: 15px;
    }
    .list-wrapper {
        overflow: inherit;
    }
</style>

