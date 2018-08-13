<template>
    <div class="outwrapper bor">
       <div class="innerwrapper" v-show="defaultMain">
           <ZingHead :title="title" :isComeBack="false" @doSome="close()"></ZingHead>
           <div class="scroll-list-wrap">
               <scroll>
                   <group label-width="6em" label-margin-right="2em" title="基本信息" class="basicInfor">
                       <div class="userName">
                           <x-input title="姓名" v-model="name" class="name" :is-type="mustNanme" placeholder="请输入姓名"></x-input>
                           <i v-show="editContact" class="iconfont icon-tongxunlu" @click="addressBook()"></i>
                       </div>
                       <div class="label">
                           <span class="label-title">标签</span>
                           <span class="label-content">
                               <span class="label-content-no" @click="labelType()" v-show="no">点击查看标签</span>
                               <span class="label-content-type" v-show="type" @click="labelType()">{{typeText}}</span>
                               <span class="label-content-level" v-show="level" @click="labelType()">{{levelText}}</span>
                               <span class="label-content-state" v-show="state" @click="labelType()">{{stateText}}</span>
                           </span>
                       </div>
                       <div class="customerType">
                           <span class="customerType-title">类型</span>
                           <span class="customerType-content">
                            <span class="customerType-personal">
                                <span class="check" @click="checkPersonal()" v-bind:style ="{ borderColor:defalueCustomerType }">
                                    <span :class="{radioed: personal }"></span>
                                </span>
                                <span class="personal">个人</span>
                            </span>
                            <span class="customerType-organization">
                                 <span class="check" @click="checkorOrganization()" v-bind:style ="{ borderColor:borderCustomerType }">
                                      <span :class="{radioed: organization }"></span>
                                 </span>
                                <span class="organization">组织</span>
                            </span>
                       </span>
                       </div>
                       <div class="sex">
                           <span class="sex-title">性别</span>
                           <span class="sex-content">
                            <span class="sex-man">
                                <span class="check" @click="checkMan()" v-bind:style ="{ borderColor:defalueColor }">
                                    <span :class="{radioed: man }"></span>
                                </span>
                                <span class="man">男</span>
                            </span>
                            <span class="sex-woman">
                                 <span class="check" @click="checkWoman()" v-bind:style ="{ borderColor:borderColor }">
                                      <span :class="{radioed: woman }"></span>
                                 </span>
                                <span class="woman">女</span>
                            </span>
                       </span>
                       </div>
                       <selector title="证件类型" v-model="IDType" :options="list"></selector>
                       <x-input title="证件号码" v-model="IDNumber" placeholder="请输入证件号码" class="idCard"></x-input>
                       <datetime title="生日" v-model="birthday" min-year="1900" :end-date="endDate"></datetime>
                       <div class="range">
                           <span class="range-title">共享范围</span>
                           <span class="range-content">
                               <span class="range-content-no" @click="shareRange()" v-show="rangeNo">点击查看共享范围</span>
                               <div class="range-content-name" @click="shareRange()">{{sharedScopeName}}</div>
                           </span>
                       </div>
                   </group>
                   <group label-width="6em" label-margin-right="2em" title="联系方式" class="basicInfor">
                       <x-input title="手机号" v-model="phone" placeholder="请输入手机号码" keyboard="number" class="phone"></x-input>
                       <x-input v-for="(item,index) in basicInformation" :key="index"
                           :title="item.name"
                           :placeholder="item.describe"
                            v-model="item.inputData"
                       ></x-input>
                   </group>
                   <group label-width="6em" label-margin-right="2em" title="其他信息" class="basicInfor">
                       <x-input v-for="(item,index) in elseInformation" :key="index"
                           :title="item.name"
                           v-model="item.inputData"
                           :placeholder="item.describe"
                       >

                       </x-input>
                   </group>
                   <flexbox class="inner">
                       <flexbox-item class="interspace">
                           <x-button type="primary" class="btn-save" @click.native="canclePage()">取消</x-button>
                       </flexbox-item>
                       <flexbox-item class="interspace">
                           <x-button type="primary" class="btn-common" @click.native="savePage()">保存</x-button>
                       </flexbox-item>
                   </flexbox>
               </scroll>
           </div>
       </div>
        <labelType
            :popup="popup"
            @cancle="cancle"
            @confirm="combackData"
        >
        </labelType>

        <org-member-picker
             title="共享范围"
            :initialSelected="initialSelected"
            :showPicker="showPicker"
            @picked="onPicked"
            @abort="onPickAbort"
        >
        </org-member-picker>
        <contact-picker-popup
            :companyId="companyId"
            :multiple="multiple"
            :showContactPicker="showContactPicker"
            :friendAndPhoneContactMode = "friendAndPhoneContactMode"
            @hideContackPicker="hideContackPicker"
            @picked="picked"
        >

        </contact-picker-popup>

    </div>
</template>

<script>
    import ContactPickerPopup from "@/components/contactpicker/ContactPickerPopup";
    import ZingHead from "@/components/zingHead/ZingHead";
    import scroll from '@/components/scroll/Scroll'
    import labelType from './template/labelType'
    import OrgMemberPicker from "@/components/orgmemberpicker/OrgMemberPicker";
    import { Search,Popup ,Group,XInput,XButton,Datetime ,Selector,Flexbox,FlexboxItem   } from 'vux'
    import { Z_IsEmpty20 } from '../../utils/fn'
    export default {
        name: "add-contact",
        components: {
            labelType,
            ZingHead,
            scroll,
            Search,
            Popup,
            Group,
            XInput,
            XButton,
            Datetime,
            Selector,
            Flexbox,
            FlexboxItem,
            OrgMemberPicker,
            ContactPickerPopup
        },
        data() {
            return {
                multiple:false,
                title:"添加客户",
                companyId:"",
                userRowId:"",
                //列表数据
                name:"",
                IDNumber:"",
                birthday:"",
                label:"",
                range:"",
                IDType:"请选择",
                list:[
                    "请选择",
                    "居民身份证",
                    "港澳居民来往内地通行证",
                    "台湾居民来往大陆通行证",
                    "护照"
                ],
                sex:"",
                phone:"",
                //组件数据
                popup:false,
                defaultMain:true,
                man:false,
                woman:true,
                personal:true,
                organization:false,
                //选人组件的显示
                showPicker:false,
                //初始化选中的成员
                initialSelected:[],
                type:false,
                level:false,
                state:false,
                typeText:"",
                levelText:"",
                stateText:"",
                no:true,
                rangeNo:true,
                userName:[],
                sharedScopeName:"",
                sharedScope:"",
                validate:true,
                Mobile:"",
                success:false,
                showContactPicker:false,
                friendAndPhoneContactMode:true,
                basicInformation:[
                    {
                        name:"电话",
                        describe:"请输入电话",
                        inputData:""
                    },
                    {
                        name:"传真",
                        describe:"请输入传真",
                        inputData:"",
                    },
                    {
                        name:"邮箱",
                        describe:"请输入邮箱",
                        inputData:""
                    },
                    {
                        name:"微信",
                        describe:"请输入微信",
                        inputData:""
                    },
                    {
                        name:"QQ",
                        describe:"请输入QQ",
                        inputData:""
                    }
                ],
                elseInformation:[
                    {
                        name:"国籍",
                        describe:"请输入国籍",
                        inputData:""
                    },
                    {
                        name:"籍贯",
                        describe:"请输入籍贯",
                        inputData:""
                    },
                    {
                        name:"民族",
                        describe:"请输入民族",
                        inputData:""
                    },
                    {
                        name:"公司",
                        describe:"请输入公司",
                        inputData:""
                    },
                    {
                        name:"职位",
                        describe:"请输入职位",
                        inputData:""
                    },
                    {
                        name:"联系地址",
                        describe:"请输入联系地址",
                        inputData:""
                    },
                    {
                        name:"爱好",
                        describe:"请输入爱好",
                        inputData:""
                    },
                    {
                        name:"车牌",
                        describe:"请输入车牌",
                        inputData:""
                    },
                    {
                        name:"备注",
                        describe:"请输入备注",
                        inputData:""
                    },
                ],
                editContact:true,
                borderColor:"#40affc",
                defalueColor:"#c9c9c9",
                defalueCustomerType:"#40affc",
                borderCustomerType:"#c9c9c9",
                DataCount:{},
                url:"",
                share:[],
                endDate:"",
                emailFlag:true,
                landLineFlag:true,
                phoneFlag:true
            }
        },
        created() {
            let date = new Date();
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            this.endDate = year + "-" + month + "-" + strDate;
            this.companyId = this.$route.query.companyId
            this.userRowId = this.$route.query.externalContactsId
            if (this.userRowId !== "1" && !Z_IsEmpty20(this.userRowId)) {
                this.title = "编辑客户"
                this.editContact = false
                this.editData()

            }
        },
        mounted() {
                //console.log("555555" + document.querySelector(".idCard").dataset.content)
                // console.log(document.querySelector(".idCard .weui-cell__hd"))
        },
        methods:{
            //查看标签类型
            labelType() {
                this.popup = true
                this.defaultMain = false
            },
            //关闭标签页
            cancle() {
                this.popup = false
                this.defaultMain = true
            },
            //标签页返回的数据
            combackData(param) {
                this.level = false
                this.state = false
                this.type = false
                this.typeText = ""
                this.levelText = ""
                this.stateText = ""
                if (param.contactsLevel !== "" || param.contactsState !== "" || param.contactsType !== "") {
                    this.no = false
                    this.typeText = param.contactsType
                    this.levelText = param.contactsLevel
                    this.stateText = param.contactsState
                    if (this.typeText !== "") {
                        this.type = true
                    }
                    if (this.levelText !== "") {
                        this.level = true
                    }
                    if (this.stateText !== "") {
                        this.state = true
                    }
                    // if (this.typeText === "酒店客户") {
                    //     console.log("酒店")
                    // }
                } else {
                    this.no = true
                }
            },
            //性别（男）
            checkMan() {
                this.man = true
                this.woman = false
                this.defalueColor = "#40affc"
                this.borderColor = "#c9c9c9"
            },
            checkWoman() {
                this.man = false
                this.woman = true
                this.borderColor = "#40affc"
                this.defalueColor = "#c9c9c9"
            },
            //选择客户类型
            checkPersonal() {
                this.personal = true
                this.organization = false
                this.defalueCustomerType = "#40affc"
                this.borderCustomerType = "#c9c9c9"
            },
            checkorOrganization() {
                this.personal = false
                this.organization = true
                this.defalueCustomerType = "#c9c9c9"
                this.borderCustomerType = "#40affc"
            },
            //共享范围
            shareRange() {
                this.defaultMain = false
                this.showPicker = true
                this.initialSelected = []
                this.share.filter((item) => {
                    if (!item) {
                        return false
                    }
                    this.initialSelected.push({
                        value: item.cardUrl,
                        type: item.type
                    });
                    return true
                })
            },
            onPickAbort () {
                this.showPicker = false
                this.defaultMain = true
            },
            onPicked(item) {

                console.log(item)
                this.share = item
                this.showPicker = false
                this.userName = []
                this.sharedScopeName = ""
                this.sharedScope = ""
                this.defaultMain = true
                this.rangeNo = true
                if (item.length !== 0) {
                    this.rangeNo = false
                    this.userName = item
                    let that = this
                    item.filter(function (val,index) {
                        if (!val) {
                            return false
                        }
                        that.initialSelected.push({ type:item.type,value:item._id })
                        if (index < (item.length - 1)) {
                            that.sharedScopeName += val.title + ","
                            that.sharedScope += val.cardUrl + ","
                        } else {
                            that.sharedScopeName += val.title
                            that.sharedScope += val.cardUrl
                        }
                        return true

                    })

                } else {
                    console.log("没有数据")
                }
            },
            //取消
            canclePage() {
                if (Z_IsEmpty20(this.$route.query.bind)) {
                    this.$router.go(-1)
                } else {
                    this.$router.push({
                        path:"bindContactUser",
                        query:{
                            go:true
                        }
                    })
                }
            },
            //数据验证
            date() {
                this.validate = true
                this.success = false
                if (this.name === "") {
                    this.$vux.toast.text("姓名不能为空！");
                    return
                } else {
                    this.success = true
                }
                // this.Mobile = (/^1[34578]\d{9}$/.test(this.phone))
                // if (this.typeText === "") {
                //     this.validate = false
                // }
                // if (this.name === "" && this.phone === "" && !this.validate) {
                //     this.$vux.toast.text("请填写全部！");
                //     return
                // } else {
                //     if (this.name !== "" && this.phone !== "" && this.validate && this.Mobile) {
                //         this.success = true
                //         return
                //     }
                //     if (this.name === "" && this.phone !== "" && this.validate ) {
                //         this.$vux.toast.text("请输入姓名！");
                //         return
                //     } else if (this.name !== "" && this.phone !== "" && !this.validate) {
                //         this.$vux.toast.text("客户类型不能为空！");
                //         return
                //     } else if (this.name !== "" && this.phone === "" && this.validate) {
                //         this.$vux.toast.text("请填写手机号码！");
                //         return
                //     } else if (this.name !== "" && this.phone !== "" && this.validate && !this.Mobile) {
                //         this.$vux.toast.text("请正确填写手机号码！");
                //         return
                //     } else {
                //         this.$vux.toast.text("请填写全部！");
                //         return
                //     }
                // }
            },
            //保存数据
            savePage() {
                let that = this
                that.date()
                that.emailFlag = true
                that.landLineFlag = true
                that.phoneFlag = true
                if (that.success) {
                    let params = {}
                    if (that.userRowId !== "1" && !Z_IsEmpty20(this.userRowId)) {
                        that.url = "/zingbiz/ExternalContacts/ExternalContactsRest/updateExternalContacts"
                        params.contactsId = that.userRowId
                    } else {
                        that.url = "/zingbiz/ExternalContacts/ExternalContactsRest/addExternalContacts"
                    }
                    params.contactsName = that.name
                    if (!Z_IsEmpty20(that.typeText)) {
                        params.contactsType = that.typeText
                    }
                    if (!Z_IsEmpty20(that.stateText)) {
                        params.contactsState = that.stateText
                    }
                    if (!Z_IsEmpty20(that.levelText)) {
                        params.contactsLevel = that.levelText
                    }

                    if (!Z_IsEmpty20(that.birthday)) {
                        params.birthday = that.birthday
                    }
                    if (!Z_IsEmpty20(that.phone)) {
                        that.phoneFlag = /^1[34578]\d{9}$/.test(that.phone)
                        if (that.phoneFlag) {
                            params.telPhone = that.phone
                        }
                    }
                    if (that.IDType !== "请选择") {
                        params.idCardType = that.IDType
                    }
                    if (!Z_IsEmpty20(that.IDNumber)) {
                        params.idCard = that.IDNumber
                    }
                    if (that.man) {
                        params.gender = "1"
                    } else {
                        params.gender = "2"
                    }
                    //客户类型

                    if (!Z_IsEmpty20(that.sharedScope)) {
                        params.sharedScope = that.sharedScope
                    }
                    that.basicInformation.filter(item => {
                        if (!item) {
                            return false
                        }
                        if (item.name === "电话") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                that.landLineFlag = /^0\d{2,3}-?\d{7,8}$/.test(item.inputData)
                                if (that.landLineFlag) {
                                    params.landLine = item.inputData
                                }
                            }
                        }
                        if (item.name === "传真") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.faxNo = item.inputData
                            }
                        }
                        if (item.name === "邮箱") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                that.emailFlag = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(item.inputData)
                                if (that.emailFlag) {
                                    params.email = item.inputData
                                }
                            }
                        }
                        if (item.name === "微信") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.weChat = item.inputData
                            }
                        }
                        if (item.name === "QQ") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.qq = item.inputData
                            }
                        }
                        return true
                    })
                    that.elseInformation.filter(item => {
                        if (!item) {
                            return false
                        }
                        if (item.name === "国籍") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.nationality = item.inputData
                            }
                        }
                        if (item.name === "籍贯") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.hometown = item.inputData
                            }
                        }
                        if (item.name === "民族") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.nation = item.inputData
                            }
                        }
                        if (item.name === "公司") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.companyName = item.inputData
                            }
                        }
                        if (item.name === "职位") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.workTitle = item.inputData
                            }
                        }
                        if (item.name === "联系地址") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.address = item.inputData
                            }
                        }
                        if (item.name === "爱好") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.hobby = item.inputData
                            }

                        }
                        if (item.name === "车牌") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.plateNumber = item.inputData
                            }
                        }
                        if (item.name === "备注") {
                            if (!Z_IsEmpty20(item.inputData)) {
                                params.remark = item.inputData
                            }
                        }
                        return true
                    })
                    if (!that.emailFlag) {
                        console.log(that.emailFlag)
                        that.$vux.toast.text("请正确填写邮箱！");
                        return
                    }
                    if (!that.landLineFlag) {
                        that.$vux.toast.text("请正确填写电话！");
                        return
                    }
                    if (!that.phoneFlag) {
                        that.$vux.toast.text("请正确填写手机号码！");
                        return
                    }
                    that.$http.post(that.url,params).then(function (res) {
                        if (res.data && res.data.success) {
                            //添加
                            if (that.userRowId === 1) {
                                if (res.data.data === null) {
                                    if (Z_IsEmpty20(that.$route.query.bind)) {
                                        that.$router.go(-1)
                                    } else {
                                        that.$router.push({
                                            path:"bindContactUser",
                                            query:{
                                                go:true
                                            }
                                        })
                                    }
                                } else {
                                    //携带参数跳转任务集
                                    let boardId = res.data.data.boardId;
                                    let cardId = res.data.data.cardId;
                                    window.location.href = "SRender?jsLoader=trello%2FcardListLoader" +
                                        "&tpl=trello%2FcardList&boardId=" + boardId + "&routing=" + that.companyId + "&cardId=" + cardId + '&mhMenuKey_=09';
                                }
                            } else {
                                //修改成功
                                if (Z_IsEmpty20(that.$route.query.bind)) {
                                    that.$router.go(-1)
                                } else {
                                    that.$router.push({
                                        path:"bindContactUser",
                                        query:{
                                            go:true
                                        }
                                    })
                                }
                            }
                        } else {
                            if (res.data && res.data.mgs && res.data.mgs === '新添加的外联人在本商号下已存在') {
                                //携带参数跳转下一个界面
                                that.$router.push({
                                    path:"/outContactMain/addContactConflict",
                                    query:{
                                        originalParams:params
                                    }
                                })
                            } else if (res.data && res.data.mgs && res.data.mgs === "非负责人与管理员不能修改") {
                                that.$vux.toast.text("非负责人与管理员不能修改！");
                            }
                        }
                    })
                }
            },
            //名字验证
            mustNanme (val) {
                return {
                    valid: val !== '',
                    msg: '请输入姓名'
                }
            },
            //通讯录的显示
            addressBook() {
                this.showContactPicker = true
                this.defaultMain = false
            },
            //通讯返回
            hideContackPicker () {
                this.showContactPicker = false
                this.defaultMain = true
            },
            //通讯录返回数据
            picked(val) {
                val.forEach(item => {
                    this.name += item.title
                })
                this.hideContackPicker()
                // this.name = val.userName
            },
            //编辑外联人数据
            editData() {
                let that = this
                that.$http.post("/zingbiz/ExternalContacts/ExternalContactsRest/getExternalContactsById",{
                    companyId:that.companyId,
                    contactsId:that.userRowId
                }).then(function (res) {
                    that.DataCount = res.data.data
                    console.log(res.data.data)
                    that.editDataCount()
                })
            },
            //处理编辑外联人数据
            editDataCount() {
                if (!Z_IsEmpty20(this.DataCount.contactsName)) {
                    this.name = this.DataCount.contactsName
                }
                if (!Z_IsEmpty20(this.DataCount.contactsType )) {
                    this.no = false
                    this.type = true
                    this.typeText = this.DataCount.contactsType
                }
                if (!Z_IsEmpty20(this.DataCount.contactsState)) {
                    this.no = false
                    this.state = true
                    this.stateText = this.DataCount.contactsState
                }
                if (!Z_IsEmpty20(this.DataCount.contactsLevel)) {
                    this.no = false
                    this.level = true
                    this.levelText = this.DataCount.contactsLevel
                }
                if (!Z_IsEmpty20(this.DataCount.birthday)) {
                    this.birthday = this.DataCount.birthday
                }
                if (!Z_IsEmpty20(this.DataCount.telPhone)) {
                    this.phone = this.DataCount.telPhone
                }
                if (!Z_IsEmpty20(this.DataCount.idCardType )) {
                    this.IDType = this.DataCount.idCardType
                }
                if (!Z_IsEmpty20(this.DataCount.idCard )) {
                    this.IDNumber = this.DataCount.idCard
                }
                if (this.DataCount.gender === "1") {
                    this.checkMan()
                } else if (this.DataCount.gender === "2") {
                    this.checkWoman()
                }
                if (!Z_IsEmpty20(this.DataCount.sharedScopeName )) {
                    this.rangeNo = false
                    this.sharedScopeName = this.DataCount.sharedScopeName

                }

                this.basicInformation.filter(item => {
                    if (!item) {
                        return false
                    }
                    if (item.name === "电话") {
                        if (!Z_IsEmpty20(this.DataCount.landLine)) {
                            item.inputData = this.DataCount.landLine
                        }
                    }
                   if (item.name === "传真") {
                       if (!Z_IsEmpty20(this.DataCount.faxNo)) {
                           item.inputData = this.DataCount.faxNo
                       }

                   }
                   if (item.name === "邮箱") {
                       if (!Z_IsEmpty20(this.DataCount.email)) {
                           item.inputData = this.DataCount.email
                       }
                   }
                   if (item.name === "微信") {
                       if (!Z_IsEmpty20(this.DataCount.weChat)) {
                           item.inputData = this.DataCount.weChat
                       }
                   }
                   if (item.name === "QQ") {
                       if (!Z_IsEmpty20(this.DataCount.qq)) {
                           item.inputData = this.DataCount.qq
                       }
                   }
                    return true
               })
                this.elseInformation.filter(item => {
                    if (!item) {
                        return false
                    }
                    if (item.name === "国籍") {
                        if (!Z_IsEmpty20(this.DataCount.nationality)) {
                            item.inputData = this.DataCount.nationality
                        }
                    }
                    if (item.name === "籍贯") {
                        if (!Z_IsEmpty20(this.DataCount.hometown)) {
                            item.inputData = this.DataCount.hometown
                        }
                    }
                    if (item.name === "民族") {
                        if (!Z_IsEmpty20(this.DataCount.nation)) {
                            item.inputData = this.DataCount.nation
                        }
                    }
                    if (item.name === "公司") {
                        if (!Z_IsEmpty20(this.DataCount.companyName)) {
                            item.inputData = this.DataCount.companyName
                        }
                    }
                    if (item.name === "职位") {
                        if (!Z_IsEmpty20(this.DataCount.workTitle)) {
                            item.inputData = this.DataCount.workTitle
                        }
                    }
                    if (item.name === "联系地址") {
                        if (!Z_IsEmpty20(this.DataCount.address)) {
                            item.inputData = this.DataCount.address
                        }
                    }
                    if (item.name === "爱好") {
                        if (!Z_IsEmpty20( this.DataCount.hobby)) {
                            item.inputData = this.DataCount.hobby
                        }
                    }
                    if (item.name === "车牌") {
                        if (!Z_IsEmpty20(this.DataCount.plateNumber)) {
                            item.inputData = this.DataCount.plateNumber
                        }
                    }
                    if (item.name === "备注") {
                        if (!Z_IsEmpty20(this.DataCount.remark)) {
                            item.inputData = this.DataCount.remark
                        }
                    }
                    return true
                })

            },
            //返回上一页
            close() {
                if (Z_IsEmpty20(this.$route.query.bind)) {
                    this.$router.go(-1)
                } else {
                    this.$router.push({
                        path:"bindContactUser",
                        query:{
                            go:true
                        }
                    })
                }
            }
        }
    }
</script>
<style>
    .bor .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;

    }
    .basicInfor .weui-cells__title {
        color: rgba(255, 128, 0, 1) !important;
        font-size: 16px;
        font-family: Arial;
    }
    .basicInfor .weui-cell__hd{
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        font-family: Arial;
    }
    .basicInfor .weui-cell__primary,.basicInfor .weui-select{
        color: rgba(136, 136, 136, 1);
        font-size: 14px;
        font-family: Microsoft Yahei;
    }
    .basicInfor .label ::-webkit-input-placeholder{
        color: black;
        font-size: 14px;
        font-family: Arial;
    }
    .basicInfor .range ::-webkit-input-placeholder{
        color: black;
        font-size: 14px;
        font-family: Arial;
    }
    .basicInfor .name .weui-cell__hd:before,.basicInfor .label .weui-cell__hd:before{
       content: "*";
       display: inline-block;
       position: absolute;
       left: 50px;
       color: rgba(255, 128, 0, 1) !important;
   }
    /*.basicInfor .phone .weui-cell__hd:before{*/
        /*content: "*";*/
        /*display: inline-block;*/
        /*position: absolute;*/
        /*left: 70px;*/
        /*color: rgba(255, 128, 0, 1) !important;*/
    /*}*/
    .basicInfor .idCard .weui-cell__hd:before{
        /*content:attr(data-content);*/
        /*display: inline-block;*/
        /*position: absolute;*/
        /*left: 80px;*/
        /*color: rgba(255, 128, 0, 1) !important;*/
    }
    .interspace{
        margin-left: 0px !important;
    }
    .inner{
        margin-top: 20px;
    }
    /*.label-title:before{*/
        /*content: "*";*/
        /*display: inline-block;*/
        /*position: absolute;*/
        /*left: 40px;*/
        /*color: rgba(255, 128, 0, 1) !important;*/
    /*}*/
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height calc(100%-50px)
    }
    .innerwrapper{
        height 100%
    }
    .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow: hidden;
    }
    .basicInfor .vux-selector{
        height 44px !important
    }

    .basicInfor .sex,.basicInfor .customerType{
        position relative
        box-sizing border-box
        height 44px
        line-height 44px
        padding-left  13px
        padding-right 13px
        border-top: 1px solid #f5f5f5;
        &-content{
            position absolute
            right 13px
        }
        &-man{
            margin-right 50px
            font-size 14px
        }
        &-woman{
            font-size 14px
        }
        &-personal{
            margin-right 30px
            font-size 14px
        }
        &-organization{
            font-size 14px
        }
    }
    .check{
        box-sizing: border-box;
        position relative
        display inline-block
        width: 21px;
        height: 21px;
        background-color: #fff;
        border: 1px solid #f5f5f5;
        border-radius: 11px;
    }
    .radioed{
        box-sizing: border-box;
        content: ''
        display inline-block
        position  absolute
        width 12px
        height 12px
        border-radius 6px
        left 50%
        top 50%
        transform translate(-50%,-50%)
        background-color #40affc
    }
    .label,.range{
        position relative
        box-sizing border-box
        padding 10px 13px
        border-top: 1px solid #f5f5f5;
        border-bottom: 1px solid #f5f5f5;
        overflow hidden
        &-title{
            color: rgba(16, 16, 16, 1);
            font-size: 16px;
            font-family: Arial;
        }
        &-content{
            float right
            width 60%
            text-align right
            &-no{
                color: rgba(16, 16, 16, 1);
                font-size: 14px;
                font-family: Microsoft Yahei;

            }
            &-mame{
                color: rgba(16, 16, 16, 1);
                font-size: 14px;
                font-family: Microsoft Yahei;
            }
            &-type{
                height 20px
                line-height 10px
                padding 5px
                border-radius 2px
                display inline-block
                background-color: rgba(252, 165, 106, 1);
                color: rgba(255, 128, 0, 1);
                font-size: 14px;
                font-family: Arial;
            }
            &-state{
                height 20px
                line-height 10px
                padding 5px
                border-radius 2px
                display inline-block
                background-color: rgba(220, 246, 239, 1);
                color: rgba(23, 194, 149, 1);
                font-size: 14px;
                font-family: Arial;
            }
            &-level{
                height 20px
                padding 5px
                line-height 10px
                border-radius 2px
                display inline-block
                background-color: rgba(228, 242, 252, 1);
                color: rgba(77, 169, 235, 1);
                font-size: 14px;
                font-family: Arial;
            }
        }
    }
    .range-content-name{
        font-size 14px !important
    }

    .userName{
         position relative
    }
    .icon-tongxunlu{
        position absolute
        top: 50%
        left 60%
        transform translate(-50%,-50%)
        right 13px
        font-size 24px
    }
</style>
