<template>
    <el-container class="vipCardManage">
        <el-main v-bind:style="{ 'height' : $height + 'px' }" style="overflow-x:auto">
            <div>
                <el-row :gutter="20">

                    <el-col :span="2">&nbsp;</el-col>
                    <el-col :span="7">
                        <card :cardImg="''" :bg="!defautSetting.switchCover ? form.memberUrl : form.memberColour"
                            :cardName="form.memberTitle || 公司会员卡" cardType="会员卡" cardNum="xxxx xxxx xxxx" QRCode=""></card>
                    </el-col>
                    <el-col :span="8">
                        <div style="height:180px;margin-top:15px;margin-left:25px">
                            <div style="">
                                <div style="font-size:18px;">会员卡状态 : 待投放</div>
                                <br>
                                <div style="font-size:15px;">会员卡ID : xxxx xxxx xxxx</div>
                                <br>
                            </div>

                            <div style="position:relative;top:30px">
                                <el-button type="info" @click="throwIn"> 投放 </el-button>
                                <el-button @click="editAuto = false" v-show="editAuto"> 修改 </el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div style="font-size:15px">
                <el-row :gutter="20">
                    <el-col :span="2">&nbsp;</el-col>
                    <el-col :span="18">
                        <div style="border:1px solid #c7c7c7;padding: 10px;">
                            <div style="padding:10px;">基本信息</div>
                            <hr>
                            <br>
                            <div style="width:800px">
                                <!-- fix bug width questure -->
                                <el-form ref="form" :model="form" label-width="120px">
                                    <el-form-item label="商户">
                                        <el-col :span="11">
                                            <el-input v-model="form.memberCompany" :disabled="editAuto"></el-input>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="会员卡标题">
                                        <el-col :span="11">
                                            <el-input :maxlength="9" v-model="form.memberTitle" placeholder="建议包含商户名或服务内容，最多9个汉字"
                                                      :disabled="editAuto"></el-input>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="会员卡封面">
                                        <el-radio-group>
                                            <el-switch v-model="defautSetting.switchCover" active-text="颜色" :disabled="editAuto" inactive-text="封面"> </el-switch>
                                        </el-radio-group>

                                    </el-form-item>



                                    <el-form-item label="选择封面" v-show="!defautSetting.switchCover">
                                        <image-picker class="iPicker" :removable="!editAuto" :files="img.memberUrl" :selectable="img.memberUrl.length<1" />

                                    </el-form-item>

                                    <el-form-item label="选择颜色" v-show="defautSetting.switchCover">
                                        <el-radio-group>
                                            <div class="block">
                                                <el-color-picker v-model="form.memberColour"> </el-color-picker>
                                            </div>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="单次上限(选填)">
                                        <el-col :span="11">
                                            <el-input v-model="form.addPointLimit" :disabled="editAuto" placeholder="不填写表示单次无限制"></el-input>
                                        </el-col>
                                        <el-col :span="5">
                                            积分
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="激活送积分(选填)">
                                        <el-col :span="11">
                                            <el-input v-model="form.givePoint" placeholder="不填写表示不赠送积分" :disabled="editAuto"></el-input>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="有效期">
                                        <el-switch v-model="defautSetting.switchTimeLimit" :disabled="editAuto" active-text="固定时间" inactive-text="永久有效">
                                        </el-switch>
                                    </el-form-item>

                                    <el-form-item label="有效时间至" v-show="defautSetting.switchTimeLimit">
                                        <el-col :span="11">
                                            <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="form.memberEndTime" placeholder="选择日期" style="width: 100%;"
                                                :disabled="editAuto"></el-date-picker>
                                        </el-col>

                                    </el-form-item>

                                    <el-form-item label="可用时段">
                                        <el-switch v-model="defautSetting.switchSettingTime" :disabled="editAuto" active-text="部分时段" inactive-text="全部时段">
                                        </el-switch>
                                    </el-form-item>

                                    <el-form-item label="配置日期" v-show="defautSetting.switchSettingTime">

                                        <el-checkbox-group v-model="tempMemberCycle" :disabled="editAuto">
                                            <el-checkbox label="周一" name="type"></el-checkbox>
                                            <el-checkbox label="周二" name="type"></el-checkbox>
                                            <el-checkbox label="周三" name="type"></el-checkbox>
                                            <el-checkbox label="周四" name="type"></el-checkbox>
                                            <el-checkbox label="周五" name="type"></el-checkbox>
                                            <el-checkbox label="周六" name="type"></el-checkbox>
                                            <el-checkbox label="周日" name="type"></el-checkbox>
                                            <el-form-item label="">
                                                <el-time-select :disabled="editAuto" value-format="HH:mm:ss" v-model="form.memberAMStartTime" selectableRange :picker-options="{
                                                        start: '05:00',
                                                        step: '00:10',
                                                        end: '14:00'
                                                    }" placeholder="上午开始时间">
                                                </el-time-select>
                                                <el-time-select :disabled="editAuto" arrow-control value-format="HH:mm:ss" v-model="form.memberAMEndTime" :picker-options="{
                                                        start: '05:00',
                                                        step: '00:10',
                                                        end: '14:00'
                                                    }" placeholder="上午结束时间">
                                                </el-time-select>

                                            </el-form-item>
                                            <div style="height:10px"></div>

                                            <el-form-item label="">
                                                <el-time-select :disabled="editAuto" value-format="HH:mm:ss" v-model="form.memberPMStartTime" selectableRange :picker-options="{
                                                        start: '12:00',
                                                        step: '00:10',
                                                        end: '23:00'
                                                    }" placeholder="下午开始时间">
                                                </el-time-select>
                                                <el-time-select :disabled="editAuto" arrow-control value-format="HH:mm:ss" v-model="form.memberPMEndTime" :picker-options="{
                                                        start: '12:00',
                                                        step: '00:10',
                                                        end: '23:00'
                                                    }" placeholder="下午结束时间">
                                                </el-time-select>

                                            </el-form-item>

                                        </el-checkbox-group>
                                    </el-form-item>



                                    <el-form-item label="消费送积分" style="margin-top:5px">
                                        <el-col :span="10">
                                            <el-col :span="6">每消费</el-col>
                                            <el-col :span="12">
                                                <el-input v-model="form.spendPointRatio1" :disabled="editAuto"></el-input>
                                            </el-col>
                                            <el-col :span="6">元</el-col>
                                        </el-col>
                                        <el-col class="line" :span="2">-</el-col>

                                        <el-col :span="10">
                                            <el-col :span="6">赠送</el-col>
                                            <el-col :span="12">
                                                <el-input v-model="form.spendPointRatio2" :disabled="editAuto"></el-input>
                                            </el-col>
                                            <el-col :span="6">积分 </el-col>
                                        </el-col>
                                    </el-form-item>

                                    <el-form-item label="积分抵扣(选填)" style="margin-top:5px">
                                        <el-col :span="10">
                                            <el-col :span="6">每使用</el-col>
                                            <el-col :span="12">
                                                <el-input v-model="form.pointRatio1" :disabled="editAuto"></el-input>
                                            </el-col>
                                            <el-col :span="6">积分</el-col>
                                        </el-col>
                                        <el-col class="line" :span="2">-</el-col>

                                        <el-col :span="10">
                                            <el-col :span="6">抵扣</el-col>
                                            <el-col :span="12">
                                                <el-input v-model="form.pointRatio2" :disabled="editAuto"></el-input>
                                            </el-col>
                                            <el-col :span="6">元 </el-col>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="抵扣条件(选填)" style="margin-top:5px">
                                        <el-col :span="10">
                                            <el-col :span="6">订单满</el-col>
                                            <el-col :span="12">
                                                <el-input v-model="form.ratioCondition" :disabled="editAuto"></el-input>
                                            </el-col>
                                            <el-col :span="6">元可用</el-col>
                                        </el-col>
                                        <el-col class="line" :span="2"></el-col>


                                    </el-form-item>

                                    <div style="padding:10px;">会员卡详情</div>
                                    <hr>
                                    <br>

                                    <el-form-item label="特权说明">
                                        <el-input v-model="form.explain" type="textarea" placeholder="每消费XX元,赠送XX积分 每使用XX积分，抵扣XX元" :disabled="editAuto">

                                        </el-input>
                                    </el-form-item>

                                    <el-form-item label="使用须知(选填)">
                                        <el-input type="textarea" v-model="form.instructions" :disabled="editAuto"
                                                  placeholder="注：1、上文设置中，如已经填写“积分优惠”“折扣优惠”的内容，将会自动在用户会员卡详情展示，无需重复填写。2、建议填写其他注意事项，举例：积分不支持兑换现金"></el-input>
                                    </el-form-item>
                                    <el-form-item label="会员卡号">
                                        <el-radio v-model="form.memberPlan" label="0" :disabled="editAuto">系统生成12位卡号</el-radio>
                                        <el-radio v-model="form.memberPlan" label="1" :disabled="editAuto">用户手机号</el-radio>
                                    </el-form-item>
                                    <el-form-item label="图文介绍(选填)">
                                        <image-picker :files="img.graphicIntroduction" :removable="!editAuto" :selectable="true" multiple :disabled="editAuto" />
                                    </el-form-item>
                                    <div style="padding:10px;">激活设置</div>
                                    <hr>
                                    <br>
                                    <el-checkbox label="允许用户修改" style="padding-left: 52px;" v-model="useToModify" :disabled="editAuto" name="type"></el-checkbox>
                                    <el-form-item label="激活信息" style="margin-top:5px">
                                        <el-col :span="18">
                                            <el-col :span="6">姓名</el-col>
                                            <el-checkbox-group v-model="checkBoxForm.useName">
                                                <el-col :span="6">
                                                    <el-checkbox label="是否启用" name="type" :disabled="true"></el-checkbox>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-checkbox label="必填项" name="type" :disabled="true"></el-checkbox>
                                                </el-col>
                                            </el-checkbox-group>
                                        </el-col>
                                        <el-col :span="18">
                                            <el-col :span="6">手机号</el-col>
                                            <el-checkbox-group v-model="checkBoxForm.useTel">
                                                <el-col :span="6">
                                                    <el-checkbox label="是否启用" name="type" :disabled="true"></el-checkbox>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-checkbox label="必填项" name="type" :disabled="true"></el-checkbox>
                                                </el-col>
                                            </el-checkbox-group>
                                        </el-col>

                                        <el-col :span="18">
                                            <el-col :span="6">性别</el-col>
                                            <el-checkbox-group v-model="checkBoxForm.useSex">
                                                <el-col :span="6">
                                                    <el-checkbox label="是否启用" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-checkbox label="必填项" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                            </el-checkbox-group>
                                        </el-col>

                                        <el-col :span="18">

                                            <el-col :span="6">生日</el-col>
                                            <el-checkbox-group v-model="checkBoxForm.useBirthday">
                                                <el-col :span="6">
                                                    <el-checkbox label="是否启用" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-checkbox label="必填项" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                            </el-checkbox-group>
                                        </el-col>

                                        <el-col :span="18">
                                            <el-col :span="6">邮箱</el-col>
                                            <el-checkbox-group v-model="checkBoxForm.useMail">
                                                <el-col :span="6">
                                                    <el-checkbox label="是否启用" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-checkbox label="必填项" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                            </el-checkbox-group>
                                        </el-col>

                                        <el-col :span="18">
                                            <el-col :span="6">地址</el-col>
                                            <el-checkbox-group v-model="checkBoxForm.useAddress">
                                                <el-col :span="6">
                                                    <el-checkbox label="是否启用" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-checkbox label="必填项" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                            </el-checkbox-group>
                                        </el-col>
                                        <el-col :span="18">
                                            <el-col :span="6">学历</el-col>
                                            <el-checkbox-group v-model="checkBoxForm.useEducation">
                                                <el-col :span="6">
                                                    <el-checkbox label="是否启用" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-checkbox label="必填项" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                            </el-checkbox-group>
                                        </el-col>

                                        <el-col :span="18">
                                            <el-col :span="6">行业</el-col>
                                            <el-checkbox-group v-model="checkBoxForm.useIndustry">
                                                <el-col :span="6">
                                                    <el-checkbox label="是否启用" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-checkbox label="必填项" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                            </el-checkbox-group>
                                        </el-col>

                                        <el-col :span="18">
                                            <el-col :span="6">收入</el-col>
                                            <el-checkbox-group v-model="checkBoxForm.useIncome">
                                                <el-col :span="6">
                                                    <el-checkbox label="是否启用" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-checkbox label="必填项" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                            </el-checkbox-group>
                                        </el-col>

                                        <el-col :span="18">
                                            <el-col :span="6">爱好</el-col>
                                            <el-checkbox-group v-model="checkBoxForm.useIobby">
                                                <el-col :span="6">
                                                    <el-checkbox label="是否启用" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                                <el-col :span="6">
                                                    <el-checkbox label="必填项" name="type" :disabled="editAuto"></el-checkbox>
                                                </el-col>
                                            </el-checkbox-group>
                                        </el-col>



                                    </el-form-item>

                                    <div style="padding:10px;">服务设置</div>
                                    <hr>
                                    <br>

                                    <el-form-item label="后台充值密码" style="margin-top:5px">
                                        <el-col :span="18">
                                            <el-col :span="10">
                                                <el-input type="password" v-model="form.rechargeId" :disabled="editAuto"></el-input>

                                            </el-col>

                                        </el-col>
                                    </el-form-item>


                                    <el-form-item label="后台消费密码" style="margin-top:5px">
                                        <el-col :span="18">
                                            <el-col :span="10">
                                                <el-input type="password" v-model="form.spendId" :disabled="editAuto"></el-input>
                                            </el-col>

                                        </el-col>
                                    </el-form-item>
                                    <br>
                                    <el-form-item>
                                        <!-- {{addAuto}}  {{editAuto}} -->
                                        <el-button style="margin-bottom: 30px;" type="primary" @click="submit" v-show="addAuto">确认提交</el-button>
                                        <el-button style="margin-bottom: 30px;" type="primary" @click="update" v-show="!editAuto && !addAuto">确认修改</el-button>
                                        <!-- <el-button>取消</el-button> -->
                                    </el-form-item>



                                </el-form>
                            </div>


                        </div>
                    </el-col>
                </el-row>

            </div>

        </el-main>


    </el-container>
</template>
<script>
    import Card from "components/card/Card.vue";
    import ImagePicker from 'components/imagepicker/ImagePicker';
    import _ from 'lodash';
    export default {
        components: {
            Card,
            ImagePicker
        },
        beforeCreate() {
            this.$height = window.innerHeight
        },
        data() {
            return {
                addAuto: false,
                editAuto: false,
                useToModify:false,//是否允许用户信息修改
                $height: 0,
                defautSetting: {
                    switchSettingTime: false,
                    switchTimeLimit: false,
                    switchCover: true,
                    $height: 0,
                    defaultColorPicker: '#409EFF',
                },
                imageArray: [],
                tempMemberCycle: [],
                checkBoxForm: {
                    useName: ["是否启用","必填项"],
                    useTel: ["是否启用","必填项"],
                    useSex: [],
                    useBirthday: [],
                    useMail: [],
                    useAddress: [],
                    useEducation: [],
                    useIndustry: [],
                    useIncome: [],
                    useIobby: []
                },
                img: {
                    graphicIntroduction: [], // graphicIntroduction 图文介绍
                    memberUrl: []
                },
                form: {
                    memberCompany: null, //memberCompany 商户名称
                    memberTitle: null, //memberTitle 会员卡标题
                    memberColour: '#409EFF', //memberColour 会员卡封面颜色
                    memberUrl: '', //memberUrl 会员卡图片路径
                    memberAllTime: '0', //memberAllTime":"会员卡可用时间(全天0/非全天1)
                    memberStartTime: null,
                    memberEndTime: null,
                    memberCycle: [], // memberCycle 会员卡可用周期(星期一 星期二 星期三 用空格间隔)
                    memberAMStartTime: null, //memberAMStartTime 上午开始时间 (HH:mm:ss格式) 如果一上午都能用请全把上午时间都写进去不要为空
                    memberAMEndTime: null, // memberAMEndTime 上午结束时间
                    memberPMStartTime: null, //memberPMStartTime 下午开始时间
                    memberPMEndTime: null, //memberPMEndTime 下午结束时间
                    // 可用日期: null,
                    spendPointRatio: null, //"spendPointRatio":"会员卡消费积分比(100:1 存0.01)
                    spendPointRatio1: null, //"spendPointRatio":"会员卡消费积分比(100:1 存0.01)
                    spendPointRatio2: null, // "spendPointRatio":"会员卡消费积分比(100:1 存0.01)
                    addPointLimit: null, //addPointLimit 单次上限
                    givePoint: null, // givePoint 激活送积分
                    pointRatio: null, //pointRatio 积分抵扣1
                    pointRatio1: null, //pointRatio 积分抵扣1
                    pointRatio2: null,
                    ratioCondition: null, //ratioCondition 抵扣条件1
                    explain: null,
                    instructions: null, //instructions 使用须知
                    graphicIntroduction: '', // graphicIntroduction 图文介绍
                    memberPlan: '', //memberPlan 会员卡号 (0系统号吗/1手机号)
                    useName: [],
                    useTel: [],
                    useSex: [],
                    useBirthday: [],
                    useMail: [],
                    useAddress: [],
                    useEducation: [],
                    useIndustry: [],
                    useIncome: [],
                    useIobby: [],
                    rechargeId: '',
                    spendId: ''
                    /**@augments,
                     * "useName":"用户姓名(0启用 1必填2可选 同时都有填两个用空格间隔))",
                     * "useTel":"用户手机号","useSex":"用户性别",
                     * "useBirthday":"用户生日","useMail":"用户邮箱",
                     * "useAddress":"用户地址","useEducation":"用户学历",
                     * "useIndustry":"用户行业","useIncome":"用户收入",
                     * "useIobby":"用户爱好","operater":"操作员",
                     * "operaterCardUrl":"操作员URL","companyId":"公司号"} */
                }
            }
        },
        watch:{
            img : {
                handler(curVal,oldVal) {
                    if (this.img.memberUrl.length > 0) {
                        this.form.memberUrl = this.img.memberUrl[0].url
                    }
                },
                deep:true
            },
        },
        created() {

            this.initData();

        },
        methods: {
            initData() {
                let that = this
                let url = '/zingbiz/member/memberService/loadMouldbyMouldId'
                this.$http.post(url, {}).then(res => {
                    if (res.data.success) {
                        let responseData = res.data.data.data
                        console.log(responseData)
                        if (responseData.length > 0) {
                            that.editAuto = true
                            that.addAuto = false
                            that.form = responseData[0]
                            that.defautSetting.switchCover = that.form.switchCover === "0" ? true : false
                            that.disposeFormSide()
                        } else {
                            that.addAuto = true
                        }

                    } else {
                        that.$message({
                            type: "error",
                            message: "添加失败，请重试"
                        });
                    }
                });
            },
            throwIn() {
                that.$message({
                    type: "success",
                    message: "研发中..."
                });
            },
            disposeForm(state) {

                let _form = this.form
                if (_form.spendPointRatio1 !== null && _form.spendPointRatio2 !== null) {
                    _form.spendPointRatio = (~~(_form.spendPointRatio2) / ~~(_form.spendPointRatio1)).toFixed(2) + ''
                } else {
                    _form.spendPointRatio = null
                }

                if (_form.pointRatio1 !== null && _form.pointRatio2 !== null) {
                    _form.pointRatio = (_form.pointRatio2 / _form.pointRatio1).toFixed(2) + ''
                } else {
                    _form.pointRatio = null
                }
                if (this.img.memberUrl.length > 0) {
                    _form.memberUrl = this.img.memberUrl[0].url
                } else {
                    delete _form.memberUrl
                }
                if (this.img.graphicIntroduction.length > 0) {
                    _form.graphicIntroduction = this.img.graphicIntroduction[0].url
                } else {
                    delete _form.graphicIntroduction
                }
                if (!this.defautSetting.switchTimeLimit) {
                    _form.memberEndTime = '2099-01-01 00:00:00'
                } else {
                    _form.memberEndTime = _form.memberEndTime.indexOf("00:00:00") >= 0 ? _form.memberEndTime : _form.memberEndTime += ' 00:00:00'
                }

                if (this.defautSetting.switchSettingTime) {
                    _form.memberAllTime = '1'
                    /*if(!_.isUndefined(state) && state != 'update'){
                        if (_form.memberAMStartTime !== null) _form.memberAMStartTime += ':00'
                        if (_form.memberAMEndTime !== null) _form.memberAMEndTime += ':00'
                        if (_form.memberPMStartTime !== null) _form.memberPMStartTime += ':00'
                        if (_form.memberPMEndTime !== null) _form.memberPMEndTime += ':00'
                    }*/
                    if (_form.memberAMStartTime && _form.memberAMStartTime.split(":").length < 3) _form.memberAMStartTime += ':00'
                    if (_form.memberAMEndTime && _form.memberAMEndTime.split(":").length < 3) _form.memberAMEndTime += ':00'
                    if (_form.memberPMStartTime && _form.memberPMStartTime.split(":").length < 3) _form.memberPMStartTime += ':00'
                    if (_form.memberPMEndTime && _form.memberPMEndTime.split(":").length < 3) _form.memberPMEndTime += ':00'
                    _form.memberCycle = this.tempMemberCycle.join(' ')
                } else {
                    _form.memberAllTime = '0'
                    _form.memberAMStartTime = ''
                    _form.memberAMEndTime = ''
                    _form.memberPMStartTime = ''
                    _form.memberPMEndTime = ''
                    _form.memberCycle = ""
                }
                _.each(_form, (v, k) => {
                    if (v === null || v === "") delete _form[k]
                })

                _.each(this.checkBoxForm, (v, k) => {
                    if (_.isArray(v)) {
                        _form[k] = v.join(' ').replace('是否启用', "0").replace('必填项', "1") //替换字符串
                    }
                })
                console.log("form=========",_form)
                return _form
            },
            disposeFormSide() {
                this.useToModify = this.form.useToModify === "0" ? true : false
                _.each(this.checkBoxForm, (v, k) => {
                    if (!_.isUndefined(this.form[k]) && this.form[k] !== '') {

                        this.form[k] = this.form[k].replace('0', "是否启用").replace('1', "必填项")

                        this.checkBoxForm[k] = this.form[k].split(' ')

                    } else {
                        this.checkBoxForm[k] = []
                    }
                })


                if (!_.isUndefined(this.form.graphicIntroduction) && this.form.graphicIntroduction !== '') {
                    this.img.graphicIntroduction[0] = this.form.graphicIntroduction
                }
                if (!_.isUndefined(this.form.memberUrl) && this.form.memberUrl !== '') {
                    this.img.memberUrl = [{ url : this.form.memberUrl }]
                }

                if (!_.isUndefined(this.form.memberCycle)) {
                    this.tempMemberCycle = this.form.memberCycle.split(' ')
                }
                if (this.form.memberEndTime === '2099-01-01 00:00:00') {
                    this.defautSetting.switchTimeLimit = false
                } else {
                    this.defautSetting.switchTimeLimit = true
                }
                if (this.form.memberAllTime === '1') {
                    this.defautSetting.switchSettingTime = true
                }



            },
            submit() {
                let that = this
                let form = this.disposeForm()
                form.useToModify = this.useToModify ? "0" : "1"
                form.switchCover = this.defautSetting.switchCover ? "0" : "1"
                form.givePoint = !form.givePoint || form.givePoint === null ? 0 : form.givePoint
                let url = "/zingbiz/member/memberService/addMemberMould"
                this.$http.post(url, form).then(res => { //传递{key:[]} response 400
                    if (res.data.success) {
                        that.$message({
                            type: "success",
                            message: "提交成功"
                        });
                        //this.$router.go(0) //临时这样
                        that.initData()
                    } else {
                        that.$message({
                            type: "error",
                            message: "提交失败，请重试"
                        });
                    }
                });
            },
            update() {
                let that = this
                let form = this.disposeForm('update')
                if (form.es_score) delete form.es_score
                if (form._id) delete form._id
                if (form._routing) delete form._routing
                form.givePoint = !form.givePoint || form.givePoint === null ? 0 : form.givePoint
                form.useToModify = this.useToModify ? "0" : "1"
                form.switchCover = this.defautSetting.switchCover ? "0" : "1"
                let url = "/zingbiz/member/memberService/updateMemberMould"
                this.$http.post(url, form).then(res => { //传递{key:[]} response 400
                    if (res.data.success) {
                        that.$message({
                            type: "success",
                            message: "提交成功"
                        });
                        //this.$router.go(0) //临时这样
                        that.initData()
                    } else {
                        that.$message({
                            type: "error",
                            message: "提交失败，请重试"
                        });
                    }
                });

            }

        },
    }

</script>
<style lang="stylus">
    .vipCardManage {
        .el-col-7 {
            width: 45%;
        }
        .icon-tianjiatupian1 {
            font-size: 60px !important
        }
        .icon-erweima {
            font-size: 40px !important
        }
    }
</style>
