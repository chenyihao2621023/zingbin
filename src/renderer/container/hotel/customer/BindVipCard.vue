<template>
    <el-dialog :title="title" :visible.sync="visible" width="40%" append-to-body>
        <ul class="vipBind">
            <li>
                <span style="font-weight: 700">外联人基本信息</span>
            </li>
            <li>
                <span>姓名：{{outreach.contactsName}}</span>
                <span>性别：{{outreach.gender}}</span>
                <span>手机：{{outreach.telPhone}}</span>
            </li>
            <li>
                <span>证件类型：{{outreach.idCardType}}</span>
                <span>证件号：{{outreach.idCard}}</span>
            </li>
        </ul>
        <ul class="vipBind">
            <li>
                <span style="font-weight: 700">会员基本信息  <span v-if="((outreach.isVip === '0') || (outreach.isVip === undefined))" style="color: red;margin-left: 3px">未绑定</span></span>
            </li>
            <li>
                <span>会员名称：{{vipData.useName}}</span>
                <span>会员卡ID：{{vipData.memberId}}</span>
                <span>会员卡等级：{{vipData.memberName}}</span>
            </li>
            <li>
                <span>手机号：{{vipData.useTel}}</span>
                <span>可用余额：{{vipData.amount}}</span>
                <span>可用积分：{{vipData.point}}</span>
            </li>
        </ul>
        <div slot="footer" class="dialog-footer">
            <div>
                <el-button v-if="((outreach.isVip === '0') || (outreach.isVip === undefined))" type="primary" size="small" @click="showVipCardList = true">绑定会员</el-button>
                <el-button v-else-if="outreach.isVip === '1'" type="primary" size="small" @click="showVipCardList = true">修改绑定</el-button>
                <el-button :disabled="((outreach.isVip === '0') || (outreach.isVip === undefined))" size="small" @click="unbindVipCard">解除绑定</el-button>
            </div>
            <div>
                <el-button type="primary" size="small" @click="sureBindVip" :disabled="(vipData.useName === '' || vipData.useName === undefined)">确定</el-button>
                <el-button size="small" @click="visible = false">取消</el-button>
            </div>
        </div>

        <vip-card-list :show="showVipCardList" @cancel="showVipCardList = false" @callback="BindVipData"></vip-card-list>

    </el-dialog>
</template>

<script>
    import VipCardList from './VipCardList.vue'

    export default {
        components: {
            VipCardList
        },
        props:{
            outreach:{},
            show: {
                type: Boolean,
                default: false
            },
            title:{
                type:String,
            }
        },
        data() {
            return {
                visible:false,
                showVipCardList:false,
                vipData:{},
            }
        },
        watch: {
            show: function () {
                if (this.show) {
                    this.visible = true;
                } else {
                    this.visible = false;
                }
            },
            visible: function () {
                if (!this.visible) {
                    this.cancel();
                }
            }
        },
        mounted() {
            this.initVipInfo();
        },
        methods: {
            initVipInfo() {
                if (this.outreach.isVip === "1") {
                    let url = '/zingbiz/member/memberService/loadMemberCard';
                    let param =  {
                        pageNumber: 1,
                        pageSize: 999,
                    };
                    this.$http
                        .post(url, param)
                        .then((res) => {
                            if (res.data.success) {
                                this.tableData = res.data.data.data;
                                this.tableData.forEach((item,index) => {
                                    if (item.memberId === this.outreach.memberId) {
                                        this.vipData = item
                                    }
                                })
                            }
                        })
                        .catch(() => {
                            this.$message({ type: "error",info:"会员列表加载失败，请刷新重试！" })
                        })
                }
            },
            sureBindVip() {
                let url = "/zingbiz/hotel/hotelNew/saveMemberId";
                let params = {
                    contactsId:this.outreach.contactsId,
                    isVip: "1",
                    memberId:this.vipData.memberId,
                    useName:this.vipData.useName
                };
                this.loadingInstance = this.$loading({});
                this.$httpSilent
                    .get(url,{ params:params })
                    .then(() => {
                        this.loadingInstance.close();
                        this.$emit("IsInitData");
                        this.visible = false;
                        this.$message({ type: "success", message: "恭喜会员绑定成功！" });
                    })
                    .catch(() => {
                        this.$message({ type: "error", message: "绑定失败，请重试！" });
                    })
            },
            cancel() {
                this.$emit("cancel");
            },
            BindVipData(data) {
                this.vipData = data;
                this.showVipCardList = false;
            },
            unbindVipCard() {
                this.$confirm("是否要解除此会员卡绑定?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        let url = "/zingbiz/hotel/hotelNew/saveMemberId";
                        let params = {
                            contactsId:this.outreach.contactsId,
                            isVip: "0",
                            memberId:this.vipData.memberId,
                            useName:this.vipData.useName
                        };
                        this.loadingInstance = this.$loading({});
                        this.$httpSilent
                            .get(url,{ params:params })
                            .then(() => {
                                this.loadingInstance.close();
                                this.$emit("IsInitData");
                                this.visible = false;
                                this.$message({ type: "success", message: "会员解绑成功！" });
                            })
                            .catch(() => {
                                this.$message({ type: "error", message: "绑定失败，请重试！" });
                            })
                    })
                    .catch(() => {
                        this.$message({ type: "info", message: "已取消解除" });
                    });
            },
        }
    }
</script>
<style scoped lang="stylus">
    .vipBind {
        border: 1px solid #f5f5f5;
        li{
            display:flex;
            margin: 20px 10px;
            span{
                flex:1;
            }
        }
    }
    .dialog-footer {
        display:flex;
        justify-content:space-between;
    }
</style>
