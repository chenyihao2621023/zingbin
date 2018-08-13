<template>
    <div class="outwrapper">
        <ZingHead title="编辑使用状态"></ZingHead>
        <div class="mianUserState">
            <group>
                <x-input title="代码" class="code star" v-model="code" :disabled="disabled"></x-input>
                <x-input title="名称" class="name star" v-model="name" :disabled="disabled"></x-input>
                <div class="discount">
                    <span class="discount-title">是否计提折旧</span>
                    <span class="discount-content">
                        <span class="discount-changeY">
                        <span class="discount-changeY-icon" v-bind:style ="{ borderColor:defalueColor }" @click="DiscountY()">
                            <span :class="{radioed: discountYes }"></span>
                        </span>
                        <span class="discount-changeY-name">计提折旧</span>
                    </span>
                        <span class="discount-changeN">
                        <span class="discount-changeN-icon" v-bind:style ="{ borderColor:borderColor }" @click="DiscountN()">
                            <span :class="{radioed: discountNo }"></span>
                        </span>
                        <span class="discount-changeN-name">不提折旧</span>
                    </span>
                    </span>

                </div>
            </group>
        </div>
        <div>
            <flexbox class="inner">
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-save" @click.native="deleteItem">取消</x-button>
                </flexbox-item>
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-common" @click.native="save">保存</x-button>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Group,XInput,Flexbox,FlexboxItem,XButton } from 'vux'
    export default {
        name: "edit-use-state",
        components:{
            ZingHead,
            Group,
            XInput,
            XButton,
            FlexboxItem,
            Flexbox

        },
        data() {
            return {
                discountYes:true,
                discountNo:false,
                borderColor:"#c9c9c9",
                defalueColor:"#40affc",
                code:"",
                name:"正常使用",
                disabled:false
            }
        },
        created() {
            this.checkWorkingConditionConfigurationUsing()
            // if (this.$route.query.id === "003") {
            //     this.disabled = true
            // }
            // this.code = this.$route.query.item.code
            // this.name = this.$route.query.item.name
            // if (this.$route.query.item.enableDepreciation) {
            //     this.discountYes = true
            //     this.discountNo = false
            // } else {
            //     this.discountNo = true
            //     this.discountYes = false
            // }
        },
        methods:{
            DiscountY() {
                this.discountYes = true
                this.discountNo = false
                this.borderColor = "#c9c9c9"
                this.defalueColor = "#40affc"
            },
            DiscountN() {
                this.discountYes = false
                this.discountNo = true
                this.borderColor = "#40affc"
                this.defalueColor = "#c9c9c9"
            },
            deleteItem() {
                this.$router.go(-1)
            },
            save() {
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
                            //重复
                            params.name = this.code
                        } else {
                            this.$vux.toast.text("请输入正确的代码格式")
                            return
                        }
                    }
                } else {
                    console.log("hhhh")
                    this.$vux.toast.text("请输入正确的代码格式")
                    return;
                }


                if (this.name) {
                    params.name = this.name
                } else {
                    this.$vux.toast.text("请输入名称")
                    return;
                }
                if (this.discountYes) {
                    params.enableDepreciation = true
                } else {
                    params.enableDepreciation = false
                }
                params.id = this.$route.query.id
                //被使用和重复
                console.log("hhhh")
                this.$http.post("/zingbiz/fixedAssets/configuration/editWorkingConditionConfiguration",params).then((res) => {
                    if (res.data.success) {
                        this.$vux.toast.text("修改成功")
                        this.$router.go(-1)
                    } else {
                        this.$vux.toast.text(res.data.mgs)
                    }
                })
            },
            //是否被使用使用状态
            checkWorkingConditionConfigurationUsing() {
                this.$http.post("/zingbiz/fixedAssets/configuration/checkWorkingConditionConfigurationUsing",{
                    id:this.$route.query.id
                }).then((res) => {
                    //如果被使用了 就将代码和名字 disabled 变为true
                    console.log(res.data.data.data)
                    this.code = res.data.data.data.code
                    this.name = res.data.data.data.name
                    if (res.data.data.data.enableDepreciation) {
                        this.discountYes = true
                        this.discountNo = false
                    } else {
                        this.discountNo = true
                        this.discountYes = false
                    }
                    console.log(res.data.data)

                    if (res.data.data.hasUsed) {
                        this.disabled = true
                    }
                })
            }
        }
    }
</script>
<style>
    .mianUserState .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;
    }
    .mianUserState .weui-cell__hd{
        color: rgba(16, 16, 16, 1);
        font-size: 16px !important;
        text-align: left;
        font-family: Arial;
    }
    .mianUserState .weui-cell__bd{
        font-family: Arial;
        color: rgba(136, 136, 136, 1) !important;
        font-size: 16px !important;
    }
    .mianUserState .star .weui-cell__hd:before
    {
        content: "*";
        display: inline-block;
        position: absolute;
        left: 50px;
        color: rgba(255, 128, 0, 1) !important;
    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outwrapper{
        height 100%
        .discount {
            &-title{
                font-size 16px
            }
            font-size 16px
            position relative
            height 44px
            line-height 44px
            padding-left 13px
            border-top 1px solid #f5f5f5
            &-content{
                position absolute
                right 13px
            }
            &-changeY{
                margin-right 10px
                &-icon{
                    position relative
                    box-sizing: border-box;
                    display inline-block
                    width: 21px;
                    height: 21px;
                    background-color: #fff;
                    border: 1px solid #f5f5f5;
                    border-radius: 11px;
                }
            }
            &-changeN{
                &-icon{
                    position relative
                    box-sizing: border-box;
                    display inline-block
                    width: 21px;
                    height: 21px;
                    background-color: #fff;
                    border: 1px solid #f5f5f5;
                    border-radius: 11px;
                }
            }
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
    .interspace{
        margin-left: 0px !important;
        text-align center
        padding 5px 0
    }
    .mianUserState{
        height calc(100% - 100px)
    }
</style>
