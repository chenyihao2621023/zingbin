<template>
    <div>
        <el-dialog title="转账" :visible.sync="show" :before-close="handleClose" width="75%">
            <el-table :data="tableData" border max-height="450">
                <el-table-column prop="tradeTypeDesc" label="交易类型"></el-table-column>
                <el-table-column prop="businessItemDesc" label="交易详情"></el-table-column>
                <el-table-column prop="businessCounts" label="数量"></el-table-column>
                <el-table-column prop="amount" label="单价"></el-table-column>
                <el-table-column prop="roomNo" label="房号"></el-table-column>
                <el-table-column prop="note" label="备注"></el-table-column>
                <el-table-column prop="operaterCardUrlName" label="操作员"></el-table-column>
            </el-table>
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <div class="flex"><span>总计: <span style="color: red">{{totalMoney}}元</span></span></div>
                <input type="hidden" v-model="form.money">
                <el-form-item label="客户性质" prop="customerProperty">
                    <el-radio-group v-model="form.customerProperty" @change="changeType">
                        <el-radio label="1">个人</el-radio>
                        <el-radio label="2">团队</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="转账目标" prop="transferTarget">
                    <input type="hidden" v-model="form.transferTarget">
                    <el-button v-if="form.customerProperty==='1'" size="small" @click="selectRoomModal=true">选择房间</el-button>
                    <el-tag v-if="form.customerProperty==='1' && form.transferTarget.roomId" closable @close="closeTag(tag,index)">{{form.transferTarget.roomNo}}</el-tag>

                    <el-select v-model="form.transferTarget" v-if="form.customerProperty === '2'" clearable filterable remote :remote-method="getGroupByName" :loading="loadingForTeam" placeholder="请输入团队名称关键词">
                        <el-option v-for="item in groupData" :key="item.groupId" :label="item.groupName" :value="item.groupId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <span style="display: inline-block">
                         <el-input v-model="form.remark"></el-input>
                    </span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose" size="small">取 消</el-button>
                <el-button type="primary" @click="submit" size="small">确定</el-button>
            </div>
        </el-dialog>
        <div class="components">
            <select-check-in-room :title="'选择转账目标'" :show="selectRoomModal" @cancel="selectRoomModal=false"
                         @callback="getRoomInfoCallBack"></select-check-in-room>
        </div>
    </div>
</template>

<script>
    import SelectCheckInRoom from "../../components/selectCheckInRoom/SelectCheckInRoom";
    export default {
        name: "transfer-bill-item",
        components:{ SelectCheckInRoom },
        props:{
            show:{
                type:Boolean,
                default:false
            },
            roomId:{
                type:String,
                default:""
            },
            billItemList:{
                type:Array,
                default:[]
            },
            orderId:{
                type:String,
                default:""
            }
        },
        data() {
            return {
                visible:false,
                form:{
                    customerProperty:"1",
                    transferTarget:""
                },
                tableData:[],
                groupData:[],
                loadingForTeam:false,
                selectRoomModal:false,
                formRules:{
                    customerProperty:[{ required:true,message:"请选择客户性质",trigger:"blur" }],
                    transferTarget:[{ required:true,message:"请选择转账目标",trigger:"blur" }]
                },
                loadingInstance:null,
            }
        },
        computed:{
            totalMoney:function () {
                let money = 0;
                this.tableData.forEach(row => {
                    money += Number(row.amount) * Number(row.businessCounts);
                });
                this.form.money = Number(money).toFixed(2);
                return Number(money).toFixed(2);
            },
        },
        watch:{
            show:function(isShow) {
                this.visible = isShow;
                if (isShow) {
                    this.tableData = this.billItemList;
                } else {
                    this.tableData = [];
                    this.$refs.form.resetFields();
                }
            },
        },
        methods:{
            submit() {
                this.$refs.form.validate((valide) => {
                    if (valide) {
                        let self = this;
                        this.loadingInstance = this.$loading();
                        this.form.billItemList = this.tableData;
                        this.form.orderId = this.orderId;
                        let params = Object.assign({},this.form.transferTarget,this.form);
                        console.log("form",params);

                        let url = "/zingbiz/hotelNew/hotelBill/transferBillItem";
                        this.$httpSilent
                            .post(url,params)
                            .then(function(res) {
                                self.loadingInstance.close();
                                if (res.data.success) {
                                    self.$message({ type: "success", message: "转账成功" });
                                    self.$emit("confirm",true);
                                } else {
                                    self.$message({ type: "error", message: "转账失败" });
                                    self.$emit("confirm",false);
                                }
                            })
                            .catch(error => {
                                self.loadingInstance.close();
                                self.$message({ type: "error", message: "转账失败" });
                        })
                    }
                })
            },
            changeType() {
                this.form.transferTarget = "";
            },
            handleClose(done) {
                this.$emit("cancel",false);
            },
            getRoomInfoCallBack(val) {
                console.log("room",val);
                if (val.length) {
                    let room = val[0];
                    this.form.transferTarget = {
                        roomId:room.roomId,
                        roomNo:room.roomNo,
                        roomTypeId:room.roomTypeId,
                        roomTypeDesc:room.roomTypeDesc
                    };
                } else {
                    this.form.transferTarget = "";
                }

                this.selectRoomModal = false;
            },
            closeTag(val,index) {
                this.form.transferTarget = ""
            },
            getGroupByName (keyword) {
                let self = this;
                if (keyword) {
                    setTimeout(() => {
                        this.loadingForTeam = true;
                        let param = {
                            groupName: keyword,
                            pageSize:100,
                            pageNumber:1
                        };
                        let url = "/zingbiz/hotel/hotelNew/getHotelGroupInfo";
                        this.$httpSilent
                            .get(url, { params: param })
                            .then(res => {
                                self.loadingForTeam = false;
                                if (res.data.success) {
                                    console.log("froup",res.data);
                                    self.groupData = res.data.data;
                                } else {
                                    self.$message({ type: "error", message: "没有查到相关团队" });
                                }
                            })
                            .catch(() => {
                                self.loadingForTeam = false;
                                self.$message({ type: "error", message: "没有查到相关团队" });
                            });
                    }, 200);
                }
            },
        }
    }
</script>

<style scoped>
    .flex{
        display: flex;
        flex-direction: row-reverse;

    }
</style>
