<template>
    <div class="addDate">
        <ZingHead title="新增班次" :isComeBack="false" @doSome="doSome({'goBack':'fh'})">
        </ZingHead>
        <group  label-align="left">
                <x-input title="班次名称 <span style='color:red'>*</span>" v-model="formData.dateName" type="text"  placeholder="请输入班次名称"></x-input>
                <x-input title="排班方式 <span style='color:red'>*</span>"  type="text"  readonly>
                    <checker  v-model="dateType" slot="right"  default-item-class="demo1-item" selected-item-class="demo1-item-selected">
                            <checker-item :value="item.key" v-for="(item, index) in checkData" :key="index">{{item.value}}</checker-item>
                    </checker>
                </x-input>
        </group>
        <group >
                <div v-show="dateType == 1">
                    <cell title="上班" is-link @click.native="onclick('1')" v-model="formData.one_signIn_Date"></cell>
                    <cell title="下班" is-link @click.native="onclick('2')" v-model="formData.one_signOut_Date"></cell>
                </div>
                <div v-show="dateType == 2">
                    <cell title="上班" is-link @click.native="onclick('1')" v-model="formData.one_signIn_Date"></cell>
                    <cell title="下班" is-link @click.native="onclick('2')" v-model="formData.one_signOut_Date"></cell>
                    <cell></cell>
                    <cell title="上班" is-link @click.native="onclick('3')" v-model="formData.two_signIn_Date"></cell>
                    <cell title="下班" is-link @click.native="onclick('4')" v-model="formData.two_signOut_Date"></cell>
                </div>
                <div v-show="dateType == 3">
                    <cell title="上班" is-link @click.native="onclick('1')" v-model="formData.one_signIn_Date"></cell>
                    <cell title="下班" is-link @click.native="onclick('2')" v-model="formData.one_signOut_Date"></cell>
                    <cell></cell>
                    <cell title="上班" is-link @click.native="onclick('3')" v-model="formData.two_signIn_Date"></cell>
                    <cell title="下班" is-link @click.native="onclick('4')" v-model="formData.two_signOut_Date"></cell>
                    <cell></cell>
                    <cell title="上班" is-link @click.native="onclick('5')" v-model="formData.three_signIn_Date"></cell>
                    <cell title="下班" is-link @click.native="onclick('6')" v-model="formData.three_signOut_Date"></cell>
                </div>
        </group>
        <group label-width="2em">
             <x-button type="primary btn-common" @click.native="saveBtn"> 保存</x-button>
        </group>
        <!-- 弹出框组件 -->
        <div v-transfer-dom>
             <confirm v-model="confirmShow"
                 ref="confirm1"
                 title="选择规则生效时间"
                 content="立即生效：今日考勤结果将按新规则重算"
                 confirm-text="立即生效"
                 cancel-text="明日生效"
                 @on-cancel="onCancel"
                 @on-confirm="onConfirm">
             </confirm>
        </div>
    </div>
</template>


<script>
    import {Cell,CheckerItem,Checker,XInput,Group,XButton,Datetime,Confirm} from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead"
    export default {
        components: {
            Cell,ZingHead,CheckerItem,Checker,Datetime,XButton,XInput,Group,Confirm
        },
        props:{
            curItem:{}
        },
        data () {
            return {
                confirmShow:false,
                dateName:"",//初始化名称
                dateType:"1",
                selDate:"",
                checkData: [
                    {key:"1",value:"1天1次"},
                    {key:"2",value:"1天2次"},
                    {key:"3",value:"1天3次"}],
                formData:{
                    rowId:"",
                    dateName:"",
                    dateType:"1",
                    one_signIn_Date:"09:00",
                    one_signOut_Date:"18:00",
                    two_signIn_Date:"",
                    two_signOut_Date:"",
                    three_signIn_Date:"",
                    three_signOut_Date:""
                }
                
            }
        },
        watch: {
           curItem(data){
                if(data){
                    this.dateType = data.dateType
                    this.formData.rowId = data.rowId
                    this.formData.dateName = data.dateName
                    this.dateName = data.dateName
                    this.formData.dateType = data.dateType
                    this.formData.one_signIn_Date = data.one_signIn_Date
                    this.formData.one_signOut_Date = data.one_signOut_Date
                    this.formData.two_signIn_Date = data.two_signIn_Date
                    this.formData.two_signOut_Date = data.two_signOut_Date
                    this.formData.three_signIn_Date = data.three_signIn_Date
                    this.formData.three_signOut_Date = data.three_signOut_Date
                }
           },
           dateType(val){
             this.formData.dateType = val
             if(this.curItem){
                let dateType = this.curItem.dateType
                if(val != dateType){
                    if(val == "1"){
                        this.formData.one_signIn_Date = "09:00"
                        this.formData.one_signOut_Date = "18:00"
                        this.formData.two_signIn_Date = ""
                        this.formData.two_signOut_Date = ""
                        this.formData.three_signIn_Date = ""
                        this.formData.three_signOut_Date = ""
                    }else if(val == "2"){
                        this.formData.one_signIn_Date = "09:00"
                        this.formData.one_signOut_Date = "12:00"
                        this.formData.two_signIn_Date = "14:00"
                        this.formData.two_signOut_Date = "18:00"
                        this.formData.three_signIn_Date = ""
                        this.formData.three_signOut_Date = ""
                    }else if(val == "3"){
                        this.formData.one_signIn_Date = "09:00"
                        this.formData.one_signOut_Date = "11:00"
                        this.formData.two_signIn_Date = "12:00"
                        this.formData.two_signOut_Date = "15:00"
                        this.formData.three_signIn_Date = "16:00"
                        this.formData.three_signOut_Date = "18:00"
                    }
                }
             }else{
                if(val == 1){
                    this.formData.one_signIn_Date = "09:00"
                    this.formData.one_signOut_Date = "18:00"
                }else if(val == 2){
                    this.formData.one_signIn_Date = "09:00"
                    this.formData.one_signOut_Date = "12:00"
                    this.formData.two_signIn_Date = "14:00"
                    this.formData.two_signOut_Date = "18:00"
                }else if(val == 3){
                    this.formData.one_signIn_Date = "09:00"
                    this.formData.one_signOut_Date = "11:00"
                    this.formData.two_signIn_Date = "12:00"
                    this.formData.two_signOut_Date = "15:00"
                    this.formData.three_signIn_Date = "16:00"
                    this.formData.three_signOut_Date = "18:00"
                }
             }
           }
        },
        created: function () {
            
        },
        methods: {
            doSome(data){
                this.$emit('goAttenDateTem',data)
            },
            onCancel(){//次日生效
                let params = {}
                params.nextStatus = 'true'
                params.rowId = this.formData.rowId
                params.next_dateName = this.formData.dateName
                params.next_dateType = this.formData.dateType
                params.next_one_signIn_Date = this.formData.one_signIn_Date
                params.next_one_signOut_Date = this.formData.one_signOut_Date
                params.next_two_signIn_Date = this.formData.two_signIn_Date
                params.next_two_signOut_Date = this.formData.two_signOut_Date
                params.next_three_signIn_Date = this.formData.three_signIn_Date
                params.next_three_signOut_Date = this.formData.three_signOut_Date
                this.editMain(params)
            },
            onConfirm(){//立即生效
                let params = {}
                if(this.dateName != this.formData.dateName){
                    params.dateName = this.formData.dateName
                }
                params.nextStatus = 'false'
                params.rowId = this.formData.rowId
                params.dateType = this.formData.dateType
                params.one_signIn_Date = this.formData.one_signIn_Date
                params.one_signOut_Date = this.formData.one_signOut_Date
                params.two_signIn_Date = this.formData.two_signIn_Date
                params.two_signOut_Date = this.formData.two_signOut_Date
                params.three_signIn_Date = this.formData.three_signIn_Date
                params.three_signOut_Date = this.formData.three_signOut_Date
                params.next_dateName = ""
                params.next_dateType = ""
                params.next_one_signIn_Date = ""
                params.next_one_signOut_Date = ""
                params.next_two_signIn_Date = ""
                params.next_two_signOut_Date = ""
                params.next_three_signIn_Date = ""
                params.next_three_signOut_Date = ""
                this.editMain(params)
            },
            saveBtn(data){
                    if(this.formData.dateName == ""){
                        this.$vux.toast.text("请输入班次名称!")
                        return
                    }
                    if(this.formData.dateName.length > 6){
                        this.$vux.toast.text("班次名称过长!")
                        return
                    }
                    if(this.formData.dateType == ""){
                        this.$vux.toast.text("请选择排版方式!")
                        return
                    }
                    if(this.formData.rowId == ''){//添加
                        this.addMain(this.formData)
                    }else{//修改
                        this.confirmShow = true
                    }
                   
            },
            addMain(data){
                if(!data){
                    return
                }
                let _this = this
                let params = data
                let url = "/zingbiz/attendance/attendancesetting/addAttendanceDate"
                this.$http.post(url,params).then(res => {
                        if(res.data.data.status){
                            this.$vux.toast.text("班次名称已被使用!")
                        }else{
                            this.$vux.toast.show({
                                text: "操作成功！",
                                type: "success",
                                onHide () {
                                    _this.doSome()
                                }
                            })
                        }
                }) 
            },
            editMain(params){
                let _this = this
                let url = "/zingbiz/attendance/attendancesetting/updateAttendanceDate"
                this.$http.post(url,params).then(res => {
                        if(res.data.data.status){
                            this.$vux.toast.text("班次名称已被使用!")
                        }else{
                            this.$vux.toast.show({
                                text: "操作成功！",
                                type: "success",
                                onHide () {
                                    _this.doSome()
                                }
                            })
                        }
                }) 
            },
            oneIn(val){
                 let oneIn = this.formData.one_signIn_Date
                 let oneOut = this.formData.one_signOut_Date
                 let status = this.compareDate(val,oneOut)
                 if(!status){
                    this.$vux.alert.show({
                      content: '你设置的上班时间是'+val+',本时段上班时间应该在本时段下班时间之前'
                    })
                    return oneIn
                 }
                 return val
                     
            },
            oneOut (val){
                let oneIn = this.formData.one_signIn_Date
                let oneOut = this.formData.one_signOut_Date
                if(this.dateType == 1){
                    let status = this.compareDate(oneIn,val)
                    if(status){
                        return val
                    }
                    return "次日 "+val
                }else{
                    let twoIn = this.formData.two_signIn_Date
                    let status = this.compareDate(oneIn,val)
                    let status2 = this.compareDate(val,twoIn)
                    if(status && status2){
                        return val
                    }else{
                        this.$vux.alert.show({
                          content: '本时段下班时间应该在下一时段上班时间之前'
                        })
                        return oneOut
                    }
                }
            },
            twoIn (val){
                let oneOut = this.formData.one_signOut_Date
                let twoIn = this.formData.two_signIn_Date
                let twoOut = this.formData.two_signOut_Date
                let status = this.compareDate(oneOut,val)
                let status2 = this.compareDate(val,twoOut)
                if(status && status2){
                    return val
                }else if(!status){
                    this.$vux.alert.show({
                          content: '你设置的上班时间是次日'+val+',本时段下班时间应该在下一时段上班时间之前'
                    })
                    return twoIn
                }else if(!status2){
                    this.$vux.alert.show({
                          content: '你设置的上班时间是'+val+',本时段下班时间应该在下一时段上班时间之前'
                    })
                    return twoIn
                }
            },
            twoOut (val){
                let twoIn = this.formData.two_signIn_Date
                let twoOut = this.formData.two_signOut_Date
                let status = this.compareDate(twoIn,val)
                if(this.dateType == 2){
                    if(status){
                        return val
                    }else{
                        return "次日 "+val
                    }
                }else{
                    let threeIn = this.formData.three_signIn_Date
                    let status2 = this.compareDate(val,threeIn)
                    if(status && status2){
                        return val
                    }else{
                        this.$vux.alert.show({
                          content: '本时段下班时间应该在下一时段上班时间之前'
                        })
                        return twoOut
                    }
                }
            },
            threeIn (val){
                let twoOut = this.formData.two_signOut_Date
                let threeIn = this.formData.three_signIn_Date
                let threeOut = this.formData.three_signOut_Date
                let status = this.compareDate(twoOut,val)
                let status2 = this.compareDate(val,threeOut)
                if(status && status2){
                    return val
                }else if(!status){
                    this.$vux.alert.show({
                          content: '你设置的上班时间是次日'+val+',本时段下班时间应该在下一时段上班时间之前'
                    })
                    return threeIn
                }else if(!status2){
                    this.$vux.alert.show({
                          content: '你设置的上班时间是'+val+',本时段下班时间应该在下一时段上班时间之前'
                    })
                    return threeIn
                }
            },
            threeOut (val){
                let threeIn = this.formData.three_signIn_Date
                let threeOut = this.formData.three_signOut_Date
                let status = this.compareDate(threeIn,val)
                if(status){
                    return val
                }
                return "次日 "+val
            },
            compareDate(d1,d2){
                d1 = "2018-03-19"+" "+ d1
                d2 = "2018-03-19"+" "+ d2
                return ((new Date(d1.replace(/-/g,"\/"))) < (new Date(d2.replace(/-/g,"\/"))));
               
            },onclick(type){
                let value = ""
                if(type == 1){
                    value = this.formData.one_signIn_Date
                }else if(type == 2){
                    value = this.formData.one_signOut_Date
                }else if(type == 3){
                    value = this.formData.two_signIn_Date
                }else if(type == 4){
                    value = this.formData.two_signIn_Date
                }else if(type == 5){
                    value = this.formData.three_signIn_Date
                }else if(type == 6){
                    value = this.formData.three_signIn_Date
                }
                let _this = this
                this.$vux.datetime.show({
                    cancelText: '取消',
                    confirmText: '确定',
                    format: 'HH:mm',
                    value:value,
                    onConfirm (val) {
                        if(type == 1){
                            _this.formData.one_signIn_Date =  _this.oneIn(val)
                        }else if(type == 2){
                            _this.formData.one_signOut_Date = _this.oneOut(val)
                        }else if(type == 3){
                            _this.formData.two_signIn_Date = _this.twoIn(val)
                        }else if(type == 4){
                            _this.formData.two_signOut_Date = _this.twoOut(val)
                        }else if(type == 5){
                            _this.formData.three_signIn_Date = _this.threeIn(val)
                        }else if(type == 6){
                            _this.formData.three_signOut_Date = _this.threeOut(val)
                        }
                    }
                })
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    @import '../../../assets/stylus/unify.styl';
    .content {
        overflow: auto;
        background: #fbf9fe;
    }
    .vux-checker-box {
        border: 1px solid #ff8000;
        border-radius:5px;
        display: inline-flex;
    }
    .demo1-item {
        border-left: 1px solid #ff8000;
        padding: 5px 10px;
    }
    .demo1-item:first-child {
        border-left: 0px;
    }
    .demo1-item-selected {
        color:#fff;
        background-color:  #ff8000;
    }
    .tag-group {
        padding-left: 25px;
    }
    .vux-datetime.weui-cell.weui-cell_access p{
        text-align:left;
        padding-left:10px;
    }
</style>
