<template>
    <div class="newMember">
        <zing-head title="注册"></zing-head>
        <scroller lock-x scrollbar-y height="calc(100% - 90px)" v-for="(item,index) in initData"
                  :key="index">
            <x-input class="avgH" title="姓名" placeholder="请输入姓名" v-model="name" type="text"></x-input>
            <x-input class="avgH" title="手机" placeholder="请输入手机号" v-model="tel" ref="telInput"
                     mask="99999999999" :max="11" is-type="china-mobile"></x-input>

            <!--<selector v-if="item.useSex[0]=='0' && item.useSex.length === 1"
                      title="性别(选填)" v-model="sex" :options="options" @on-change="selectSex"></selector>
            <selector v-else-if="item.useSex[0]=='0'"
                      title="性别" v-model="sex" :options="options" @on-change="selectSex"></selector>-->
            <group class="useSex">
                <cell class="avgH" v-if="item.useSex[0]=='0' && item.useSex.length === 1" title="性别(选填)">
                    <check-icon :value.sync="sexNan" type="plain"> 男 </check-icon>
                    <check-icon :value.sync="sexNv" type="plain"> 女 </check-icon>
                </cell>
                <cell class="avgH" v-else-if="item.useSex[0]=='0'" title="性别">
                    <check-icon :value.sync="sexNan" type="plain"> 男 </check-icon>
                    <check-icon :value.sync="sexNv" type="plain"> 女 </check-icon>
                </cell>
            </group>

            <datetime class="avgH" v-if="item.useBirthday[0]=='0' && item.useBirthday.length === 1" format="YYYY-MM-DD" :end-date="endDate"
                      :start-date="startDate" title="生日(选填)" placeholder="请输入生日" v-model="birthday"></datetime>
            <datetime class="avgH" v-else-if="item.useBirthday[0]=='0'" title="生日" format="YYYY-MM-DD" :end-date="endDate" :start-date="startDate"
                      placeholder="请输入生日" v-model="birthday"></datetime>

            <x-input class="avgH" v-if="item.useMail[0]=='0' && item.useMail.length === 1"
                     title="邮箱(选填)" placeholder="请输入邮箱" v-model="email" type="email"></x-input>
            <x-input class="avgH" v-else-if="item.useMail[0]=='0'" title="邮箱" placeholder="请输入邮箱" v-model="email" type="email"></x-input>

            <x-input class="avgH" v-if="item.useAddress[0]=='0' && item.useAddress.length === 1"
                     title="地址(选填)" placeholder="请输入地址" v-model="address" type="text"></x-input>
            <x-input v-else-if="item.useAddress[0]=='0'" title="地址" placeholder="请输入地址" v-model="address"
                     type="text"></x-input>

            <selector class="avgH" v-if="item.useEducation[0]=='0' && item.useAddress.length === 1"
                      title="学历(选填)" v-model="selectValue" :options="education" @on-change="selEducation"></selector>
            <selector class="avgH" v-else-if="item.useEducation[0]=='0'" title="学历" v-model="selectValue" :options="education"
                      @on-change="selEducation"></selector>

            <x-input class="avgH" v-if="item.useIndustry[0]=='0' && item.useIndustry.length === 1" title="行业(选填)" placeholder="请输入行业" v-model="industry"
                     type="text"></x-input>
            <x-input class="avgH" v-else-if="item.useIndustry[0]=='0'" title="行业" placeholder="请输入行业" v-model="industry"
                     type="text"></x-input>

            <x-input class="avgH" v-if="item.useIncome[0]=='0' && item.useIncome.length === 1" title="收入(选填)" placeholder="请输入收入" v-model="income"
                     type="number"></x-input>
            <x-input class="avgH" v-else-if="item.useIncome[0]=='0'" title="收入" placeholder="请输入收入" v-model="income"
                     type="number"></x-input>

            <x-input class="avgH" v-if="item.useIobby[0]=='0' && item.useIobby.length === 1" title="爱好(选填)" placeholder="请输入爱好" v-model="inbby" type="text"></x-input>
            <x-input class="avgH" v-else-if="item.useIobby[0]=='0'" title="爱好" placeholder="请输入爱好" v-model="inbby" type="text"></x-input>


        </scroller>
        <!--<x-button class="subUser btn-save" style="background: #ff8000 !important;bottom: 0px;
            position: fixed;" @click.native="addMember" type="primary">提交</x-button>-->
        <group>
            <flexbox :gutter="0">
                <flexbox-item>
                    <x-button class="btn-common" type="primary" :style="{height:'40px'}" @click.native="addMember">提交</x-button>
                </flexbox-item>
            </flexbox>
        </group>
        <div class="prompt" v-if="initData.length==0">请先去设置会员卡管理</div>
    </div>
</template>
<script>
    import ZingHead from '../../components/zingHead/ZingHead.vue';
    import { XInput, XButton, Group, Radio, Selector, Scroller,Datetime,CheckIcon,Cell,Flexbox,FlexboxItem, } from 'vux';
    export default {
        components: {
            XInput,
            XButton,
            Flexbox,
            FlexboxItem,
            ZingHead,
            Group,
            Radio,
            Selector,
            Scroller,
            Datetime,
            CheckIcon,
            Cell
        },
        data() {
            return {
                name: '',
                tel: '',
                email: '',
                options: ['男', '女'],
                birthday: '',
                selectValue: '',
                sexNan: false,
                sexNv: false,
                sex: "",
                education: ['小学', '初中', '高中', '大专', '本科', '研究生', '博士'],
                address: '',
                industry: '',
                income: '',
                inbby: '',
                initData: [],
                startDate:"",
                endDate:"",
                companyId:"",
                params: {
                    memberMouldId: '',  //会员卡模具ID
                    memberLevel: '',  //会员卡等级(如果办卡变高级填等级默认为0)
                    memberPlan: '',  //会员卡账户设置
                    upCondition: '',  //会员卡成长依据  0充值/1消费
                    useName: '',  //用户名称
                    useTel: '',  //用户手机号
                }
            }
        },
        computed: {},
        watch:{
            sexNan (isShow) {
                this.sexNv = !this.sexNan
                this.sex = this.sexNan ? '男' : "女"
            },
            sexNv (isShow) {
                this.sexNan = !this.sexNv
                this.sex = this.sexNan ? '男' : "女"
            }
        },
        created() {
            this.companyId = this.$route.query.companyId
            console.log("==================",this.companyId)
            this.init();
            this.getNowFormatDate()
        },
        methods: {
            init() {
                let url = '/zingbiz/member/memberService/loadMouldbyMouldId';
                let param = {}
                if (this.companyId) {
                    param.companyId = this.companyId
                }
                this.$http
                    .post(url, param)
                    .then((res) => {
                        this.initData = res.data.data.data;
                        this.initData.forEach((item, index) => {
                            this.params.memberMouldId = item.memberMouldId;
                            this.params.memberLevel = item.memberLevel || 'lv 1';
                            this.params.memberPlan = item.memberPlan;
                            this.params.upCondition = item.upCondition || '';
                        })
                    })
                    .catch((err) => {
                        this.$vux.toast.show({text: "操作异常", type: "cancel"});
                    })
            },
            addMember() {
                let that = this
                if (this.name == "") {
                    this.$vux.toast.text("姓名不能为空", 'bottom');
                    return
                }
                if (this.tel == "") {
                    this.$vux.toast.text("手机号不能为空", 'bottom');
                    return
                }
                let isTel = this.$refs.telInput[0].showWarn
                if (isTel) {
                    this.$vux.toast.text("请填写正确的手机号", 'bottom');
                    return
                }
                this.initData.forEach((item, index) => {
                    if (item.useSex[2] == '2' && !this.sex) {
                        this.$vux.toast.text("请选择性别", 'bottom');
                        return
                    }
                    if (item.useBirthday[2] == '2' && !this.birthday) {
                        this.$vux.toast.text("请填写生日", 'bottom');
                        return
                    }
                    if (item.useMail[2] == '2' && !this.email) {
                        this.$vux.toast.text("请填写邮箱", 'bottom');
                        return
                    }
                    if (item.useAddress[2] == '2' && !this.address) {
                        this.$vux.toast.text("请填写地址", 'bottom');
                        return
                    }
                    if (item.useEducation[2] == '2' && !this.selectValue) {
                        this.$vux.toast.text("请选择学历", 'bottom');
                        return
                    }
                    if (item.useIndustry[2] == '2' && !this.industry) {
                        this.$vux.toast.text("请填写行业", 'bottom');
                        return
                    }
                    if (item.useIncome[2] == '2' && !this.income) {
                        this.$vux.toast.text("请填写收入", 'bottom');
                        return
                    }
                    if (item.useIobby[2] == '2' && !this.inbby) {
                        this.$vux.toast.text("请填写爱好", 'bottom');
                        return
                    }
                });
                this.params.useName = this.name;
                this.params.useTel = this.tel;
                this.params.useMail = this.email
                this.params.useBirthday = this.birthday
                this.params.useEducation = this.selectValue
                this.params.useSex = this.sex
                this.params.useAddress = this.address
                this.params.useIndustry  = this.industry
                this.params.useIncome = this.income
                this.params.useIobby = this.inbby
                if (this.companyId) {
                    this.params.companyId = this.companyId
                }
                console.log(this.params)
                let url = '/zingbiz/member/memberService/addMember';
                this.$http
                    .post(url, this.params)
                    .then((res) => {
                        if (res.data.success) {
                            /*that.sexNan = false
                            that.sexNv = false*/
                            that.name = ""
                            that.tel = ""
                            that.email = ""
                            that.birthday = ""
                            that.selectValue = ""
                            that.sex = ""
                            that.address = ""
                            that.industry = ""
                            that.income = ""
                            that.inbby = ""
                            that.$vux.toast.show({text: "注册成功！", type: "success"})
                        }
                    })
                    .catch((error) => {
                        that.$vux.toast.show({text: "操作异常！", type: "cancel"})
                    })
            },
            selectSex (value) {
                this.sex = value;
            },
            selEducation (value) {
                this.selectValue = value;
            },
            getNowFormatDate() {
                let date = new Date();
                let seperator1 = "-";
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                let currentdate = year + seperator1 + month + seperator1 + strDate;
                this.startDate = (parseInt(year) - 150) + seperator1 + "01" + seperator1 + "01";
                this.endDate = currentdate
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
    @import '../../assets/stylus/unify.styl';
.newMember {
    height 100%;
    width: 100%;
    .avgH {
        height 24px !important
        border-bottom: 1px solid #f5f5f5
    }
    .subUser {
        margin-top: 50px;
    }

    .prompt {
        margin-top: 20px;
        text-align: center;
        font-size: 18px;
        color: #ff8000;
    }
    .useSex {
        .vux-label {
            font-size: 16px;
        }
        .vux-check-icon>.weui-icon-success-circle:before, .vux-check-icon>.weui-icon-success:before {
            color: #ff8000;
        }
        .vux-check-icon>span{
            font-size: 16px;
        }
    }
    *, :after, :before {
        box-sizing: content-box;
    }
}
</style>
