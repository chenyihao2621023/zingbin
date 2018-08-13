<template>
    <el-dialog :title="title" :visible.sync="visible" append-to-body width="40%">
        <el-form :rules="rules" size="small" ref="form" :model="form" v-loading="loading" :label-position="'right'"
                 label-width="100px">
            <el-row style="margin-bottom: 5px">
                <el-col :span="itemWidth">
                    <el-form-item label="姓名" prop="contactsName">
                        <el-input v-model="form.contactsName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-radio-group v-model="form.gender">
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="手机" prop="telPhone">
                        <el-input v-model="form.telPhone" @blur="checkTel"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="itemWidth" class="headImg">
                    <el-upload class="avatar-uploader" :show-file-list="false"
                        action="/zingbiz/common/UploadFile/uploadFile.action"
                               :headers="setHeader"
                        :on-success="uploadSuccess" :before-upload="beforeUpload">
                        <img v-if="form.contactsPhoto" :src="form.contactsPhoto" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="itemWidth">
                    <el-form-item label="固定电话" prop="landLine">
                        <el-input v-model="form.landLine"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="itemWidth">
                    <el-form-item label="传真" prop="faxNo">
                        <el-input v-model.number="form.faxNo"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="itemWidth">
                    <el-form-item label="证件类型" prop="idCardType">
                        <el-select v-model="form.idCardType" placeholder="请选择证件类型">
                            <el-option :label="card" :value="card" v-for="card in cardTypes" :key="card"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="itemWidth">
                    <el-form-item label="证件号" prop="idCard">
                        <el-input v-model="form.idCard" @blur="checkIdCard"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <!--<el-row>-->
            <!--<el-col :span="itemWidth">-->
            <!--<el-form-item label="证件有效期" prop="you">-->
            <!--<el-date-picker v-model="form.you" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">-->
            <!--</el-date-picker>-->
            <!--</el-form-item>-->
            <!--</el-col>-->
            <!--<el-col :span="itemWidth">-->
            <!--</el-col>-->
            <!--</el-row>-->
            <el-row>
                <el-col :span="itemWidth">
                    <el-form-item label="出生日期" prop="birthday">
                        <el-date-picker v-model="form.birthday" :picker-options="disableTime" type="date"
                                        value-format="yyyy-MM-dd" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="itemWidth">
                    <el-form-item label="国籍" prop="nationality">
                        <el-input v-model="form.nationality"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="itemWidth">
                    <el-form-item label="民族" prop="nation">
                        <el-input v-model="form.nation"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="itemWidth">
                    <el-form-item label="籍贯" prop="hometown">
                        <el-input v-model="form.hometown"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="itemWidth">
                    <el-form-item label="地址" prop="address">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="itemWidth">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="itemWidth">
                    <el-form-item label="微信" prop="weChat">
                        <el-input v-model="form.weChat"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="itemWidth">
                    <el-form-item label="QQ" prop="qq">
                        <el-input v-model="form.qq"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>

                <el-col :span="itemWidth">
                    <el-form-item label="公司" prop="companyName">
                        <el-input v-model="form.companyName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="itemWidth">
                    <el-form-item label="车牌号" prop="plateNumber">
                        <el-input v-model="form.plateNumber"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="itemWidth">
                    <el-form-item label="爱好" prop="hobby">
                        <el-input v-model="form.hobby"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="itemWidth">
                    <el-form-item label="特殊要求" prop="specialRequire">
                        <el-input v-model="form.specialRequire"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="footer">
            <span>
                  <el-button type="primary" @click="scanIDCard" size="small">扫身份证</el-button>
            &nbsp;<el-button v-if="showSelectBtn" type="primary" @click="selectPerson" size="small">选择外联人</el-button>
            </span>
            <span>
                <el-button @click="cancel" size="small">取 消</el-button>
                <el-button type="primary" @click="confirmSubmit" size="small">确 定</el-button>
            </span>
        </div>
    </el-dialog>
</template>
<script>
    import ImagePicker from "components/imagepicker/ImagePicker";
    import NatAppHelper from "@/utils/nativeAppHelper";

    export default {
        name: "ExternalManAdd",
        components: {
            ImagePicker
        },
        props: {
            append: {
                type: Boolean,
                default: false
            },
            show: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: "编辑外联人"
            },
            form: {
                type: Object,
                default: function () {
                    return {
                        contactsPhoto: "",
                        contactsName:"",
                        gender:"",
                        telPhone:"",
                        landLine:"",
                        faxNo:"",
                        idCardType:"",
                        idCard:"",
                        birthday:"",
                        nationality:"",
                        nation:"",
                        hometown:"",
                        address:"",
                        email:"",
                        weChat:"",
                        qq:"",
                        companyName:"",
                        plateNumber:"",
                        hobby:"",
                        specialRequire:"",
                    };
                }
            },
            //该按钮控制器为开启调用选人组件的功能,,但该组件本身不引用选人组件,(避免组件互相引用)
            // 如果开启该功能,页面需同时引用该组件(ExternalManAdd)和选人组件(ExternalMan),,
            // 该按钮用于通知外部,调用选人组件
            showSelectBtn:{
                type: Boolean,
                default: function () {
                    return false;
                }
            }
        },
        data() {
            let checkTelphone = (rule, value, callback) => {
                let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (
                    !Number.isInteger(Number(value)) ||
                    !value.trim() ||
                    !reg.test(value)
                ) {
                    return callback(new Error("请输入正确电话号码"));
                }
                callback();
            };
            return {
                imageList: [],
                dialogImageUrl: "",
                dialogVisible: false,
                itemWidth: 11,
                cardTypes: [
                    "居民身份证",
                    "户口薄",
                    "港澳通行证",
                    "台湾通行证",
                    "护照",
                    "驾驶证",
                    "警官证",
                    "军官证",
                    "士兵证",
                    "其他"
                ],
                rules: {
                    contactsName: [
                        { required: true, message: "请输入外联人姓名", trigger: "blur" }
                    ],
                    // telPhone: [
                    //   { required: true, validator: checkTelphone, trigger: "blur" }
                    // ]
                },
                visible: false,
                loading: false,
                loadingInstance: null,
                disableTime: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                }
            };
        },
        computed:{
            setHeader(){
                let header = {};
                if (!PSMU.isEmtVal(PSMU.token)) {
                    header[PSMU.tokenName] = PSMU.token
                }
                return header;
            },
        },
        watch: {
            show: function () {
                if (this.show) {
                    this.visible = true;
                } else {
                    this.visible = false;
                    this.$refs.form.resetFields();
                }
            },
            visible: function () {
                if (!this.visible) {
                    this.cancel();
                }
            }
        },
        methods: {
            checkTel(e) {
                let value = e.target.value;
                if (!value) {
                    return;
                }
                let reg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!Number.isInteger(Number(value)) || !value.trim() || !reg.test(value)) {
                    this.$message.error('请输入正确电话号码');
                    return;
                }
            },
            checkIdCard(e) {
                if (this.form.idCardType !== "居民身份证") {
                    return;
                }
                let value = e.target.value;
                let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                if (!value.trim() || reg.test(value) === false) {
                    this.$message.error('身份证号格式不对');
                    return;
                }
            },
            selectPerson() {
                this.$emit("usePersonSelect",true);
            },
            //图片上传
            uploadSuccess(response, file, fileList) {
                console.log("on",response,file,fileList);
                if (response.success) {
                    this.$set(this.form,"contactsPhoto",response.data.relativePath);
                    // this.form.contactsPhoto = response.data.relativePath;
                }
            },
            beforeUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isLt2M;
            },
            handleRemove(file, fileList) {
                console.log("remove", file, fileList);
                this.form.contactsPhoto = "";
            },

            cancel() {
                this.$emit("cancel");
            },
            confirmSubmit() {
                let self = this;
                this.$refs.form.validate(valid => {
                    if (valid) {
                        self.loadingInstance = self.$loading({});
                        // let url = "/zingbiz/hotel/hotelNew/saveHotelContacts";
                        let url =
                            "/zingbiz/ExternalContacts/ExternalContactsRest/addExternalContacts";
                        if (self.form.contactsId) {
                            url =
                                "/zingbiz/ExternalContacts/ExternalContactsRest/updateExternalContacts";
                        }
                        self.form["contactsLevel"] = "一般";
                        self.form["contactsState"] = "成交";
                        self.form["contactsType"] = "酒店客户";

                        //处理表单属性，去掉值为空的属性,,提交为空的,会导致es保存不成功
                        for (let key in self.form) {
                            if (!self.form[key]) {
                                delete self.form[key];
                            }
                        }
                        self.$httpSilent
                            .post(url, self.form)
                            .then(res => {
                                self.loadingInstance.close();
                                if (res.data.success) {
                                    self.$emit("callback",res.data.data);
                                } else {
                                    self.$message({ type: "error", message: "保存失败，请重试" });
                                }
                        });
                    }
                });
            },
            scanIDCard() {
                let self = this;
                NatAppHelper.readIdCard("192.168.1.101", data => {
                    console.log("idcard", data);
                    if (data.code === 1) {
                        this.$set(this.form, "contactsName", data.data["姓名"]); // fix bug 数据无法绑定 需要给绑定的Form一个触发点即可，不必全部$set
                        this.form.contactsName = data.data["姓名"];
                        this.form.nation = data.data["民族"];
                        this.form.address = data.data["住址"];
                        this.form.idCard = data.data["公民身份号码"];
                        this.form.idCardType = "居民身份证";
                        if (data.data["性别"] === "男") {
                            this.form.gender = "1";
                        } else {
                            this.form.gender = "2";
                        }
                        this.form.birthday = data.data["出生"];

                        //根据证件号请求人员数据
                        let param = {
                            pageNumber: 1,
                            pageSize: 1,
                            idCard:data.data["公民身份号码"],
                            idCardType:"居民身份证"
                        };
                        self.loadingInstance = self.$loading({});
                        self.$httpSilent
                            .get("/zingbiz/hotel/hotelNew/getContactsList", { params :param })
                            .then(res => {
                                self.loadingInstance.close();
                                if (res.data.success) {
                                    if (parseInt(res.data.data.total) === 1) {
                                        self.form = Object.assign({},res.data.data.data[0],this.form);
                                    }
                                }
                            });
                    } else {
                        this.$message({ type: "error", message: "扫描失败" });
                    }
                });
            }
        }
    };
</script>
<style>
    .el-dialog__body{
        padding:10px;
    }
</style>
<style scoped>
    .el-input {
        width: auto;
    }

    .el-row {
        margin-bottom: 15px;
    }
    .footer{
        display: flex;
        justify-content: space-between;
    }
    .headImg {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }
    .avatar-uploader {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 150px;
        line-height: 150px;
        text-align: center;
    }
    .avatar {
        width: 150px;
        height: 150px;
        display: block;
    }
</style>


