<template>
    <div class="attenDateTem">
        <popup v-model="showAttenDatePicker" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div v-show="modelType == 'dateList'" class="subject-picker-popup">
                <ZingHead title="班次设置" :isComeBack="false" @doSome="doSome">
                    <div slot="header-right">
                          <span class="header-jiahao" @click="addDate">
                                <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                                    <i class="iconfont icon-gengduo"></i>
                                </a>
                          </span>
                    </div>
                </ZingHead>
                <div v-if="dataList.length > 0" class="subject-picker-popup">
                    <div class="tree-detail-panel subject-picker-detail" >
                        <Atten-CheckList class="leaf-list"
                            v-model="dateChecklist"
                            :max="multipleMode ? NaN : 1"
                            :disabled="false"
                            :list="dataList"
                            @goAttenDateTem="editDate"
                            @godelAttenDateTem="delAttenDateTem">
                        </Atten-CheckList>
                    </div>
                    <x-button style="margin-bottom: 0px;" class="subject-picker-button" type="primary" :disabled="dateChecklist.length === 0" @click.native="saveBtn">保存
                    </x-button>
                </div>
                <div v-else>
                    <p class="noData">暂无任何班次信息</p>
                </div>
            </div>
            <div v-show="modelType == 'dateSet'">
                <Add-Date
                    :curItem="curItem"
                    @goAttenDateTem="onGoAttenDateTem">
                </Add-Date>
            </div>
        </popup>
    </div>
</template>


<script>
    import {Popup ,Checklist ,XButton} from 'vux'
    import ZingHead from "@/components/zingHead/ZingHead"
    import AttenCheckList from './attenCheckList'
    import AddDate from './addDate'
    export default {
        components: {
            ZingHead,
            Popup,
            Checklist,
            XButton,
            AttenCheckList,
            AddDate
        },
        props:{
            showAttenDatePicker: { //是否显示
                type: Boolean,
                default: function () {
                    return false
                }
            },
            multipleMode: {//true-多选，false -单选
                type: Boolean,
                default: function () {
                    return false
                }
            },
            selDateIDs:""
        },
        data () {
            return {
                dateChecklist: [],//时间选中的数据
                modelType:'dateList',//dateList-时间列表 dateSet-时间的配置
                curItem:'',//考勤时间数据
                dataList:[],//原始数据
                dataMap:{},//处理后的数据
                goBack:""//返回标识

            }
        },
        watch:{
            modelType(val){
                let goBack = this.goBack
                if(val == "dateList" && goBack == ''){
                    this.dataList = []
                    this.dataMap = {}
                    this.getAttendanceDateList()
                }
            },
            selDateIDs(val){
                if(val){
                    if(this.multipleMode == true){
                        let valArr = val.split(" ")
                        this.dateChecklist = []
                        this.dateChecklist = this.dateChecklist.concat(valArr)
                    }else{
                        this.dateChecklist.push(val)
                    }
                }
            }
        },
        created: function () {
            this.getAttendanceDateList()
        },
        computed: {

        },
        methods: {
            doSome(){
                this.$emit('goAttenSetting')
            },
            saveBtn (){
                let _this = this
                let idlist = this.dateChecklist
                let titlelist = []
                idlist.forEach(id => {
                    titlelist.push(_this.dataMap[id].title)
                })
                this.$emit('selDateClicked', this.dateChecklist.join(" "),titlelist.join(","))
            },
            addDate() {
                //默认数据
                this.curItem = {
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
                this.modelType = "dateSet"
            },
            onGoAttenDateTem(data) {
                if(data && data.goBack == "fh"){
                    this.goBack = "fh"
                }else{
                    this.goBack = ""
                }
                this.modelType = "dateList"
            },
            editDate(item) {
                this.curItem = item
                this.modelType = "dateSet"
            },
            delAttenDateTem(item){
                let parmas = {
                    rowId : item.rowId,
                    companyId : item.companyId,
                    attenDateId : item.rowId
                }
                let url = "/zingbiz/attendance/attendancesetting/delAttendanceDate"
                this.$http.post(url,parmas).then(res => {
                      if(res.data.data){
                          this.$vux.toast.text("使用中的班次不能删除！")
                      }else{
                           let _this = this
                           let rowId = item.rowId
                            _this.dataList = _this.dataList.filter(obj => {
                                    return rowId !== obj.rowId
                            })
                            this.$vux.toast.show({text:"删除成功！",type:"success",onHide (){}})
                      }
                })
            },
            getAttendanceDateList(){
                let _this = this
                let url = "/zingbiz/attendance/attendancesetting/getAttendanceDateList"
                this.$http.post(url,{})
                    .then(res => {
                        let retData = res.data.data
                        retData.forEach(item => {
                            if(item.dateName.length > 20){
                                item.dateName = item.dateName.substring(0,10) + "..."
                            }
                            item.key = item.rowId
                            item.title = item.dateName
                            _this.dataList.push(item)
                            _this.dataMap[item.rowId] = item
                        })

                    })
            }

        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';
    .attenDateTem
        .subject-picker-popup
            display flex
            flex-direction column
            background-color $component-background
            width 100%
            height 100%
            .subject-picker-detail
                flex-grow 1
                overflow-y auto
            .subject-picker-button
                flex-shrink 0
                width calc(100% - 6px)
                margin-bottom 3px
    .noData{
        text-align: center;
        font-size: 16px;
        color: #ff8000;
        margin-top: 15px;
    }
</style>
