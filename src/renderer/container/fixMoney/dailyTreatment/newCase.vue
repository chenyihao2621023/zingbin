<template>
    <div class="newcase">
        <ZingHead title="新建方案"></ZingHead>

        <x-input title="方案名称" v-model="caseName" placeholder="请输入方案名称"></x-input>

        <div class="content">
            <div class="vue-tab">
                <tab class="" :line-width="2">
                    <tab-item :selected="defaultTab === item" v-for="(item, index) in tabTitle" :key="index" @on-item-click="changeTab">{{item}}</tab-item>
                </tab>
            </div>
            <div class="tab-content">
                <div class="tabDiv" v-show="show1">
                    <new-case-one
                        @PickedData="PickedData"
                        :original = "original"
                    ></new-case-one>
                </div>
                <div class="tabDiv" v-show="show2">
                    <new-case-two
                        @PickedData="discountPickedData"
                        :accumulated = "accumulated"
                    ></new-case-two>
                </div>
                <div class="tabDiv" v-show="show3">
                    <new-case-three
                        @PickedData="downPickedData"
                        :impairment = "impairment"
                    ></new-case-three>
                </div>
            </div>
        </div>

        <div>
            <flexbox class="inner">
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-save" @click.native="cancle">取消</x-button>
                </flexbox-item>
                <flexbox-item class="interspace">
                    <x-button type="primary" class="btn-common" @click.native="confirm()">确定</x-button>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
    import ZingHead from "components/zingHead/ZingHead.vue";
    import newCaseOne from "../template/newCaseOne";
    import newCaseTwo from "../template/newCaseTwo";
    import newCaseThree from "../template/newCaseThree";
    import { Tab, TabItem,XInput,Group,XButton,Flexbox,FlexboxItem  } from 'vux'
    export default {
        name: "new-case",
        components:{
            ZingHead,
            newCaseOne,
            newCaseTwo,
            newCaseThree,
            Tab,
            TabItem,
            XInput,
            Group,
            XButton,
            Flexbox,
            FlexboxItem
        },
        data() {
            return {
                caseName:"",
                tabTitle: ["固定资产原值科目", "累计折旧科目","减值准备科目"],
                show1:true,
                show2:false,
                show3:false,
                defaultTab:"固定资产原值科目",
                param1:[],
                original:[],
                param2:[],
                accumulated:[],
                param3:[],
                impairment:[],
                params:{},
                url:"",
                selectData:{}
            }
        },
        created() {
           if (this.$route.query.handle === "update") {
               this.select()
           }
        },
        methods:{
            changeTab(index) {
                if (index === 0) {
                    this.show1 = true
                    this.show2 = false
                    this.show3 = false
                } else if (index === 1) {
                    this.show1 = false
                    this.show2 = true
                    this.show3 = false
                } else if (index === 2) {
                    this.show1 = false
                    this.show2 = false
                    this.show3 = true
                }
            },
            //固定资产科目
            PickedData(item) {
                this.param1 = item
            },
            //累计折旧科目
            discountPickedData(item) {
                this.param2 = item
            },
            //减值准备科目
            downPickedData(item) {
                this.param3 = item
            },
            //提交
            confirm() {
                if (this.caseName === "") {
                    this.$vux.toast.text("请输入方案名称")
                    return
                }
                if (this.param1.length === 0 || this.param2.length === 0 || this.param3.length === 0) {
                    this.$vux.toast.text("请增加科目")
                    return
                } else {
                    let params = {}
                    if (this.$route.query.handle === "add") {
                        this.url = "/zingbiz/fixedAssets/schemeSetting/insert"
                        params.type = this.$route.query.type
                    } else if (this.$route.query.handle === "update") {
                        this.url = "/zingbiz/fixedAssets/schemeSetting/update"
                    }
                    //提交成功后返回上一页
                    params.name = this.caseName
                    if (this.param1.length === 1) {
                        params.originalSubjects = this.param1[0].fileId
                    } else {
                        this.param1.forEach((val,index) => {
                            if (index === 0) {
                                params.originalSubjects = val.fileId
                            } else {
                                params.originalSubjects += " " + val.fileId
                            }

                        })
                    }
                    if (this.param2.length === 1) {
                        params.accumulatedSubjects = this.param2[0].fileId
                    } else {
                        this.param2.forEach((val,index) => {
                            if (index === 0) {
                                params.accumulatedSubjects = val.fileId
                            } else {
                                params.accumulatedSubjects += " " + val.fileId
                            }

                        })
                    }
                    if (this.param3.length === 1) {
                        params.impairmentSubjects = this.param3[0].fileId
                    } else {
                        this.param3.forEach((val,index) => {
                            if (index === 0) {
                                params.impairmentSubjects = val.fileId
                            } else {
                                params.impairmentSubjects += " " + val.fileId
                            }

                        })
                    }

                    if (this.$route.query.id) {
                        params.id = this.$route.query.id
                    }
                    this.$http.post(this.url,params).then((res) => {
                        if (res.data.success) {
                            let that = this
                            window.setTimeout(function () {
                                that.$vux.toast.text("保存成功")
                                that.$router.go(-1)
                            },2000)
                        } else {
                            this.$vux.toast.text(res.data.msg)
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                }
            },
            //取消
            cancle() {
                this.$router.go(-1)
            },
            //数据查询
            select() {
                this.$http.get("/zingbiz/fixedAssets/schemeSetting/select",{
                    params:{
                        id:this.$route.query.id,
                        type:this.$route.query.type
                    }
                }).then((res) => {
                    this.selectData = res.data.data
                    let arr1 = this.selectData[0].originalSubjects.split(" ")
                    let arr2 = this.selectData[0].accumulatedSubjects.split(" ")
                    let arr3 = this.selectData[0].impairmentSubjects.split(" ")
                    this.selectData[0].originalSubjectsName.split(" ").forEach((val,index) => {
                        this.original.push({
                            fileId:arr1[index],
                            filename:val.split("-")[1]
                        })
                    })
                    this.selectData[0].accumulatedSubjectsName.split(" ").forEach((val,index) => {
                        this.accumulated.push({
                            fileId:arr2[index],
                            filename:val.split("-")[1]
                        })
                    })
                    this.selectData[0].impairmentSubjectsName.split(" ").forEach((val,index) => {
                        this.impairment.push({
                            fileId:arr3[index],
                            filename:val.split("-")[1]
                        })
                    })
                    this.param1 = this.original
                    this.param2 = this.accumulated
                    this.param3 = this.impairment
                    this.caseName = this.selectData[0].name
                })
            }
        }
    }
</script>
<style>
   .newcase .vux-tab{
        background-color: rgb(245,245,245);
    }
   .newcase .weui-cell__hd:before{
       content: "*";
       display: inline-block;
       position: absolute;
       left: 70px;
       color: rgba(255, 128, 0, 1) !important;
   }
</style>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .newcase{
        height 100%
        .content{
            height calc(100% - 134px)
            .tab-content{
                height calc(100% - 44px)
                .tabDiv{
                    height 100%
                }
            }
        }

    }
    .interspace{
        margin-left 0px !important
    }
</style>
