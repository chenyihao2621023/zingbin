<!--写拜访记录-->
<template>
    <div class="outwrapper">
        <ZingHead title="拜访记录"></ZingHead>
        <div class="scroll-list-wrap" style="overflow-y:scroll; height:100%">
            <div :date="visitRecord" class="visitRecord" >
                <group label-width="6em" label-margin-right="2em">
                    <x-input title="拜访对象" v-model="visitRecord.contactsName" class="name" readonly></x-input>
                    <selector title="拜访方式 " placeholder="请选择拜访方式" :options="visitWayArray" class="visitMethod" :readonly="isReadonly" v-model="visitRecord.visitMethod">
                    </selector>
                    <x-input title="主要事宜" v-model="visitRecord.mainThing" :readonly="isReadonly" placeholder="请输入主要事宜" class="mainThing"></x-input>
                    <x-input title="拜访结果" v-model="visitRecord.visitResult" :readonly="isReadonly" placeholder="请输入拜访结果" class="visitResult"></x-input>
                    <x-textarea title="备注" v-model="visitRecord.remarks" :readonly="isReadonly" placeholder="请输入备注" class="remarks" :show-counter="false" :rows="1" autosize></x-textarea>
                </group>
                <group>
                    <cell title="图片" class="taskIcon">
                    </cell>
                    <img v-for="(item,index) in imgSrc" :src="item" :key="index" class="imgSrc" v-show="imgSrcFlag">
                    <image-picker class="imagePick"
                                  :files="files"
                                  :companyId="companyId"
                                  :bId = "bId"
                                  :bType = "bType"
                                  selectable
                                  multiple
                                  @onChange="imgOkCallback"
                                  v-show="imgFlag"

                    />
                    <cell title="附件">
                        <div class="label-edit">
                             <i class="iconfont icon-fujian" @click="selectaccessory()"></i>
                        </div>
                    </cell>
                    <div class="label-visit" v-for="(item,index) in fileArr" :key="index" @click="onView(item)">
                        <div class="lable-enclos">
                            <div class="lable-img">
                                <i data-v-6f05b1b0="" class="iconfont icon-folder"></i>
                                <i :class="[iconClass,item.iconClass]"></i>
                            </div>
                            <div class="visit-enclosure">
                                <div>
                                    {{item.fileName}}
                                </div>
                                <div>
                                    {{item.generterTime}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <cell title="所在位置">
                        <div>
                            <div class="left" @click="localtion()">
                                {{visitRecord.addrName}}
                            </div>
                            <div class="right">
                                <span v-show="PositionInit" @click="localtion()">点击获取位置信息</span>
                            </div>
                        </div>
                    </cell>
                    <cell title="发给谁">
                        <div>
                            <div class="left" @click="selectPeople()">
                                {{visitRecord.sendToPeoName}}
                            </div>
                            <div class="right">
                                <i class="iconfont icon-tianjia1" v-show="SendPeopleInit" @click="selectPeople()"></i>
                            </div>
                        </div>
                    </cell>
                </group>
            </div>
            <flexbox :gutter="0" class="main-footer" v-show="editVisitReord">
                <flexbox-item>
                    <x-button style="background-color: rgba(255, 128, 0, 1);" type="primary" @click.native="submit">提交</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <div>
            <x-dialog mask-z-index="5000" v-model="showDocx"
                      :dialog-style="{'max-width': '95%', width: '95%', height: '95%'}">
                <zing-head :isComeBack="false" :cancelText="titleDocx" @doSome="onDoSome">
                </zing-head>
                <div class="iframe_form_data">
                    <div class="iframe_box">
                        <iframe :src="docxSrc" id="iframepage" frameborder="0"
                                name="iframepage"
                               >
                        </iframe>
                    </div>
                </div>
            </x-dialog>
        </div>
        <img v-show="false" class="previewer-demo-img" v-for="(item,index) in imagePreviewList" :key="index" :src="item.src"
             width="100" @click="show()">
        <previewer :list="imagePreviewList" ref="previewer" :options="previewerOptions"></previewer>
        <!-- 选人组件 -->
        <org-member-picker :initialSelected="initialSelected" :showTab="['colleague']" :showPicker="showPersonPicker" :multiple="true" @picked="onPicked" @abort="onPickAbort"></org-member-picker>
    </div>
</template>
<script>
    import {
        Group,
        XInput,
        Selector,
        Cell,
        Flexbox,
        FlexboxItem,
        XButton,
        XTextarea,
        XDialog,
        Previewer
    } from "vux";
    import ImagePicker from "components/imagepicker/ImagePicker";
    import ZingHead from "@/components/zingHead/ZingHead";
    import { getQMapLocation } from "@/utils/wx";
    import { mapState } from "vuex";
    import { isWeiXin, isMhApp, Z_IsEmpty20, getThumbUrl } from "@/utils/fn";
    import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
    import Uploader from "../../utils/upload";
    import Qs from 'qs'
    const fileUploader = Uploader.create();
    export default {
        components: {
            ZingHead,
            Group,
            XTextarea,
            XButton,
            Selector,
            ImagePicker,
            XInput,
            Cell,
            Flexbox,
            FlexboxItem,
            OrgMemberPicker,
            getQMapLocation,
            XDialog,
            Previewer
        },
        data() {
            return {
                companyId:"",
                bId:"id",
                bType:"imgContent",
                src:"",
                docxSrc:"",
                titleDocx: '',
                showDocx: false,
                iconClass:"iconfont",
                visitRecord: {
                    contactsName:'',
                    addrName:'',
                    remarks:'',
                    visitResult: '',
                    mainThing: '',
                    enclosure: '',
                    sendToPeoName: ''
                },
                editVisitReord: true,
                fileArr: [],
                isReadonly: false,
                visitWayArray: [
                    {
                    key: "face",
                    value: "当面拜访"
                    },
                    {
                    key: "phone",
                    value: "电话拜访"
                    },
                    {
                    key: "chat",
                    value: "聊天软件拜访"
                    },
                    {
                    key: "other",
                    value: "其他"
                    }
                ],
                isImage: false,
                accessory: "",
                isAccess: true,
                PositionInit: true,
                SendPeopleInit: true,
                sendPeople: {
                    executor: "",
                    cardUrl: "",
                    executor_name: ""
                },
                taskIconBgColor: "",
                initialSelected: [],
                showPersonPicker: false,
                files: [],
                queryData: {},
                uploadFile: {},
                imgArr: "",
                imagePreviewList: [],
                imgFlag:true,
                imgSrcFlag:false,
                fileFlag:true,
                locationFlag:true,
                whoFlag:true,
                previewerOptions: {
                    getThumbBoundsFn(index) {
                        let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                        let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                        let rect = thumbnail.getBoundingClientRect()
                        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
                    }
                },
                imageShow:true
            };
        },
        computed: {
            ...mapState({
                wxLocationStatus: state => state.wx.wxLocationStatus,
                wxLocation: state => state.wx.wxLocation
            })
        },
        watch: {
            wxLocationStatus(st) {
                let taskPosition = ""
                switch (st) {
                    case "prepar":
                    break;
                    case "success":
                        taskPosition = this.wxLocation.addr;
                        this.visitRecord.addrName = taskPosition;
                    break;
                    case "failed":
                    break;
                }
            }
        },
        mounted() {
            this.fileUploader(this.$route.query.companyId)
        },
        created() {
            let vm = this;
            vm.queryData = vm.$route.query;
            if (vm.queryData.type === "update") {
                // vm.isReadonly = true;
                this.getVisitRecord();
            } else {
                vm.isReadonly = false;
                this.getContactData();
            }
            this.companyId = this.$route.query.companyId
        },
        methods: {
            // 获取拜访对象数据
            getContactData() {
                let vm = this;
                let url = "/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsById";
                let paramContact = {
                    contactsId: vm.queryData.externalContactsId
                };
                vm.$http.post(url, paramContact)
                    .then(result => {
                        if (result.data.success === true) {
                            vm.visitRecord = {};
                            vm.visitRecord.contactsName = result.data.data.contactsName;
                        }
                    })
            },
            //上传附件
            fileUploader(companyId) {
                let vm = this;
                let url = "/zingbiz/ExternalContacts/VisiRecordUploadFileRest/visiRecordUploadFile";
                if (!Z_IsEmpty20(companyId)) {
                    url += "?companyId=" + companyId;
                }
                fileUploader.init({
                    uploaderServer: url,
                    folderPath: "",
                    onUploadStart: function(isError, refs) {

                    },
                    onMessage: function(msg, refs) {
                        console.log(msg);
                    },
                    onServerFailed: function(msg, refs) {
                        vm.bottomToast(msg);
                    },
                    onServerSuccess: function(data, refs) {
                        vm.uploadFile = data.data;
                        let id = data.data.id;
                        if (Z_IsEmpty20(vm.visitRecord.enclosure)) {
                            vm.visitRecord.enclosure = id
                        } else {
                            vm.visitRecord.enclosure += "," + id
                        }
                        if (data.data.fileType === "file") {
                            data.data.iconClass = "icon-icon_folder"
                        } else if (data.data.fileType === "xls") {
                            data.data.iconClass = "icon-excel"
                        } else if (data.data.fileType === "doc") {
                            data.data.iconClass = "icon-word"
                        } else if (data.data.fileType === "image") {
                            data.data.iconClass = "icon-jpg"
                        } else {
                            data.data.iconClass = "icon-" + data.data.fileType
                        }
                        vm.fileArr.push(data.data)
                    }
                });
            },
            //点击附件
            selectaccessory() {
                if (this.fileFlag) {
                    fileUploader.prepareUpload.bind(this)();
                } else {
                    return
                }
            },
            //查看附件
            onView (item) {
                let _relativePath = item.relativePath.replace(/^http:\/\/[^/]+/, "");
                let params = {}
                params.src = _relativePath
                if (item.fileType === "file") {
                    this.$vux.toast.text("文件类型不支持查看")
                    return
                } else if (item.fileType === "image") {
                    this.imagePreviewList = [
                        {
                            msrc: item.relativePath,
                            src: item.relativePath,
                            w: 800,
                            h: 400
                        }
                    ];
                    this.$nextTick(() => {
                        this.$refs.previewer.show(0)
                    })

                } else {
                    this.$http.post("ZingMH/ZDesk/previewFile/getPreviewPath.action",Qs.stringify(params)).then((res) => {
                        if (res.data.success) {
                            let { url } = res.data.data;
                            this.docxSrc = url;
                            this.showDocx = true;
                        }
                    })
                }
            },
            //取消
            cancle() {
                this.$router.go(-1);
            },
            //获取拜访记录
            getVisitRecord() {
                let vm = this;
                let url = "/zingbiz/ExternalContacts/ExternalContactsVisitRecordRest/getVisitRecordById";
                let params = {
                    visitRecordId: vm.queryData.visitRecordId
                };
                vm.$http.post(url, params).then(res => {
                    console.log(res.data.data)
                    if (res.data.success === true) {
                        let visitData = res.data.data
                        vm.visitRecord = {
                            contactsName:visitData.contactsName,
                            addrName:visitData.addrName,
                            remarks: visitData.remarks,
                            visitResult: visitData.visitResult,
                            mainThing: visitData.mainThing,
                            enclosure: visitData.enclosure,
                            sendToPeoName: visitData.sendToPeoName ,
                            visitMethod: visitData.visitMethod
                        }
                        vm.fileArr = visitData.enclosureList
                        if (vm.fileArr.length !== 0) {
                            vm.fileArr.forEach((item) => {
                                if (item.fileType === "file") {
                                    // item.fileName = "文件夹或其他无法打开"
                                    item.iconClass = "icon-icon_folder"
                                } else if (item.fileType === "xls") {
                                    item.iconClass = "icon-excel"
                                } else if (item.fileType === "doc") {
                                    item.iconClass = "icon-word"
                                } else if (item.fileType === "image") {
                                    item.iconClass = "icon-jpg"
                                } else {
                                    item.iconClass = "icon-" + item.fileType
                                }
                            })
                        }
                        if (!Z_IsEmpty20(res.data.data.pictureUrl)) {
                            vm.imgSrc = res.data.data.pictureList
                            res.data.data.pictureList.forEach((val) => {
                                vm.files.push({ url:val })
                            })
                            // vm.files.push({ url:getThumbUrl(res.data.data.pictureUrl) })
                        }
                        if (!Z_IsEmpty20(res.data.data.sendToPeoName)) {
                            vm.SendPeopleInit = false;
                        }
                        if (!Z_IsEmpty20(res.data.data.enclosure)) {
                            vm.isAccess = false;
                        }
                        if (!Z_IsEmpty20(res.data.data.addrName)) {
                            vm.PositionInit = false;
                        }
                        vm.initialSelected.push({
                            key: res.data.data.sendToPeoName,
                            value: res.data.data.sendToPeo,
                            type: "user"
                        });
                        if (res.data.data.isReadOnly) {
                            vm.imgSrcFlag = true
                            vm.isReadonly = true;
                            vm.editVisitReord = false
                            vm.imgFlag = false
                            vm.fileFlag = false
                            vm.locationFlag = false
                            vm.whoFlag = false
                            vm.imageShow = false
                        }
                    }
                });
            },
            //保存数据
            submit() {
                //数据成功跳首页
                let vm = this;
                let url = "";
                if (Z_IsEmpty20(vm.visitRecord.visitMethod)) {
                    vm.$vux.toast.text("请选择拜访方式");
                    return;
                }
                // if (Z_IsEmpty20(vm.visitRecord.mainThing)) {
                //     vm.$vux.toast.text("请输入主要事宜");
                //     return;
                // }
                let externalContactsId = vm.queryData.externalContactsId ? { externalContactsId: vm.queryData.externalContactsId } : {};
                let param = {
                    pictureUrl: vm.imgArr,
                    addrName: vm.visitRecord.addrName,
                    remarks: vm.visitRecord.remarks,
                    visitResult: vm.visitRecord.visitResult,
                    mainThing: vm.visitRecord.mainThing,
                    enclosure: vm.visitRecord.enclosure,
                    sendToPeo: vm.visitRecord.cardUrl,
                    visitMethod: vm.visitRecord.visitMethod
                };
                if (vm.queryData.type === "update") {
                    url = "/zingbiz/ExternalContacts/ExternalContactsVisitRecordRest/editVisitRecord";
                    param.visitRecordId = vm.$route.query.visitRecordId
                } else {
                    url = "/zingbiz/ExternalContacts/ExternalContactsVisitRecordRest/addVisitRecord";
                }
                let params = Object.assign({}, param, externalContactsId);
                vm.$http.post(url, params).then(res => {
                    if (res.data.success === true) {
                        vm.$vux.toast.text(res.data.mgs);
                        vm.$router.push({
                            path: "ContactDetail",
                            query: {
                                externalContactsId: vm.queryData.externalContactsId,
                                companyId:this.$route.query.companyId
                            }
                        });
                    } else {
                        if (res.data.mgs === "visitMethod不能为空") {
                            vm.$vux.toast.text("拜访方式不能为空");
                        }
                    }
                });
            },
            //所在位置
            localtion() {
                if (this.locationFlag) {
                    this.PositionInit = false;
                    if (isWeiXin() || isMhApp()) {
                        getQMapLocation();
                    } else {
                        this.$vux.toast.show({
                            type: "text",
                            width: "9.5em",
                            text: "请在微信端打开！"
                        });
                    }
                } else {
                    return
                }

            },
            // 上传图片组件方法
            imgOkCallback(files, operationType, index) {
                if (this.imgFlag) {
                    if (isWeiXin() || isMhApp()) {
                        this.files = files;
                        this.imgArr = ""
                        files.forEach((obj) => {
                            if (this.imgArr === "") {
                                this.imgArr += obj.url
                            } else {
                                this.imgArr += "," + obj.url
                            }

                        });
                    } else {
                        this.files = files;
                        this.imgArr = ""
                        files.forEach((obj) => {
                            // this.imgArr.push(obj.url);
                            if (this.imgArr === "") {
                                this.imgArr += obj.url
                            } else {
                                this.imgArr += "," + obj.url
                            }
                        });
                    }
                } else {
                    return
                }
            },
            // 发给用户选择
            selectPeople() {
                if (this.whoFlag) {
                    this.showPersonPicker = true;
                    this.SendPeopleInit = false;
                } else {
                    return
                }
            },
            onPickAbort() {
                this.showPersonPicker = false;
            },
            onPicked(list) {
                let vm = this;
                this.showPersonPicker = false;
                let userName = "";
                let userId = "";
                if (!Z_IsEmpty20(list)) {
                    if (list.length === 1) {
                        console.info(list[0])
                        vm.visitRecord.sendToPeoName = list[0].userName
                        vm.visitRecord.cardUrl = list[0].id;
                    } else {
                        list.forEach(element => {
                            userName += element.userName + ",";
                            userId += element.id + ",";
                        });
                        if (userName.length !== 0 && !Z_IsEmpty20(userName)) {
                            userName = userName.substring(0, userName.length - 1);
                        }
                        if (userId.length !== 0 && !Z_IsEmpty20(userId)) {
                            userId = userId.substring(0, userId.length - 1);
                        }
                        console.info(userName)
                        vm.visitRecord.sendToPeoName = userName
                        vm.visitRecord.cardUrl = userId;
                        console.info( vm.visitRecord)
                    }
                }
            },
            onDoSome() {
                this.showDocx = false;
            },
        }
    };
</script>
<style>
    .el-upload-list__item:first-child {
         margin-top: 0px !important;
    }
    .visitRecord .weui-cell {
        font-size: 15px;
        font-family: Arial;
    }
    .iconfont {
         font-size: 22px;
    }
    .visitRecord .visitMethod .weui-cell__hd:before{
        content: "*";
        display: inline-block;
        position: absolute;
        left: 75px;
        color: rgba(255, 128, 0, 1) !important;
    }
    .imagePick .icon-tianjiatupian1 {
        font-size: 15vw !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper {
        height: calc(100% - 50px);
        .scroll-list-wrap{
            height 100%
        }
    }
    .visitRecord{
        height: calc(100% - 44px);
    }
    .lable-enclos{
        border-bottom 0.5px solid #d9d9d9
        overflow hidden
        font-size: 0.8rem;
        margin-left 13px
        padding 5px  0
    }
    .lable-enclos:first-child{
        border-bottom 0
        border-top 1px solid #d9d9d9
    }
    .lable-enclos:last-child{
        border-bottom 0
    }
    .icon-fujian{
        font-size 20px
    }
    .label-edit{
        height 20px
    }
    .visit-enclosure{
        float left
        margin-left 10px
    }
    .lable-img{
        float left

    }
    .icon-pdf{
        color #8C181A
        font-size 26px
    }
    .icon-word{
        color #14A9DA
        font-size 26px
    }
    .icon-ppt{
        color #E34221
        font-size 26px
    }
    .icon-excel{
        color #45B058
        font-size 26px
    }
    .icon-txt{
        color #F9CA06
        font-size 26px
    }
    .icon-icon_folder{
        color #F1C47D
    }
    .icon-jpg{
        font-size 26px
        color blueviolet
    }
    .iframe_form_data
        width: 90%;
        height: calc(100% - 50px)
        overflow-y: auto
        .iframe_box
            height 100%
            width:100%
            #iframepage{
                height 100%
                width 100%
            }


    .imgSrc{
        height 75px
        width 75px
        margin-right 5px
        margin-bottom 5px
        margin-left 13px

    }
</style>


