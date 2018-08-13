<template>
    <div class="outwrapper">
        <ZingHead title="编辑变动方式"></ZingHead>
        <div class="editItem">
            <group>
                <x-input title="代码" class="code" v-model="code" :disabled="disabled"></x-input>
                <x-input title="名称" placeholder="请输入代码" class="name" v-model="name" :disabled="disabled"></x-input>
                <selector title="凭证字号" :options="accountNum" v-model="number" class="number"></selector>
                <x-textarea title="摘要 " placeholder="请输入摘要信息" :rows="2" v-model="Abstract" class="Abstract"></x-textarea>
                <div class="subject" @click="changeCode()">
                    <span class="subject-code">对方科目代码</span>
                    <span class="subject-choice">{{ckProjectName}}</span>
                </div>
            </group>
        </div>
        <div>
            <flexbox class="inner">
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-save" @click.native="cancle">取消</x-button>
                </flexbox-item>
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-common" @click.native="confirm">保存</x-button>
                </flexbox-item>
            </flexbox>
        </div>
        <!--选择科目代码-->
        <subject-picker :showPicker="showPicker" @picked="getPickedData" @abort="subjectAbort"></subject-picker>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import SubjectPicker from "@/components/subjectpicker/SubjectPicker";
    import { mapActions,mapState } from 'vuex'
    import { Group,XInput,XTextarea,Selector,Flexbox,FlexboxItem,XButton } from 'vux'
    export default {
        name: "new-style",
        components:{
            ZingHead,
            Group,
            XInput,
            XTextarea,
            Selector,
            Flexbox,
            FlexboxItem,
            XButton,
            SubjectPicker
        },
        data() {
            return {
                code:"",
                name:"",
                accountNum:[],
                number:"",
                Abstract:"",
                ckProjectName:"请选择科目代码",
                showPicker: false,
                ckProjectId:"",
                disabled:false

            }
        },
        computed:{
            ...mapState({
                voucherData: state => state.fixedAssets.voucherData,
            })
        },
        watch: {
            voucherData:{
                handler:function (newValue) {
                    this.accountNum = newValue
                },
                deep:true
            }
        },
        created() {
            this.checkChangeModeConfigurationUsing()
            this.code = this.$route.query.id
            // if (this.$route.query.id === "003") {
            //     this.disabled = true
            // }
            this.searchVoucher()
        },
        methods:{
            ...mapActions([
                'searchVoucher',
            ]),
            changeCode() {
                this.showPicker = true
            },
            subjectAbort() {
                this.showPicker = false;
            },
            //科目代码数据
            getPickedData(pickedData) {
                this.ckProjectId = pickedData.fileId;
                this.ckProjectName = pickedData.filename;
                this.showPicker = false;
            },
            //取消
            cancle() {
                this.$router.go(-1)
            },
            confirm() {
                let codeArr = this.$route.query.code.split(".")
                let nowArr = this.code.split(".")
                let number =  this.code.split(".")[this.code.split(".").length - 1]
                let params = {}
                if (codeArr.length === nowArr.length) {
                    if (codeArr.slice(0,codeArr.length - 1).toString() !== nowArr.slice(0,nowArr.length - 1).toString()) {
                        this.$vux.toast.text("父级必须一致")
                        return
                    } else {
                        if (/^(?!0{3})\d{3}$/.test(number)) {
                            params.code = this.code
                        } else {
                            this.$vux.toast.text("请输入正确的代码格式")
                            return
                        }
                    }
                } else {
                    this.$vux.toast.text("请输入正确的代码格式")
                    return;
                }

                if (this.name) {
                    params.name = this.name
                } else {
                    this.$vux.toast.text("请输入名称")
                    return;
                }
                if (this.number) {
                    params.voucherWord = this.number
                } else {
                    this.$vux.toast.text("请输入凭证字号")
                    return
                }
                if (this.Abstract) {
                    params.summary = this.Abstract
                } else {
                    this.$vux.toast.text("请输入摘要")
                    return
                }
                if (this.ckProjectName === "请选择科目代码") {
                    this.$vux.toast.text("请选择科目代码")
                    return
                } else {
                    params.subjectCode = this.ckProjectId
                }
                params.id = this.$route.query.id
                //被使用和重复
                this.$http.post("/zingbiz/fixedAssets/configuration/editChangeModeConfiguration",params).then((res) => {
                    if (res.data.success) {
                        this.$vux.toast.text("修改成功")
                        this.$router.go(-1)
                    } else {
                        this.$vux.toast.text(res.data.mgs)
                    }
                })
            },
            //是否被使用变动方式
            checkChangeModeConfigurationUsing() {
                this.$http.post("/zingbiz/fixedAssets/configuration/checkChangeModeConfigurationUsing",{
                    id:this.$route.query.id
                }).then((res) => {
                    //如果被使用了 就将代码和名字 disabled 变为true
                    this.code = res.data.data.data.code
                    this.name = res.data.data.data.name
                    this.number = res.data.data.data.voucherWord
                    this.Abstract = res.data.data.data.summary
                    this.ckProjectName = res.data.data.data.subjectName
                    this.ckProjectId = res.data.data.data.subjectCode
                    if (res.data.data.hasUsed) {
                        this.disabled = true
                    }
                })
            }
        }
    }
</script>
<style>
    .editItem .vux-x-textarea,.editItem .vux-selector {
        height: 44px !important;
    }
    .editItem .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;

    }
    .editItem .weui-cell__hd{
        color: rgba(16, 16, 16, 1);
        font-size: 16px !important;
        text-align: left;
        font-family: Arial;
    }
    .editItem .weui-cell__bd{
        font-family: Arial;
        color: rgba(136, 136, 136, 1) !important;
        font-size: 16px !important;
    }
    .editItem .weui-input::-webkit-input-placeholder,.editItem .weui-textarea::-webkit-input-placeholder{
        color: rgba(136, 136, 136, 1) !important;
        font-size: 16px;
        font-family: Arial;
    }
    .editItem .weui-select{
        color: rgba(136, 136, 136, 1) !important;
    }
    .editItem .name .weui-cell__hd:before,
    .editItem .code .weui-cell__hd:before,
    .editItem .number .weui-cell__hd:before,
    .editItem .Abstract .weui-cell__hd:before
    {
        content: "*";
        display: inline-block;
        position: absolute;
        left: 50px;
        color: rgba(255, 128, 0, 1) !important;
    }
    .editItem .number .weui-cell__hd:before{
        left: 80px;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height calc(100% - 50px)
    }
    .editItem{
        height calc(100% - 50px)
    }

    .interspace{
        margin-left: 0px !important;
        text-align center
        padding 5px 0
    }
    .interspace:last-child{
        border-left 1px solid #f5f5f5
        color #ff8000
    }
    .editItem{
        &-title{
            height 40px
            line-height 40px
            background-color white
            text-align center
        }
        .subject{
            position relative
            height 44px
            line-height 44px
            font-size: 14px !important;
            font-family: Arial;
            padding 0 13px
            border-top 1px solid #f5f5f5
            &-code{
                font-family: Arial;
            }
            &-choice{
                position absolute
                right 13px
                color: rgba(136, 136, 136, 1);
                font-size 14px
            }
        }
    }


    .subject-code:before{
        content: "*";
        display: inline-block;
        position: absolute;
        left: 100px;
        color: rgba(255, 128, 0, 1) !important;
    }
</style>
