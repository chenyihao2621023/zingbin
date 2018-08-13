<template>
    <div class="attendanceSystem">
        <ZingHead title="考勤制度"></ZingHead>
        <div class="content">
                <div class="system">
                    <div class="system-title">迟到</div>
                    <group label-width="8em" label-margin-right="2em" label-align="left">
                            <x-input  title="可迟到次数"  text-align="left"   v-model="formData.lateInCount" placeholder="可迟到次数"></x-input>
                            <popup-picker title="超过次数扣薪方式" :data="lateInDeductTypeList" v-model="lateInDeductType" @on-change="lateInDeductTypeFun"></popup-picker>
                            <x-input  :title="lateInDeductTitle"     text-align="left" v-model="formData.lateInNumber" :placeholder="lateInDeductTitle"></x-input>
                    </group>
                </div>
                <div class="system">
                    <div class="system-title">早退</div>
                    <group label-width="8em" label-margin-right="2em" label-align="left">
                            <x-input  title="可早退次数"  text-align="left"  v-model="formData.eralyOutCount"  placeholder="必填"></x-input>
                            <popup-picker title="超过次数扣薪方式" :data="eralyOutDeductTypeList" v-model="eralyOutDeductType" @on-change="eralyOutDeductTypeFun"></popup-picker>
                            <x-input  :title="eralyOutCountTitle"     text-align="left" v-model="formData.eralyOutNumber"  :placeholder="eralyOutCountTitle"></x-input>
                    </group>
                </div>
                <div class="system">
                    <div class="system-title">旷工</div>
                    <group label-width="8em" label-margin-right="2em" label-align="left">
                            <x-input  title="旷工次数"  text-align="left"    v-model="formData.absenteeismCount" placeholder="必填"></x-input>
                            <popup-picker title="超过次数扣薪方式" :data="absenteeismDeductTypeList" v-model="absenteeismDeductType" @on-change="absenteeismDeductTypeFun"></popup-picker>
                            <x-input  :title="absenteeismCountTitle"     text-align="left"  v-model="formData.absenteeismNum" :placeholder="absenteeismCountTitle"></x-input>
                    </group>
                </div>
                <div class="system">
                    <div class="system-title">考勤优先方式</div>
                    <group label-width="6em" label-margin-right="2em" label-align="right">
                        <checklist :max="1"  :options="commonList" v-model="radioValue" ></checklist>
                    </group>

                </div>
                <div class="system">
                    <div class="system-title">选择现有科目</div>
                    <group label-width="6em" label-margin-right="2em" label-align="right">
                        <cell title="科目名称" :value="filename" is-link @click.native="togglePicker"></cell>
                    </group>
                </div>
                <br/><br/>
                <flexbox>
                    <flexbox-item>
                        <x-button type="primary btn-common"  @click.native="submit">确认提交</x-button>
                    </flexbox-item>
                </flexbox>
        </div>
        <!--科目组件-->
        <subject-picker :showPicker="showPicker" @picked="onPicked" @abort="onPickAbort"></subject-picker>
    </div>
</template>

<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import SubjectPicker from 'components/subjectpicker/SubjectPicker';
    import { PopupPicker,Group,XInput,Flexbox, FlexboxItem,XButton,Checklist ,Cell} from 'vux'
    export default {
        name: "attendance-system",
        components: {
            ZingHead,SubjectPicker,Cell,
            PopupPicker,Group,XInput,Flexbox, FlexboxItem,XButton,Checklist 
        },
        data() {
            return {
                commonList:['正常考勤', '外勤考勤'],
                radioValue: ['正常考勤'],

                showPicker:false,
                filename:"请选择科目名称",
                ckSubjectId:"",

                lateInDeductTypeList:[["固定金额","工资比例"]],
                lateInDeductType:['固定金额'],
                lateInDeductTitle:"固定金额",

                eralyOutDeductTypeList:[["固定金额","工资比例"]],
                eralyOutDeductType:["固定金额"],
                eralyOutCountTitle:"固定金额",

                absenteeismDeductTypeList:[["固定金额","工资比例"]],
                absenteeismDeductType:["固定金额"],
                absenteeismCountTitle:"固定金额",

                formData:{
                    lateInCount:"",
                    lateInDeductType:"",
                    lateInNumber:"",
                    eralyOutCount:"",
                    eralyOutDeductType:"",
                    eralyOutNumber:"",
                    absenteeismCount:"",
                    absenteeismDeductType:"",
                    absenteeismNum:"",
                    choiceAttendanceType:"",
                    ckSubjectId:"",
                    ckSubjectName:"",
                    ckSubjectPath:""
                }
            }
        },
        watch: {
           
        },
        created() {
            this.getAttendanceSystem()
        },
        methods: {
            getAttendanceSystem() {
                let url = "/zingbiz/attendance/attendanceSystem/getAttendanceSystem"
                this.$http.post(url,{}).then(res => {
                   let retData = res.data.data
                   if(retData && retData.rowId){
                       this.formData.rowId = retData.rowId
                       this.formData.companyId = retData.companyId
                       this.formData.lateInCount = retData.lateInCount
                       this.formData.lateInDeductType = retData.lateInDeductType
                       this.formData.lateInNumber = retData.lateInNumber
                       this.formData.eralyOutCount = retData.eralyOutCount
                       this.formData.eralyOutDeductType = retData.eralyOutDeductType
                       this.formData.eralyOutNumber = retData.eralyOutNumber
                       this.formData.absenteeismCount = retData.absenteeismCount
                       this.formData.absenteeismDeductType = retData.absenteeismDeductType
                       this.formData.absenteeismNum = retData.absenteeismNum
                       this.formData.ckSubjectId = retData.ckSubjectId
                       this.formData.ckSubjectName = retData.ckSubjectName
                     
                       //特殊处理的数据
                       this.lateInDeductType = [retData.lateInDeductType]
                       this.eralyOutDeductType = [retData.eralyOutDeductType]
                       this.absenteeismDeductType = [retData.absenteeismDeductType]
                       
                       let choiceAttendanceType = ""
                       if(retData.choiceAttendanceType && retData.choiceAttendanceType == "1"){
                            choiceAttendanceType = "正常考勤"
                            this.formData.choiceAttendanceType = "正常考勤"
                       }else if(retData.choiceAttendanceType && retData.choiceAttendanceType == "2"){
                            choiceAttendanceType = "外勤考勤"
                            this.formData.choiceAttendanceType = "外勤考勤"
                       }

                       this.radioValue = [choiceAttendanceType]
                       this.filename = retData.ckSubjectName
                   }
                })
            },
            submit() {
                if(this.radioValue[0] == "正常考勤"){
                    this.formData.choiceAttendanceType = "1"
                }else if(this.radioValue[0] == "外勤考勤"){
                    this.formData.choiceAttendanceType = "2"
                }
                this.formData.ckSubjectId = this.ckSubjectId
                this.formData.ckSubjectName = this.filename
                if(this.formData.lateInCount && this.formData.lateInCount == ""){
                    this.$vux.toast.text("迟到次数不能为空!", 'bottom')
                    return false
                }
                if(this.formData.lateInDeductType && this.formData.lateInDeductType == ""){
                    this.$vux.toast.text("请选择迟到超过次数扣薪方式!", 'bottom')
                    return false
                }
                if(this.formData.lateInNumber && this.formData.lateInNumber == ""){
                    this.$vux.toast.text("迟到金额不能为空!", 'bottom')
                    return false
                }
                if(this.formData.eralyOutCount && this.formData.eralyOutCount == ""){
                    this.$vux.toast.text("早退不能为空!", 'bottom')
                    return false
                }
                if(this.formData.eralyOutDeductType && this.formData.eralyOutDeductType == ""){
                    this.$vux.toast.text("请选择早退超过次数扣薪方式!", 'bottom')
                    return false
                }
                if(this.formData.eralyOutNumber && this.formData.eralyOutNumber == ""){
                    this.$vux.toast.text("早退金额不能为空!", 'bottom')
                    return false
                }
                if(this.formData.absenteeismCount && this.formData.absenteeismCount == ""){
                    this.$vux.toast.text("旷工次数不能为空!", 'bottom')
                    return false
                }
                if(this.formData.absenteeismDeductType && this.formData.absenteeismDeductType == ""){
                    this.$vux.toast.text("请选择超过旷工扣薪方式!", 'bottom')
                    return false
                }
                if(this.formData.absenteeismNum && this.formData.absenteeismNum == ""){
                    this.$vux.toast.text("旷工固定金额不能为空!", 'bottom')
                    return false
                }
                let url = ""
                if(this.formData.rowId){
                    url = "/zingbiz/attendance/attendanceSystem/updateAttendanceSystem"
                }else{
                    url = "/zingbiz/attendance/attendanceSystem/addAttendanceSystem"
                }
                this.$http.post(url,this.formData).then(res => {
                    this.$router.go(-1)
                })
            },
            lateInDeductTypeFun(val){
                let mess = ""
                if(val[0] == "固定金额"){
                    mess = "固定金额"
                   
                }else if(val[0] == "工资比例"){
                    mess = "工资比例"
                }
                this.lateInDeductTitle = mess
                this.formData.lateInDeductType = mess
            },
            eralyOutDeductTypeFun(val){
                let mess = ""
                if(val[0] == "固定金额"){
                    mess = "固定金额"
                   
                }else if(val[0] == "工资比例"){
                    mess = "工资比例"
                }
                this.eralyOutCountTitle = "固定金额"
                this.formData.eralyOutDeductType = mess
            },
            absenteeismDeductTypeFun(val){
                let mess = ""
                if(val[0] == "固定金额"){
                    mess = "固定金额"
                   
                }else if(val[0] == "工资比例"){
                    mess = "工资比例"
                }
                this.absenteeismCountTitle = "固定金额"
                this.formData.absenteeismDeductType = mess
            },
           
            onPicked:function (item) {
                this.showPicker = false
                this.filename = item.filename
                this.ckSubjectId = item.fileId
            },
            onPickAbort() {
                this.showPicker = false
            },
            togglePicker:function () {
                this.showPicker = true;
            }
        }
    }
</script>

<style  lang="stylus" rel="stylesheet/stylus" scoped>
    .attendanceSystem {
        height: 100%;
    }
    .content {
        height calc(100% - 50px);
        overflow-y: auto;
    }
    .system{
       
        &-title{
            height 40px
            line-height 40px
            background-color #ff8000
            padding-left 15px
            color #fff
            &-list{
                color #858585 !important
            }
            &-value{
                font-size 14px !important
            }
        }
    }
    .btn{
        width 90% !important
        margin-left 5%
    }
</style>
