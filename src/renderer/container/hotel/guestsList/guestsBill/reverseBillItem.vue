<template>
    <div>
        <el-dialog title="冲账" :visible.sync="show" :before-close="handleClose" width="75%">
            <el-table :data="form.billItemList" border max-height="450">
                <el-table-column prop="genTime" label="操作时间"></el-table-column>
                <el-table-column prop="tradeTypeDesc" label="交易类型"></el-table-column>
                <el-table-column prop="businessItemDesc" label="交易详情"></el-table-column>
                <el-table-column prop="businessCounts" label="数量"></el-table-column>
                <el-table-column prop="amount" label="单价"></el-table-column>
                <el-table-column prop="roomNo" label="房号"></el-table-column>
                <el-table-column prop="note" label="备注"></el-table-column>
                <el-table-column prop="operaterCardUrlName" label="操作员"></el-table-column>
            </el-table>
            <el-form :model="form" label-width="80px" :rules="formRules" ref="form">
                <el-form-item label="冲账方式">
                    <el-radio-group v-model="form.accountType">
                        <el-radio label="1">完全冲账</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="冲账备注">
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
    </div>
</template>

<script>
    export default {
        name: "reverse-bill-item",
        props:{
            show:{
                type:Boolean,
                default:false
            },
            room:{
                type:Object,
                default:{}
            },
            orderId:{
                type:String,
                default:""
            },
            billItemList:{
                type:Array,
                default:[]
            }
        },
        data() {
            return {
                visible:false,
                form:{
                    accountType:"1",
                    billItemList:[],
                },
                formRules:{},
                loadingInstance:null,
            }
        },
        watch:{
            show:function(isShow) {
                this.visible = isShow;
                if (isShow) {
                    this.form.billItemList = this.billItemList;
                } else {
                    this.form.billItemList = [];
                    this.$refs.form.resetFields();
                }
            }
        },
        methods:{
            submit() {

                this.$refs.form.validate((valide) => {
                    if (valide) {
                        let self = this;
                        this.loadingInstance = this.$loading();
                        let url = "/zingbiz/hotelNew/hotelBill/reserveBillItem";
                        this.form.roomId = this.room.roomId;
                        this.form.roomNo = this.room.roomNo;
                        console.log("reverseBill",this.form);
                        this.$httpSilent
                            .post(url,this.form)
                            .then(function(res) {
                                self.loadingInstance.close();
                                if (res.data.success) {
                                    self.$message({ type: "success", message: "冲账成功" });
                                    self.$emit("confirm",true);
                                } else {
                                    self.$message({ type: "error", message: "冲账失败" });
                                    self.$emit("confirm",false);
                                }
                            })
                            .catch(error => {
                                self.loadingInstance.close();
                                self.$message({ type: "error", message: "冲账失败" });
                            })
                    }
                })
            },
            handleClose(done) {
                this.$emit("cancel",false);
            },
        }
    }
</script>

<style scoped>

</style>
