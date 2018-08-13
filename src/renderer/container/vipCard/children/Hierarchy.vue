<template>
    <el-container>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="20">
            <el-main :style="{height:screenHeight + 'px',overflowY:'auto'}">
                <div>等级规则</div>
                <hr>
                <el-form label-width="150px">
                    <el-form-item label="等级成长依据">
                        <el-radio v-model="upCondition" :disabled="isDisabled" label="1" @change="upConditionRadio">累计消费
                        </el-radio>
                        <br/>
                        <el-radio v-model="upCondition" :disabled="isDisabled" label="2" @change="upConditionRadio">累计积分
                        </el-radio>
                        <br/>
                        <el-radio v-model="upCondition" :disabled="isDisabled" label="0" @change="upConditionRadio">累计充值金额
                        </el-radio>
                        <br/>
                        <el-radio v-model="upCondition" :disabled="isDisabled" label="3" @change="upConditionRadio">自定义
                        </el-radio>
                        <br/>
                        <span style="color:#aaa;">充值/消费一元等于一成长值</span>
                    </el-form-item>
                    <el-form-item label="等级有效期">
                        <el-radio v-model="levelPrescription" :disabled="isDisabled" label="0" @change="levelPrescriptionRadio">
                            永久有效
                        </el-radio>
                        <br/>
                        <el-radio v-model="levelPrescription" :disabled="isDisabled" label="1" @change="levelPrescriptionRadio">
                            每个自然年扣除成长值
                        </el-radio>
                        <br/>
                    </el-form-item>
                </el-form>
                <div style="padding-bottom: 10px">等级列表</div>
                <el-table tooltip-effect="dark" maxHeight="500" :data="gradeList" border style="width: 100%;"
                          v-loading="showLoading" highlight-current-row @row-click="RowClick">
                    <el-table-column prop="memberLevel" label="等级编号"></el-table-column>
                    <el-table-column label="等级名称">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.memberName"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="upRangeCustom" label="成长值范围">
                        <template slot-scope="scope">
                            <el-col :span="11">
                                <el-input :disabled="scope.$index === 0" v-model="scope.row.upRangeLow"></el-input>
                            </el-col>
                            <el-col class="line" :span="2">-</el-col>
                            <el-col :span="11">
                                <el-input :disabled="scope.$index === (gradeList.length - 1)" v-model="scope.row.upRangeHigh"></el-input>
                            </el-col>
                        </template>
                    </el-table-column>
                    <el-table-column label="折扣率">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.memberRatio">
                                <template slot="append">%</template>
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="成长值扣除数量">
                        <template slot-scope="scope">
                            <el-input :disabled="levelPrescription !== '1'" v-model="scope.row.yearConsume"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operation" label="操作">
                        <template slot-scope="scope">
                            <el-button class="operation" type="text" size="small" @click="delCurrent(scope.row,scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="btn">
                    <el-button type="primary" @click="addGradeBtn">添加等级</el-button>
                </div>
                <hr>
                <div class="sureBtn">
                    <el-button type="info">取消</el-button>
                    <el-button v-show="butClick" type="warning" @click="addMemberType">确定</el-button>
                    <el-button v-show="!butClick" type="warning">确定</el-button>
                </div>
            </el-main>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
    </el-container>
</template>
<script>
    import _ from 'lodash'
    export default {
        components: {},
        data() {
            return {
                isDisabled:false,
                butClick:true,
                gradeList: [],
                gradeAddList: [],
                addParamsList: [],//添加列表
                gradeUpdateList: [],//修改列表
                delGradeId:[],//删除id列表
                delStrId:[],
                upCondition:"",
                levelPrescription:"",
                showLoading: true,
                clickItem: {},
                screenHeight:0
            }
        },
        created () {
            this.screenHeight = document.documentElement.clientHeight - 50;
            this.initData();
        },
        methods: {
            initData() {
                let that = this;
                let url = '/zingbiz/member/memberService/loadMemberTypebyMemberTypeId';
                that.$http
                    .post(url, {})
                    .then(res => {
                        that.showLoading = false;
                        that.gradeList = res.data.data.data;
                        that.upCondition = that.gradeList.length > 0 ? that.gradeList[0].upCondition : ""
                        that.levelPrescription = that.gradeList.length > 0 ? that.gradeList[0].levelPrescription : ""
                        that.gradeAddList = JSON.parse(JSON.stringify(res.data.data.data))
                    }).catch(error => {
                    that.showLoading = false;
                    that.$message({type: "error", message: "请求数据失败，请刷新重试"});
                });
            },
            RowClick(row, event, column) {
                this.clickItem = row;
            },
            addGradeBtn() {
                let addGradeList = {
                    memberLevel: `lv ${this.gradeList.length + 1}`,  //会员等级upRangeHigh
                    memberSort:this.gradeList.length + 1,//排序
                    memberMouldId: "",  //"会员卡模板ID",
                    memberName: "",  //"会员卡名称",
                    upRangeLow: this.gradeList.length === 0 ? "0" : "",   //"会员卡成长范围最低",
                    upRangeHigh: "不限",   //"会员卡成长范围最高",
                    upCondition: "",   //"会员卡成长依据" 0充值/1消费
                    levelPrescription: "",  //"会员卡等级有效期"0永久/1每年消耗,
                    yearConsume: "",  // "会员卡每年消耗",
                    memberRatio: "",  //"会员卡抵扣率",
                    operater: "",   //"操作员名称",
                };
                this.gradeList.push(addGradeList)
                if (this.gradeList.length >= 2) {
                    this.gradeList[this.gradeList.length-2].upRangeHigh = this.gradeList[this.gradeList.length-2].upRangeHigh
                    && this.gradeList[this.gradeList.length-2].upRangeHigh !== "不限" ? this.gradeList[this.gradeList.length-2].upRangeHigh : ""
                } else {
                    this.gradeList[this.gradeList.length-1].upRangeHigh =  "不限"
                }

            },
            delCurrent(row,index) {
                this.gradeList.splice(index,1)
                if (index === 0 && this.gradeList.length >= 1) {
                    this.gradeList[index].upRangeLow = row.upRangeLow
                } else if (index === this.gradeList.length && this.gradeList.length > 0) {
                    this.gradeList[index-1].upRangeHigh = row.upRangeHigh
                } else if (this.gradeList.length > 0) {
                    this.gradeList[index].upRangeLow = row.upRangeLow
                    this.gradeList[index-1].upRangeHigh = row.upRangeHigh
                }
                for (let i = index; i < this.gradeList.length; i++) {
                    this.gradeList[i].memberLevel = `lv ${i + 1}`
                    this.gradeList[i].memberSort = i + 1
                }
                if (index < this.gradeAddList.length) {
                    this.gradeAddList.splice(index,1)
                    this.delGradeId.push({memberTypeId:row.memberTypeId})
                    this.delStrId.push(row.memberTypeId)
                }
            },
            sureAddGrade() {
                let isTrue = false
                if (this.upCondition === "") {
                    this.$vux.toast.text("请选择等级成长依据", 'bottom')
                    isTrue = true
                } else if (this.levelPrescription === "") {
                    this.$vux.toast.text("请选择等级有效期", 'bottom')
                    isTrue = true
                }
                for (let i = 0; i < this.gradeList.length; i++) {
                    if (this.gradeList[i].memberName === "" || this.gradeList[i].upRangeHigh === "" || this.gradeList[i].memberRatio === "") {
                        this.$vux.toast.text("请正确填写数据", 'bottom')
                        isTrue = true
                        break
                    }
                    if (parseInt(this.gradeList[i].upRangeHigh) <= parseInt(this.gradeList[i].upRangeLow)) {
                        this.$vux.toast.text("成长值范围错误", 'bottom')
                        isTrue = true
                        break
                    }
                    if (i !== (this.gradeList.length - 1)) {
                        if ((parseInt(this.gradeList[i].upRangeHigh) + 1) !== parseInt(this.gradeList[i+1].upRangeLow)) {
                            this.$vux.toast.text("等级之间的成长值应该保持连续", 'bottom')
                            isTrue = true
                            break
                        }
                    }
                    if (parseInt(this.gradeList[i].memberRatio) >= 100) {
                        this.$vux.toast.text("折扣率应该为小于100的整数", 'bottom')
                        isTrue = true
                        break
                    }
                    this.gradeList[i].upCondition = this.upCondition
                    this.gradeList[i].levelPrescription = this.levelPrescription
                    this.gradeList[i].upRangeCustom = this.gradeList[i].upRangeLow + " - " + this.gradeList[i].upRangeHigh
                    //获取添加数据
                    if (!this.gradeList[i].memberTypeId) {
                        this.addParamsList.push(this.gradeList[i])
                    }
                }
                //获取修改数据
                let deldata = this.delStrId.join(" ")
                this.gradeAddList.forEach((item,i) => {
                    if (item.memberTypeId === this.gradeList[i].memberTypeId) {
                        if (deldata.indexOf(this.gradeList[i].memberTypeId) < 0) {
                            if (item.memberLevel !== this.gradeList[i].memberLevel || item.memberName !== this.gradeList[i].memberName
                                || item.memberRatio !== this.gradeList[i].memberRatio || item.upRangeLow !== this.gradeList[i].upRangeLow
                                || item.upRangeHigh !== this.gradeList[i].upRangeHigh || item.yearConsume !== this.gradeList[i].yearConsume
                                || item.upCondition !== this.gradeList[i].upCondition || item.levelPrescription !== this.gradeList[i].levelPrescription) {
                                if (this.gradeList[i].es_score) delete this.gradeList[i].es_score
                                if (this.gradeList[i]._id) delete this.gradeList[i]._id
                                if (this.gradeList[i]._routing) delete this.gradeList[i]._routing
                                this.gradeUpdateList.push(this.gradeList[i])
                            }
                        }
                    }
                })
                return isTrue
            },
            addMemberType() {
                this.butClick = false
                this.addParamsList = []
                this.gradeUpdateList = []
                let that = this;
                let isTrue = this.sureAddGrade()
                if (isTrue) {
                    return false
                }
                let url = '/zingbiz/member/memberService/updateMemberType';
                let params = {}
                let isNotNull = false
                if (this.addParamsList.length > 0 ) {
                    params.addParam = JSON.stringify(this.addParamsList)
                    isNotNull = true
                }
                if (this.gradeUpdateList.length > 0 ) {
                    params.updateParam = JSON.stringify(this.gradeUpdateList)
                    isNotNull = true
                }
                if (this.delGradeId.length > 0 ) {
                    params.delParam = JSON.stringify(this.delGradeId)
                    isNotNull = true
                }
                if (isNotNull) {
                    this.$http
                        .post(url, params)
                        .then((res) => {
                            that.butClick = true
                            if (res.data.success) {
                                that.delGradeId = []
                                that.$message({type: "success", message: "操作成功"});
                                this.initData();
                                that.addGradeDialog = false;
                            }
                        })
                        .catch((error) => {
                            that.butClick = true
                            that.showLoading = false;
                            that.$message({type: "error", message: "请求数据失败，请刷新重试"});
                        })
                } else {
                    that.$vux.toast.text("等级设置没有变化", 'bottom')
                    that.butClick = true
                }
            },
            upConditionRadio(label) {
                this.gradeList.forEach((item, index) => {
                    item.upCondition = label;
                });
            },
            levelPrescriptionRadio(label) {
                this.gradeList.forEach((item, index) => {
                    item.levelPrescription = label;
                });
            },
        }
    }
</script>
<style scoped lang="stylus">
    .btn {
        margin-top: 10px;
        padding-bottom: 10px;
    }

    .sureBtn {
        float: right;
        margin-top: 30px;
    }
</style>
