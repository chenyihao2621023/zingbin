<template>
    <div class="outwrapper">
        <ZingHead title="编辑现金流量"></ZingHead>
        <div class="editItem">
            <group>
                <x-input title="代码" class="fileId" v-model="fileId" :disabled="disabled"></x-input>
                <x-input title="名称" placeholder="请输入代码" class="text" v-model="text"></x-input>
                <x-input title="助记码" placeholder="请输入助记码" class="mnemonicCode" v-model="mnemonicCode"></x-input>

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
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import SubjectPicker from "@/components/subjectpicker/SubjectPicker";
    import { Group,XInput,XTextarea,Selector,Flexbox,FlexboxItem,XButton } from 'vux'
    export default {
        name: "castFlowEditer",
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
                fileId:"",
                text:"",
                mnemonicCode:"",
                disabled:false,
                parentId:'',

            }
        },
        created() {
            this.checkChangeModeConfigurationUsing()
            this.fileId = this.$route.query.fileId

        },
        methods:{


            //取消
            cancle() {
                this.$router.go(-1)
            },
            confirm() {
                let codeArr = this.$route.query.fileId.split(".")
                let nowArr = this.fileId.split(".")
                let number =  this.fileId.split(".")[this.fileId.split(".").length - 1]
                let params = {}
                if (codeArr.length === nowArr.length) {
                    if (codeArr.slice(0,codeArr.length - 1).toString() !== nowArr.slice(0,nowArr.length - 1).toString()) {
                        this.$vux.toast.text("父级必须一致")
                        return
                    } else {
                        if (/^(?!0{3})\d{3}$/.test(number)) {
                            params.fileId = this.fileId
                        } else {
                            this.$vux.toast.text("请输入正确的代码格式")
                            return
                        }
                    }
                } else {
                    this.$vux.toast.text("请输入正确的代码格式")
                    return;
                }

                if (this.text) {
                    params.text = this.text
                } else {
                    this.$vux.toast.text("请输入名称")
                    return;
                }
                params.parentId=this.parentId;
                params.rowId = this.$route.query.id;
                params.pzType = "editer";
                //被使用和重复
                this.$http.post("/zingbiz/report/finance_report/updateCashFlowProject",params).then((res) => {
                    if (res.data.success) {
                        this.$vux.toast.text("修改成功")
                        this.$router.go(-1)
                    } else {
                        this.$vux.toast.text(res.data.mgs)
                    }
                })
            },
            //是否被使用
            checkChangeModeConfigurationUsing() {
                this.$http.post("/zingbiz/report/finance_report/getCashFlowProjectById",{
                    rowId:this.$route.query.id
                }).then((res) => {
                    //如果被使用了 就将代码和名字 disabled 变为true
                    this.fileId = res.data.data[0].fileId
                    this.text = res.data.data[0].text
                    this.mnemonicCode = res.data.data[0].mnemonicCode
                    this.parentId = res.data.data[0].parentId;
                    if (res.data.data[0].hasUsed === 'true') {
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
