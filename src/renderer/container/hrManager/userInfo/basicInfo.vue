<template>
    <div class="basicInfo">
        <div v-if="btnType == 'tg'">
            <group label-width="6em" label-margin-right="2em" label-align="left">
                <div class="headImgDiv">
                    <img class="previewer-demo-img headImg" v-for="(item, index) in list" :src="item.src" @click="showPreview(index)">
                </div>
                <div v-transfer-dom>
                    <previewer  :list="list" ref="previewer" :options="options" ></previewer>
                </div>
                <cell title="档案状态" class="hr_title status_name" :value="file_status_name"></cell>
                <cell title="基本信息" class="hr_title"></cell>
                <cell  title="姓名" :value="formData.userName">
                     <span slot="title">姓名<span class="span_title">*</span></span>
                </cell>
                <div class="sex">
                           <span class="sex-title">性别<span class="span_title">*</span></span>
                           <span class="sex-content">
                                <span class="sex-man">
                                    <span class="check"  v-bind:style ="{ borderColor:defalueColor }">
                                        <span :class="{radioed: man }"></span>
                                    </span>
                                    <span class="man">男</span>
                                </span>
                                <span class="sex-woman">
                                     <span class="check"  v-bind:style ="{ borderColor:borderColor }">
                                          <span :class="{radioed: woman }"></span>
                                     </span>
                                    <span class="woman">女</span>
                                </span>
                           </span>
                </div>
                <cell  title="生日" :value="formData.dateOfBirth">
                    <span slot="title">生日<span class="span_title">*</span></span>
                </cell>
                <cell  :value="formData.IDNumberType">
                    <span slot="title">证件类型<span class="span_title">*</span></span>
                </cell>
                <cell  :value="formData.IDNumber">
                    <span slot="title">证件号码<span class="span_title">*</span></span>
                </cell>
                <cell :value="formData.nation">
                    <span slot="title">民族<span class="span_title">*</span></span>
                </cell>
                <cell  :value="formData.placeOfOrigin">
                     <span slot="title">籍贯<span class="span_title">*</span></span>
                </cell>
                <cell  :value="formData.accountLocation">
                    <span slot="title">户口所在地<span class="span_title">*</span></span>
                </cell>
                <cell  :value="formData.maritalStatus">
                    <span slot="title">婚姻状况<span class="span_title">*</span></span>
                </cell>
                <cell  :value="formData.politicalOutlook">
                    <span slot="title">政治面貌<span class="span_title">*</span></span>
                </cell>
                <cell  :value="formData.education">
                     <span slot="title">学历<span class="span_title">*</span></span>
                </cell>
                <cell  :value="formData.graduateInstitutions">
                    <span slot="title">毕业院校<span class="span_title">*</span></span>
                </cell>
                <cell  :value="formData.joinThisUnitTime">
                    <span slot="title">入职时间<span class="span_title">*</span></span>
                </cell>
                <cell title="联系方式" class="hr_title"></cell>
                <x-input  v-model="formData.telPhone"   placeholder="必填">
                    <span slot="label">手机<span class="span_title">*</span></span>
                </x-input>
                <x-input title="邮箱" v-model="formData.email"   placeholder="选填"></x-input>
                <x-input title="QQ" v-model="formData.qqNumber"   placeholder="选填"></x-input>
                <x-input title="微信" v-model="formData.weChatNumber"   placeholder="选填"></x-input>
                
                <cell title="家庭信息" class="hr_title"></cell>
                <cell title="家庭电话" :value="formData.homePhone">
                     <span slot="title">家庭电话<span class="span_title">*</span></span>
                </cell>
                <cell title="家庭邮编" :value="formData.homeZipCode">
                    <span slot="title">家庭邮编<span class="span_title">*</span></span>
                </cell>
                <cell title="家庭地址" :value="formData.homeAddress">
                    <span slot="title">家庭地址<span class="span_title">*</span></span>
                </cell>
                <flexbox>
                    <flexbox-item>
                        <x-button type="primary btn-common" @click.native="saveBtn('')">保存</x-button>
                    </flexbox-item>
                </flexbox>
            </group>
        </div>
        <div v-else>
            <group label-width="5em" label-margin-right="2em" label-align="left">
                <div class="image-picker-wrapper">
                    <image-picker
                        :files="files"
                        :companyId="companyId"
                        :multiple="multiple"
                        :bId = "bId"
                        :bType = "bType"
                        :removable = "false"
                        @onChange="imgOkCallback"
                        :selectable="files.length < 1"
                        :imageNum="1"
                    />
                </div>
                
                <cell title="档案状态" class="hr_title status_name" :value="file_status_name"></cell>
                <cell title="基本信息" class="hr_title"></cell>
                <x-input v-model="formData.userName"    :max="10" placeholder="请输入姓名">
                     <span slot="label">姓名<span class="span_title">*</span></span>
                </x-input>
                <div class="sex">
                           <span class="sex-title">性别<span class="span_title">*</span></span>
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
                <datetime  v-model="formData.dateOfBirth"  :min-year="1900" :end-date="curDate" placeholder="年/月/日">
                    <span slot="title">生日<span class="span_title">*</span></span>
                </datetime>
                <popup-picker :data="IDNumberTypeList" v-model="IDNumberTypeValue"   placeholder="请选择证件类型">
                    <span slot="title">证件类型<span class="span_title">*</span></span>
                </popup-picker>
                <x-input  v-model="formData.IDNumber"  placeholder="请输入证件号码">
                    <span slot="label">证件号码<span class="span_title">*</span></span>
                </x-input>
                <selector title="民族 <span style='color: #D81E06;'>*</span>" v-model="nationValue" :options="nationList">
                </selector>
                <x-input  v-model="formData.placeOfOrigin"    placeholder="请输入籍贯">
                    <span slot="label">籍贯<span class="span_title">*</span></span>
                </x-input>
                <x-input  v-model="formData.accountLocation"   placeholder="请输入户口所在地">
                     <span slot="label">户口所在地<span class="span_title">*</span></span>
                </x-input>
                <popup-picker  :data="maritalStatusList" v-model="maritalStatusValue"   placeholder="请选择">
                    <span slot="title">婚姻状况<span class="span_title">*</span></span>
                </popup-picker>
                <popup-picker  :data="politicalOutlookList" v-model="politicalOutlookValue"   placeholder="请选择">
                    <span slot="title">政治面貌<span class="span_title">*</span></span>
                </popup-picker>
                <popup-picker  :data="educationList" v-model="educationValue"  placeholder="请选择">
                    <span slot="title">学历<span class="span_title">*</span></span>
                </popup-picker>
                <x-input  v-model="formData.graduateInstitutions"  placeholder="请输入毕业院校">
                     <span slot="label">毕业院校<span class="span_title">*</span></span>
                </x-input>
                <datetime  v-model="formData.joinThisUnitTime"  :min-year="1900" :end-date="curDate" placeholder="请输入职时间">
                    <span slot="title">入职时间<span class="span_title">*</span></span>
                </datetime>
                
                <cell title="联系方式" class="hr_title"></cell>
                <x-input  v-model="formData.telPhone"    placeholder="请输入手机号码">
                    <span slot="label">手机<span class="span_title">*</span></span>
                </x-input>
                <x-input  v-model="formData.email"    placeholder="请输入邮箱">
                    <span slot="label">邮箱</span>
                </x-input>
                <x-input title="QQ" v-model="formData.qqNumber"    placeholder="请输入QQ号">
                    <span slot="label">QQ</span>
                </x-input>
                <x-input title="微信" v-model="formData.weChatNumber"   placeholder="请输入微信号">
                    <span slot="label">微信</span>
                </x-input>
                <cell title="家庭信息" class="hr_title"></cell>
                <x-input  v-model="formData.homePhone"   placeholder="请输入家庭电话">
                     <span slot="label">家庭电话<span class="span_title">*</span></span>
                </x-input>
                <x-input v-model="formData.homeZipCode"  :min="6" :max="6" type="number"   placeholder="请输入家庭邮编">
                    <span slot="label">家庭邮编<span class="span_title">*</span></span>
                </x-input>
                <x-input v-model="formData.homeAddress"   placeholder="请输入家庭地址">
                    <span slot="label">家庭地址<span class="span_title">*</span></span>
                </x-input>
                <flexbox style="padding-bottom: 15px;">
                    <flexbox-item>
                        <div v-if="btnType == 'wjd'">
                            <x-button type="primary btn-common" @click.native="saveBtn()">提交认证</x-button>
                        </div>
                        <div v-if="btnType == 'dsh'">
                            <x-button type="primary btn-common" @click.native="saveBtn('')">保存</x-button>
                        </div>
                        <div v-if="btnType == 'tg'">
                            <x-button type="primary btn-common" @click.native="saveBtn('')">保存</x-button>
                        </div>
                    </flexbox-item>
                </flexbox>
            </group>
        </div>
    </div>
</template>


<script>

    import ImagePicker from 'components/imagepicker/ImagePicker';
    import { isWeiXin, isMhApp, Z_IsEmpty20 } from "@/utils/fn";
    import {Previewer, Popover,Datetime,XInput, Group, XButton, Popup,PopupPicker, Cell, Flexbox, FlexboxItem,Selector} from 'vux'
    export default {
        name: "basicInfo",
        components: {
            Previewer, Popover,Datetime,XInput, Group, XButton, Popup,PopupPicker, Cell, Flexbox, FlexboxItem,Selector,
            ImagePicker,isWeiXin, isMhApp, Z_IsEmpty20 
        },
        data() {
            return {
                borderColor:"#40affc",
                defalueColor:"#c9c9c9",
                man:true,
                woman:false,


                bId:"id",
                bType:"HRHead",
                curDate:"",//当前时间
                file_status_name:"",//档案的状态
                btnType:"",//按钮类型
                companyId:"",//公司表示
                cardUrl:"",
                files:[],//图片资源
                selectable:true,//添加按钮
                multiple:false,//是否多选
                formData:{
                    rowId:"",
                    cardUrl:"",
                    companyId:"",
                    headImg:"",
                    userName:"",
                    sex:"",
                    dateOfBirth:"",
                    IDNumberType:"",
                    IDNumber:"",
                    nation:"",
                    placeOfOrigin:"",
                    accountLocation:"",
                    maritalStatus:"",
                    politicalOutlook:"",
                    education:"",
                    graduateInstitutions:"",
                    joinThisUnitTime:"",
                    telPhone:"",
                    email:"",
                    qqNumber:"",
                    weChatNumber:"",
                    homePhone:"",
                    homeZipCode:"",
                    homeAddress:""
                },
                professionalList: ['材料系','电机系','电子工程系','动力机械与农业机械系','法学院','工程化学系','工程力学系','工程物理系','工业工程系','公共管理学院','航天航空学院',
                    '核研院','化学工程系','化学系','环境科学与工程系','环境学院','机械工程系','计算机系','继续教育学院','建筑工程系','建筑管理系','建筑学院','教育研究院',
                    '经管学院','经济所','精密仪器系','科学技术与社会研究所','理学院','历史系','马克思主义学院','美术学院','汽车工程系','热能工程系','软件学院','社会科学学院',
                    '生命科学学院','生物系','数学力学系','数学系','水利工程系','水利水电工程系','体育学院','土木工程系','土木建筑工程系','外语系','微电子所','无线电系',
                    '物理系','新闻与传播学院','冶金工程系','医学院','哲学系','政治学系','中文系','自动化系','自动控制系','其他'],
                educationList:[['小学及以下','初中','高中','中专','大专','本科','研究生','博士及以上']],
                educationValue:[],
                nationList:['汉族','满族','藏族', '怒族','仡佬族','朝鲜族','撒拉族','东乡族','白族','羌族','壮族','阿昌族','珞巴族','塔吉克','景颇族','侗族','畲族',
                    '回族','保安族','毛南族','塔塔尔','德昂族','京族','水族','独龙族','布朗族','仫佬族','土家族','赫哲族','黎族','土族','鄂伦春','基诺族','门巴族','锡伯族',
                    '维吾尔族','佤族','俄罗斯','拉祜族','蒙古族','裕固族','乌孜别克','傣族','瑶族','鄂温克','布依族','纳西族','哈尼族','柯尔克孜','苗族','彝族','高山族','傈僳族',
                    '普米族','哈萨克','达斡尔'],
                nationValue:'必填',
                IDNumberTypeList:[['居民身份证','港澳居民来往内地通行证','台湾居民来往大陆通行证', '护照']],
                IDNumberTypeValue:[],
                maritalStatusList:[['未婚', '已婚']],
                maritalStatusValue:[],
                politicalOutlookList:[['群众', '团员', '党员', '民主党派']],
                politicalOutlookValue:[],
                list: [{src:"/JsLib/dist/app/images/defaultImgs/userDef_.jpg"}],
                options: {
                  getThumbBoundsFn (index) {
                    // find thumbnail element
                    let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                    // get window scroll Y
                    let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                    // optionally get horizontal scroll
                    // get position of element relative to viewport
                    let rect = thumbnail.getBoundingClientRect()
                    // w = width
                    return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
                    // Good guide on how to get element coordinates:
                    // http://javascript.info/tutorial/coordinates
                }
              }
            }
        },
        created: function () {
            this.getPersonnelFile();//初始化数据
            this.curDate = this.getCurDate().nyr
        },
        methods: {
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
            showPreview(index){
                this.$refs.previewer.show(index)
            },
            getPersonnelFile() {
                let url = "/zingbiz/hrManager/PersonnelFile/getPersonnelFile"
                this.$http.post(url,{}).then(res => {

                        let HrData = res.data.data
                        if(!HrData){
                            return false
                        }
                        if(HrData.rowId){
                            this.formData.rowId = HrData.rowId
                        }
                        if(HrData.cardUrl){
                            this.formData.cardUrl = HrData.cardUrl
                            this.cardUrl = HrData.cardUrl
                        }
                        if(HrData.companyId){
                            this.formData.companyId = HrData.companyId
                            this.companyId = HrData.companyId
                        }
                        if(HrData.headImg){
                            this.formData.headImg = HrData.headImg
                            this.files.push({url:HrData.headImg})
                        }
                        if(HrData.userName){
                            this.formData.userName = HrData.userName
                        }
                        if(HrData.dateOfBirth){
                            this.formData.dateOfBirth = HrData.dateOfBirth
                        }
                        if(HrData.IDNumberType){
                            this.formData.IDNumberType = HrData.IDNumberType
                        }
                        if(HrData.IDNumber){
                            this.formData.IDNumber = HrData.IDNumber
                        }
                        if(HrData.nation){
                            this.formData.nation = HrData.nation
                        }
                        if(HrData.placeOfOrigin){
                            this.formData.placeOfOrigin = HrData.placeOfOrigin
                        }
                        if(HrData.accountLocation){
                            this.formData.accountLocation = HrData.accountLocation
                        }
                        if(HrData.maritalStatus){
                            this.formData.maritalStatus = HrData.maritalStatus
                        }
                        if(HrData.politicalOutlook){
                            this.formData.politicalOutlook = HrData.politicalOutlook
                        }
                        if(HrData.education){
                            this.formData.education = HrData.education
                        }
                        if(HrData.graduateInstitutions){
                            this.formData.graduateInstitutions = HrData.graduateInstitutions
                        }
                        if(HrData.joinThisUnitTime){
                            this.formData.joinThisUnitTime = HrData.joinThisUnitTime
                        }
                        if(HrData.telPhone){
                            this.formData.telPhone = HrData.telPhone
                        }
                        if(HrData.email){
                            this.formData.email = HrData.email
                        }
                        if(HrData.qqNumber){
                            this.formData.qqNumber = HrData.qqNumber
                        }
                        if(HrData.weChatNumber){
                            this.formData.weChatNumber = HrData.weChatNumber
                        }
                        if(HrData.homePhone){
                            this.formData.homePhone = HrData.homePhone
                        }
                        if(HrData.homeZipCode){
                            this.formData.homeZipCode = HrData.homeZipCode
                        }
                        if(HrData.homeAddress){
                            this.formData.homeAddress = HrData.homeAddress
                        }

                        if(HrData.file_status == "待审核"){
                            this.file_status_name = "未认证"
                            this.btnType = "dsh"
                        }else if(HrData.file_status == "通过"){
                            this.file_status_name = "已认证"
                            this.btnType = "tg"
                            this.list[0].src = HrData.headImg
                        }else if(HrData.file_status == "未建档"){
                            this.file_status_name = "未认证"
                            this.btnType = "wjd"
                        }

                        if(HrData.education){
                            this.educationValue.push(HrData.education)
                        }
                        if(HrData.IDNumberType){
                            this.IDNumberTypeValue.push(HrData.IDNumberType)
                        }
                        if(HrData.politicalOutlook){
                            this.politicalOutlookValue.push(HrData.politicalOutlook)
                        }
                        if(HrData.maritalStatus){
                            this.maritalStatusValue.push(HrData.maritalStatus)
                        }
                        
                        //处理单选
                        if(HrData.sex == "男"){
                            this.checkMan()
                        }else if(HrData.sex == "女"){
                            this.checkWoman()
                        }
                        if(HrData.nation){
                            this.nationValue = HrData.nation
                        }
                    })
            },
            saveBtn(){
                let _this = this
                this.formData.education = this.educationValue[0]
                this.formData.IDNumberType = this.IDNumberTypeValue[0]
                this.formData.politicalOutlook = this.politicalOutlookValue[0]
                this.formData.maritalStatus = this.maritalStatusValue[0]
                //民族
                this.formData.nation = this.nationValue
                //处理单选
                if(this.man){
                    this.formData.sex = "男"
                }
                if(this.woman){
                    this.formData.sex = "女"
                }
                let status = this.validateForm(this.formData)
                if(status){
                    if(this.btnType == 'wjd' || this.btnType == 'dsh'){
                        this.formData.file_status = '待审核'
                    }
                    let url
                    if(this.btnType == 'wjd' ){
                        url = "/zingbiz/hrManager/PersonnelFile/attest"
                    }else if(this.btnType == 'dsh'){
                        url = "/zingbiz/hrManager/PersonnelFile/updatePersonnelFileAndRed"
                    }else if(this.btnType == 'tg'){
                        url = "/zingbiz/hrManager/PersonnelFile/updatePersonnelFile"
                    }
                    
                    this.$http.post(url,this.formData).then(res => {
                        this.$vux.toast.show({
                                text: "操作成功！",
                                type: "success",
                                onHide () {
                                    _this.$router.back(-1)
                                }
                        })
                    })
                }
                
            },
            imgOkCallback(files, operationType, index) {
                if(isWeiXin() || isMhApp()){
                    if(files[0].url == undefined){
                        files[0].url = "/checkJpg/" + this.cardUrl.substr(0, 2) + "/" + this.companyId + this.cardUrl + "HR.jpg?v="+new Date().getTime()
                    }
                }
                this.files = files
                this.formData.headImg = files[0].url
            },
            getCurDate(){
                let dateObj = new Date(); //表示当前系统时间的Date对象
                let year = dateObj.getFullYear(); //当前系统时间的完整年份值
                let month = dateObj.getMonth()+1; //当前系统时间的月份值
                let date = dateObj.getDate(); //当前系统时间的月份中的日
                let day = dateObj.getDay(); //当前系统时间中的星期值
                let weeks = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
                let week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
                let hour = dateObj.getHours(); //当前系统时间的小时值
                let minute = dateObj.getMinutes(); //当前系统时间的分钟值
                let second = dateObj.getSeconds(); //当前系统时间的秒钟值
                //如果月、日、小时、分、秒的值小于10，在前面补0
                if(month<10){
                    month = "0"+month;
                }
                if(date<10){
                    date = "0"+date;
                }
                if(hour<10){
                    hour = "0"+hour;
                }
                if(minute<10){
                    minute = "0"+minute;
                }
                if(second<10){
                    second = "0"+second;
                }
                return {
                    nyr:year+"-"+month+"-"+date,
                    sfm:hour+":"+minute+":"+second,
                    week:week
                }
            },
            validateForm(data){
                if(data.headImg == "" || data.headImg == undefined){
                    this.$vux.toast.text("头像不能为空!", 'bottom')
                    return false
                }
                if(data.userName == "" || data.userName == undefined){
                    this.$vux.toast.text("请输入姓名!", 'bottom')
                    return false
                }
                if(data.sex == "" || data.sex == undefined){
                    this.$vux.toast.text("请选择性别!", 'bottom')
                    return false
                }
                if(data.dateOfBirth == "" || data.dateOfBirth == undefined){
                    this.$vux.toast.text("请选择生日!", 'bottom')
                    return false
                }
               
                if(data.IDNumberType == "" || data.IDNumberType == undefined){
                    this.$vux.toast.text("请选择证件类型!", 'bottom')
                    return false
                }
                if(data.IDNumber == "" || data.IDNumber == undefined){
                    this.$vux.toast.text("请选择证件号码!", 'bottom')
                    return false
                }else{
                    let value = data.IDNumber
                    if (data.IDNumberType == "护照") {
                        var re1 = /^[a-zA-Z]{5,17}$/
                        var re2 = /^[a-zA-Z0-9]{5,17}$/
                        if(!re2.test(value) || !re1.test(value)){
                            this.$vux.toast.text("请输入正确证件号码!", 'bottom')
                            return false
                        }
                    }else if(data.IDNumberType == "居民身份证"){
                        let status = false
                        var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

                        //如果通过该验证，说明身份证格式正确，但准确性还需计算
                        if (regIdCard.test(value)) {
                            if (value.length == 18) {
                                var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
                                var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
                                var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
                                for (var i = 0; i < 17; i++) {
                                    idCardWiSum += value.substring(i, i + 1) * idCardWi[i];
                                }

                                var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
                                var idCardLast = value.substring(17);//得到最后一位身份证号码

                                //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
                                if (idCardMod == 2) {
                                    if (idCardLast == "X" || idCardLast == "x") {
                                        // alert("恭喜通过验证啦！");
                                        status = true
                                    } else {
                                        // alert("身份证号码错误！");
                                        status = false
                                    }
                                } else {
                                    //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                                    if (idCardLast == idCardY[idCardMod]) {
                                        //alert("恭喜通过验证啦！");
                                        status = true
                                    } else {
                                        // alert("身份证号码错误！");
                                        status = false
                                    }
                                }
                            }else{
                                status = false
                            }
                        } else {
                            //alert("身份证格式不正确!");
                            status = false
                        }
                        if(!status){
                            this.$vux.toast.text("请输入正确证件号码!", 'bottom')
                            return false
                        }
                    }else if(data.IDNumberType == "港澳居民来往内地通行证"){
                        let re = /^[HMhm]{1}([0-9]{10}|[0-9]{8})$/
                        if(!re.test(value)){
                            this.$vux.toast.text("请输入正确证件号码!", 'bottom')
                            return false
                        }
                    }else if(data.IDNumberType == "台湾居民来往大陆通行证"){
                        var re1 = /^[0-9]{8}$/;
                        var re2 = /^[0-9]{10}$/;
                        if(!re2.test(value) || !re1.test(value)){
                            this.$vux.toast.text("请输入正确证件号码!", 'bottom')
                            return false
                        }
                    }
                }
                if(data.nation == "" || data.nation == undefined){
                    this.$vux.toast.text("请选择民族!", 'bottom')
                    return false
                }
                if(data.placeOfOrigin == "" || data.placeOfOrigin == undefined){
                    this.$vux.toast.text("请输入籍贯!", 'bottom')
                    return false
                }
                if(data.accountLocation == undefined || data.accountLocation == ""){
                    this.$vux.toast.text("请输入户口所在地!", 'bottom')
                    return false
                }
                if(data.maritalStatus == "" || data.maritalStatus == undefined){
                    this.$vux.toast.text("请选择婚姻状况!", 'bottom')
                    return false
                }
                if(data.politicalOutlook == "" || data.politicalOutlook == undefined){
                    this.$vux.toast.text("请选择政治面貌!", 'bottom')
                    return false
                }
                if(data.education == "" || data.education == undefined){
                    this.$vux.toast.text("请选择学历!", 'bottom')
                    return false
                }
                if(data.graduateInstitutions == "" || data.graduateInstitutions == undefined){
                    this.$vux.toast.text("请选择毕业院校!", 'bottom')
                    return false
                }
                if(data.joinThisUnitTime == "" || data.joinThisUnitTime == undefined){
                    this.$vux.toast.text("请选择入职时间!", 'bottom')
                    return false
                }
                if(data.telPhone == undefined || data.telPhone == ""){
                    this.$vux.toast.text("请输入手机号!", 'bottom')
                    return false
                }else{
                    let mobile = /^[1][3,4,5,7,8][0-9]{9}$/
                    let status = mobile.test(data.telPhone)
                    if(!status){
                        this.$vux.toast.text("请输入正确手机号码!", 'bottom')
                        return false
                    }
                }
                if(data.email){
                    let email = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
                    let status = email.test(data.email)
                    if(!status){
                        this.$vux.toast.text("请输入正确邮箱地址!", 'bottom')
                        return false
                    }
                }
                if(data.qqNumber){
                    let qqNumber = /^[1-9]\d{4,12}$/
                    let status = qqNumber.test(data.qqNumber)
                    if(!status){
                        this.$vux.toast.text("请输入正确QQ号码!", 'bottom')
                        return false
                    }
                }
                if(data.weChatNumber){
                    let weChatNumber = /[a-zA-Z]{1}[-_a-zA-Z0-9]{5,20}$/
                    let status = weChatNumber.test(data.weChatNumber)
                    if(!status){
                        this.$vux.toast.text("请输入正确微信号!", 'bottom')
                        return false
                    }
                }
                if(data.homePhone == undefined || data.homePhone == ""){
                    this.$vux.toast.text("请输入家庭电话!", 'bottom')
                    return false
                }else{
                    let mobile = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/
                    let tel = /^(^0\d{2}-?\d{8}$)|(^0\d{3}-?\d{7}$)|(^\(0\d{2}\)-?\d{8}$)|(^\(0\d{3}\)-?\d{7}$)$/
                    let shouji = /^[1][3,4,5,7,8][0-9]{9}$/
                    let status = tel.test(data.homePhone) || mobile.test(data.homePhone) || shouji.test(data.homePhone)
                    if(!status){
                        this.$vux.toast.text("请输入正确家庭电话!", 'bottom')
                        return false
                    }
                }
                if(data.homeZipCode == undefined ||　data.homeZipCode == ""){
                    this.$vux.toast.text("请输入家庭邮编!", 'bottom')
                    return false
                }else{
                    let homeZipCode =   /^[0-9][0-9]{5}$/
                    let status = homeZipCode.test(data.homeZipCode)
                    if(!status){
                        this.$vux.toast.text("请输入正确邮编地址!", 'bottom')
                        return false
                    }
                }
                if(data.homeAddress == undefined || data.homeAddress == ""){
                    this.$vux.toast.text("请输入家庭地址!", 'bottom')
                    return false
                }
                return true
            }
        }
    }
</script>
<style lang="stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

    .status_name .weui-cell__ft {
        background-color: #FCDAD4;
        color: #F2725E;
        border-radius: 5px;
        padding: 3px;
    }
    .basicInfo {
        .image-picker-wrapper {
            flex-center(row, center, center)
            .ei-image-picker .flex-item {
                width 80px
                height 80px
                margin-left 0
            }
        }   
        
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .hr_title{
        color: #ff8000;
        font-weight: bold;
    }
    .span_title{
        color: #D81E06;
    }
    .popover-demo-content {
      padding: 5px 10px;
    }
    .headImgDiv {
        margin-top: 10px;
        margin-bottom: 10px;
        text-align:center;
    }
    .headImg {
        background-color: #FFF;
        padding: 4px;
        display: inline-block;
        width: 80px;
        height: 80px;
    }
    .sex{
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
   
</style>
