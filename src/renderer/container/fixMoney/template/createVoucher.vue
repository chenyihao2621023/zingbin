<template>
    <div class="outWrapper">
        <ZingHead title="生成凭证" :isComeBack="isComeBack" v-on:doSome="back"></ZingHead>
        <div class="create-content">
            <p>
                一、为了灵活的生成卡片新增、变动、清理业务的凭证，本模块允许您选择多张单据，
                组合不同业务，同时生成凭证；而且您可以按各单据分别生成凭证，也可以汇总之后生成一张凭证
            </p>
            <p>
                二、在生成凭证之前，请确保各单据所需的凭证字、科目、核算项目等要素的正确性，以保证生成过程的正确性。
            </p>
            <p>
                三、必须先通过“方案设置”，统一设置“清理费用”和“残值收入”的对应科目。否则在生成凭证过程中，无法正常的执行操作。
            </p>
            <group class="commonList">
                <checklist :options="commonList" v-model="radioValue" :max="1" @on-change="change"></checklist>
                <div class="distance">
                    <checklist class="distance-disabled" v-show="no" :options="List" v-model="distance" disabled ></checklist>
                    <checklist :options="List" v-model="distance" v-show="yes"></checklist>
                </div>
            </group>

        </div>
        <div>
            <flexbox class="inner">
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-save" @click.native="cancel()">取消</x-button>
                </flexbox-item>
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-common" @click.native="next()">下一步</x-button>
                </flexbox-item>
            </flexbox>
        </div>


        <!--<confirm v-model="prompt"-->
                 <!--title="提示"-->
        <!--&gt;-->
            <!--<p style="text-align:center;">未设置残值收入或清理费用或减值准备的科目信息</p>-->
        <!--</confirm>-->
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import { Group,Checklist,Flexbox,FlexboxItem,XButton } from 'vux'
    export default {
        name: "create-voucher",
        components:{
            ZingHead,
            Checklist,
            Group,
            Flexbox,
            FlexboxItem,
            XButton
        },
        data() {
            return {
                isComeBack:false,
                commonList:[
                    "按单生成凭证",
                    "汇总生成凭证"
                ],
                List:[
                    "固定资产凭证分录分开列示"
                ],
                radioValue:["按单生成凭证"],
                distance:[],
                yes:false,
                no:true,
                single:0,
                prompt:false,
                summary:true,
            }
        },
        created () {
           // this.select()
        },
        methods:{
            change() {
                if (this.radioValue[0] === "汇总生成凭证") {
                    this.yes = true
                    this.no = false
                } else {
                    this.yes = false
                    this.no = true
                    this.distance = []
                }
            },
            cancel() {
                this.$emit("back")
            },
            next() {
                //需要进行方案设置 单选 多选
                if (this.no) {
                    this.single = 0
                } else {
                    this.single = 1
                }
                if (this.distance.length === 0) {
                    this.summary = true
                } else {
                    this.summary = false
                }
                //检查是否设置了设置方案
                this.$http.get("/zingbiz/fixedAssets/schemeSetting/select",{
                    params:{
                        type:"voucher"
                    }
                }).then((res) => {
                    if (res.data.success) {
                        if (res.data.data.length === 0) {
                            this.$vux.toast.text("请设置设置方案")
                            return
                        } else {
                            if (this.single === 0) {
                                this.$emit("next",this.single)
                            } else {
                                let params = {}
                                params.single = this.single
                                params.summary = this.summary
                                this.$emit("next",params)
                            }
                        }
                    } else {
                        this.$vux.toast.text(res.data.msg)
                    }

                })
            },
            back() {
                this.$emit("back")
            },
        }
    }
</script>
<style>
    .distance-disabled .weui-cells .weui-cell__bd{
        color: rgba(136, 136, 136, 1) !important;
        font-size: 16px;
        text-align: left;
        font-family: Arial;
    }
    .create-content .weui-cell:before{
        left: 0 !important;
        border:1px solid #f5f5f5 !important;

    }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .outWrapper{
        height 100%
        .create-content{
            height calc(100% - 109px)
        }
    }
    .distance{
        margin-left 13px
    }
    .commonList{
        padding-top 15px
    }
    .interspace{
        margin-left: 0px !important;
        text-align center
    }
    .create-content{
        margin-top 15px
        p{
            padding 0 13px
            line-height: 20px;
            color: rgba(16, 16, 16, 1);
            font-size: 14px;
            font-family: Arial;
            text-align justify
            text-indent 28px
            :last-child{
                padding-bottom 15px
            }
        }
    }
</style>
