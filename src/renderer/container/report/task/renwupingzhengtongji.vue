<!--suppress ALL -->
<template>
    <div class="renwupingzhengtongji">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="任务凭证统计">
            <div slot="header-right">
                <span class="header-search" @click="searchForm">
                  <i class="iconfont icon-fangdajing"></i>
                </span>
              <!--  <span class="header-jiahao">
                    <dropdown :data="rightMenu" trigger="click" placement="bottomRight" @item-click="handleMenu">
                        <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                            <i class="iconfont icon-gengduo"></i>
                        </a>
                    </dropdown>
                </span>-->
            </div>
        </zing-head>
        <!-- tab页 -->
        <div class="vue-tab" :style="{ marginTop: tabMarginTop + 'px'}">
            <tab class="tab-main" :line-width="1">
                <tab-item :selected="defTab === item" v-for="(item, index) in tabTitle" @on-item-click="changeTab"
                          @click="defTab = item" :key="index" class="report-tab">{{item}}
                </tab-item>
            </tab>
        </div>
        <!-- tab内容 -->
        <div class="tab-content">

            <div class="scroll-list-wrap">
                <br/>
                <p style="margin: 8px;color:rgb(115, 115, 115);">日期: {{ retDateScope }}</p>
                <hr style="border-color: #fff6;"/>
                <p style="margin: 8px;color:rgb(115, 115, 115);">凭证总额: {{ retTotalMoney }}</p>
                <div>

                    <!--图表组件-->
                    <div style="width:350px !important; height:300px !important; margin:0 auto;overflow-x:scroll;" id="ChartDiv" >

                    </div>
                </div>
                <hr style="border-color: #fff6;"/>
                    <el-table
                        :data="restaurantList"
                        style="width: 100%"
                    >
                        <el-table-column
                            prop="title"
                            label="子任务名称"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="count"
                            label="任务总数"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="money"
                            label="凭证金额"
                        >
                        </el-table-column>
                    </el-table>

            </div>
        </div>
        <!--日期弹框-->
        <form-dialog
            ref="dialog2"
            v-model="showDateDialog"
            :title="'统计日期'"
            :showForm="true"
            :formAttrs="formAttrs2"
            @on-cancel="onCancel"
            @on-confirm="onConfirm"
            @on-show="onShow"
            @on-hide="onHide">
        </form-dialog>
        <div v-transfer-dom>
            <popup v-model="showSearchForm" height="100%">
                <popup-header title="查询条件"></popup-header>
                <group>
                    <selector title="任务集类型" placeholder="选择任务集分类"
                              :options="taskSetTypeList" @on-change="taskSetTypeChange" v-model="tastVal"></selector>

                    <selector title="子分类名称" placeholder="选择自定义子分类"
                              :options="chileTaskSetTypeList" @on-change="chileTaskSetTypeChange" v-model="chileTastVal"></selector>

                    <x-input title="任务集创建人" placeholder="选择任务集创建人" v-model="cardUrl" :show-clear="true" @on-focus="showPickerShow"></x-input>

                    <selector title="任务集名称" placeholder="选择任务集名称" v-model="form.rwjmc"
                              :options="taskSetNameList" @on-change="taskSetNameChange"></selector>



                    <selector title="报表名称" placeholder="选择报表名称" v-model="form.bbmc"
                              :options="bbmcList" @on-change="bbmcListChange"></selector>
                    <div class="zdyForm" style="display: none;">
                        <x-input title="凭证类型" placeholder="选择凭证类型，默认为全部" v-model="form.pzlx" @on-focus="showPzType"></x-input>

                        <x-input title="统计科目" placeholder="选择科目，默认为全部" v-model="form.tjkm" @on-focus="onSubjectFocus"></x-input>

                        <selector title="凭证范围" placeholder="选择凭证范围" v-model="form.pzfw"
                                  :options="ckTypeList" @on-change="onChange"></selector>
                        <group title="成员范围">
                            <radio :options="radio001" @on-change="radioChange" v-model="form.cyfw"></radio>
                        </group>
                        <x-input title="成员名称" placeholder="选择成员名称" v-model="form.cymc"
                                 class="zdcyClass" style="display: none;" @on-focus="showUserPickerShow"></x-input>

                    </div>


                    <flexbox>
                        <flexbox-item>
                            <x-button type="primary" @click.native="showSearchForm = false">取消</x-button>
                        </flexbox-item>
                        <flexbox-item>
                            <x-button :gradients="['#40AFFC','#40AFFC']" @click.native="reset">重置</x-button>
                        </flexbox-item>
                        <flexbox-item>
                            <x-button type="primary" @click.native="doSearch">查询</x-button>
                        </flexbox-item>
                    </flexbox>
                </group>
            </popup>
        </div>
        <!--选人组件-->

        <org-member-picker
            :showTab="showTab"
            :showPicker="showPicker"
            @abort="onmemberPickAbort"
            @picked="onmemberPicked"
            :initialSelectedType="initialSelectedType"
        ></org-member-picker>
        <!-- 多选列表 -->
        <check-list-dialog
            ref="dialog3"
            v-model="showCheckList"
            :title="'凭证类型'"
            :showForm="true"
            :formAttrs="formAttrs3"
            :objectList="objectList"
            @on-cancel="onCancel"
            @on-confirm="onGoodList_Confirm"
            @on-show="onShow"
            @on-hide="onHide"
            @on-change="checkChange"
            style="min-height:200">
        </check-list-dialog>

        <subject-picker :showPicker="showSubjectPicker" @picked="onPicked"
                        @abort="showSubjectPicker = false" :multipleMode="true"></subject-picker>
    </div>

</template>

<script>
    import {
        Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup, Flexbox,
        FlexboxItem, XButton,XInput,PopupHeader,Selector,Radio ,VChart, VLine, VArea, VTooltip, VLegend, VBar, VScale
    } from 'vux'
    import Chart from 'chart.js';
    import ZingHead from "@/components/zingHead/ZingHead";
    import FormDialog from '@/components/formdialog/FormDialog'
    import OrgMemberPicker from "../../../components/orgmemberpicker/OrgMemberPicker"
    import CheckListDialog from '../../report/report-components/CheckListDialog'
    import SubjectPicker from 'components/subjectpicker/SubjectPicker'
    export default {
        name: "renwupingzhengtongji",
        components: {
            ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,VChart, VLine, VArea, VTooltip, VLegend, VBar, VScale,
            Flexbox, FlexboxItem, XButton, FormDialog,XInput,PopupHeader,Selector,OrgMemberPicker,Radio,CheckListDialog,SubjectPicker
        },
        data() {
            return {
                tabTitle: ['当天', '本周', '本月', '本季', '本年', '自定义'],
                tabMarginTop: 0,
                defTab: "当天",
                tabIndex: 0,
                formAttrs2: [
                    {
                        title: '开始时间',
                        type: 'datetime',
                        placeholder: '输入开始时间',

                    },
                    {
                        title: '结束时间',
                        type: 'datetime',
                        placeholder: '输入结束时间',

                    }
                ],
                restaurantList: [],
                restaurantListChart:[],
                retDateScope: '',
                retTotalMoney: '0',
                retMoneySum: {},
                curDate: '',
                startDate: '',
                endDate: '',
                showDateDialog: false,
                showSearchForm:false,
                taskSetTypeList:[{ key: 'superWork', value: '共有分类' }, { key: 'work', value: '私有分类' }],
                chileTaskSetTypeList:[],
                taskSetNameList:[],
                ckTypeList:[{ key: 'ALL', value: '全部凭证' }, { key: 'YGZ', value: '已结账凭证' },{ key: 'YSH', value: '已审核凭证' }, { key: 'DSH', value: '未审核凭证' }],
                ckType:'全部凭证',
                radio001: ['全体成员', '指定成员'],
                form : {
                    rwjmc:'',
                    bbmc:'',
                    pzlx:'',
                    tjkm:'',
                    pzfw:'',
                    cyfw:'',
                    cymc:'',
                },
                userName:'',
                chileTastVal:'',
                tastVal:'',
                showTab:["colleague","role","friends"],
                initialSelected:[],
                initialSelectedType: 'cardUrl',
                output: '',
                showPicker:false,
                cardUrl:'',
                inputValue:'',
                inputUserValue:'',
                bbmcList:[],
                createOrUser:false,
                showCheckList:false,
                formAttrs3: [
                    {
                        title: '凭证类型',
                        type: 'checklist',
                        isShowTitle: 'true'
                    }
                ],
                objectList: [
                    { key: 'CW', value: '财务库' },
                    { key: 'otherIn', value: '其他入库单' },
                    { key: 'otherOut', value: '其他出库单' },
                    { key: 'buyIn', value: '采购入库单' },
                    { key: 'buyBack', value: '采购退货单' },
                    { key: 'saleOut', value: '销售订单' },
                    { key: 'saleBack', value: '销售退货单' },
                    { key: 'SAlARY', value: '工资条' },
                ],
                goodList: [],
                goodIdList: [],
                inputGoodVal:'',
                inputGoodId:'',
                showSubjectPicker:false,
            }
        },computed:{

        }, created() {
            // this.tabWidth = document.documentElement.offsetWidth || document.body.offsetWidth
            this.curDate = this.getCurDate().nyr
             this.selectBoardListById();
             this.getAllTaskSetType();
            this.showSearchForm = true;

        },
        methods: {

            changeTab(index) {
                if (index === 0) {
                    this.tabIndex = 0
                    //alert("当天");
                    this.getDataListByIndex('dt');
                } else if (index === 1) {
                    this.tabIndex = 1
                    //alert("本周");
                    this.getDataListByIndex('bz');
                } else if (index === 2) {
                    this.tabIndex = 2
                    //alert("本月");
                    this.getDataListByIndex('by');
                } else if (index === 3) {
                    this.tabIndex = 3
                    //alert("本季");
                    this.getDataListByIndex('bj');
                } else if (index === 4) {
                    this.tabIndex = 4
                    //alert("本年");
                    this.getDataListByIndex('bn');
                } else if (index === 5) {
                    this.tabIndex = 5
                    this.selectDateForm();
                    //alert("自定义");

                }

            },
            doSearch(type) {

                this.changeTab(this.tabIndex);
            },
            getDataListByIndex(type) {
                if (this.form.rwjmc === '') {
                    this.$vux.toast.text("请选择任务集名称!", 'bottom')
                    return false
                }
                if (this.form.bbmc === '') {
                    this.$vux.toast.text("请选择报表名称!", 'bottom')
                    return false
                }
                let self = this;
                var url = "/zingbiz/report/tastset_report/getSelModelQuery";
                if (self.form.bbmc === 'zdy') {
                    url = "/zingbiz/report/tastset_report/getCustomQuery";
                }


                if (type !== undefined) {
                    if (type !== 'zdy') {
                        this.form.dateType = type;
                        this.form.is_ZDY = 'false';

                    } else {
                        this.form.is_ZDY = 'true';
                        this.form.startDate = self.startDate;
                        this.form.endDate = self.endDate;

                    }
                }
                this.form.cymc = this.inputUserValue;
                self.$http.post(url, this.form).then(res => {
                    let money = '0';
                    let dataTemp = res.data.data;
                    if (dataTemp && dataTemp.data) {
                        var rd = dataTemp.data;

                        if (rd.length > 0) {
                          money = rd[rd.length - 1].money;
                        }

                        self.restaurantList = rd;

                        self.restaurantListChart = self.restaurantList.slice(0,self.restaurantList.length - 1);


                        for (let i = 0; i < self.restaurantListChart.length; i++) {
                            self.restaurantListChart[i].money = parseFloat(self.restaurantListChart[i].money);
                        }
                        this.initChart(self.restaurantListChart);
                        console.log("self.restaurantListChart====",self.restaurantListChart);
                        console.log("self.restaurantList====",self.restaurantList);
                    }

                    this.retTotalMoney = money;
                    let dateMap = res.data.data.dateTime[0];
                    this.retDateScope = dateMap.startDate + '-' + dateMap.endDate;
                });
                this.showSearchForm = false;
            },
            getCurDate() {
                let dateObj = new Date(); //表示当前系统时间的Date对象
                let year = dateObj.getFullYear(); //当前系统时间的完整年份值
                let month = dateObj.getMonth() + 1; //当前系统时间的月份值
                let date = dateObj.getDate(); //当前系统时间的月份中的日
                let day = dateObj.getDay(); //当前系统时间中的星期值
                let weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
                let week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
                let hour = dateObj.getHours(); //当前系统时间的小时值
                let minute = dateObj.getMinutes(); //当前系统时间的分钟值
                let second = dateObj.getSeconds(); //当前系统时间的秒钟值
                //如果月、日、小时、分、秒的值小于10，在前面补0
                if (month < 10) {
                    month = "0" + month;
                }
                if (date < 10) {
                    date = "0" + date;
                }
                if (hour < 10) {
                    hour = "0" + hour;
                }
                if (minute < 10) {
                    minute = "0" + minute;
                }
                if (second < 10) {
                    second = "0" + second;
                }
                return {
                    nyr: year + "-" + month + "-" + date,
                    sfm: hour + ":" + minute + ":" + second,
                    week: week
                }
            },
            selectDateForm() {

                this.showDateDialog = true;
            },
            doSome() {
                this.showDateDialog = false;
            },
            startChange(val) {
                this.startDate = val
            },
            endChange(val) {
                this.endDate = val
            },
            onCancel() {
                console.log('onCancel')
            },
            onConfirm(msg) {
                console.log('onConfirm', msg)
                this.startDate = msg[0];
                this.endDate = msg[1];
                if (this.startDate === '') {
                    this.$vux.toast.text("请选择开始时间!", 'bottom')
                    return false
                }
                if (this.endDate === '') {
                    this.$vux.toast.text("请选择结束时间!", 'bottom')
                    return false
                }
                 this.getDataListByIndex('zdy');
            },
            onShow() {
                console.log('onShow')
            },
            onHide() {
                console.log('onHide')
            },
            searchForm() {
                this.showSearchForm = true;
                var inputArr = [];
                inputArr.push(this.inputGoodVal);
                this.$refs.dialog2.setFormValues(inputArr);
            },
            taskSetTypeChange (val) {
                console.log("this.taskSetType",val)
                this.tastVal = val;
                this.selectTaskSetType(val);
            },
            chileTaskSetTypeChange(val) {
                this.chileTastVal = val;
                this.selectBoardListById();
            },
            radioChange (value, label) {
                console.log('change:', value, label)
                this.form.cymc = '';
                if (value === '指定成员') {
                    $('.zdcyClass').css("display","block");
                } else {
                    $('.zdcyClass').css("display","none");
                }
            },
            selectTaskSetType(val) {
                //获取分类
                let url = "/zingbiz/common/serviceModule/getAllServiceTypeByCardUrl";
                let params = {
                    tagType: val,
                    pageNumber: 1,
                    pageSize: 2000,
                    isCompanyId : 'true'
                };
                this.chileTaskSetTypeList = [];
                this.$http.post(url, params).then(response => {
                    if (response.data.success === true) {
                       let rd = response.data.data.data;
                        if (rd.length > 0) {
                            for (let i in rd) {
                                rd[i].key = rd[i].tags;
                                rd[i].value = rd[i].tags;
                                this.chileTaskSetTypeList.push(rd[i]);
                            }
                        }
                    } else {

                    }
                });
            },
            selectBoardListById() {
                //获取任务集

            let self = this;
            var url = "/zingbiz/report/tastset_report/getBoardListByQuery";
            let param = {
                tagType:this.tastVal,
                tags:this.chileTastVal,
                createName:this.inputValue,
            }

            self.$http.post(url, param)
                .then(res => {
                    this.taskSetNameList.splice(0,this.taskSetNameList.length);
                    console.log("res===",res);
                    let dataTemp = res.data.data;
                    if (dataTemp ) {
                        let rd = dataTemp;
                        console.log("rd===",rd);
                        if (rd.length > 0) {
                            for (let i in rd) {
                                rd[i].key = rd[i].boardId;
                                rd[i].value = rd[i].title;
                                 self.taskSetNameList.push(rd[i]);
                            }
                        }
                    }
                    console.log("self.taskSetNameList===",self.taskSetNameList);
                })
                .catch((e) => {
                    console.log("error:",e);
                    this.$message({ type: "error", message: "列表数据获取失败，请重试" });
                });
        },    //确定的回调
            onmemberPicked (list) {
                console.log('onPicked', list);
                this.output = list;

                console.log('methods onPicked ',list.map(item => item.userName).toString());
                if (this.createOrUser === true) {
                    this.cardUrl = list.map(item => item.userName).toString();
                } else {
                    this.userName = list.map(item => item.userName).toString();
                }

                if (this.initialSelectedType === 'rowId') {
                    this.initialSelected = list.map(item => item.rowId)
                } else {
                    console.log('methods onPicked ',list.map(item => item.cardUrl));
                    this.initialSelected = list.map(item => item.cardUrl)
                }
                if (this.createOrUser === true) {
                    for (let i in this.initialSelected) {
                        if (i === this.initialSelected.length - 1) {
                            this.inputValue += this.initialSelected[i];
                        } else {
                            this.inputValue += this.initialSelected[i] + ",";
                        }
                    }
                } else {
                    for (let i in this.initialSelected) {
                        if (i === this.initialSelected.length - 1) {
                            this.inputUserValue += this.initialSelected[i];
                        } else {
                            this.inputUserValue += this.initialSelected[i] + ",";
                        }
                    }
                }

                console.log("this.inputValue",this.inputValue);
                console.log("this.inputUserValue",this.inputUserValue);
                this.showPicker = false
                this.showDateDialog = false;
                this.selectBoardListById();
            },
            //取消的回调
            onmemberPickAbort () {
                this.showPicker = false
            },
            showPickerShow () {
                this.createOrUser = true;
                this.showPicker = true
            },
            showUserPickerShow() {
                this.createOrUser = false;
                this.showPicker = true
            },
            taskSetNameChange(val) {
             this.form.rwjmc = val;
            },
            bbmcListChange (val) {
                if (val === 'zdy') {
                   $(".zdyForm").css("display","block");
                } else {
                    $(".zdyForm").css("display","none");
                }

            },
            getAllTaskSetType() {
                //获取报表查询集合
                let self = this;
                var url = "/zingbiz/report/tastset_report/getAllTaskSetType";
                let param = {

                }
                 this.bbmcList = [];
                self.$http.post(url, param)
                    .then(res => {
                        console.log("res===",res);
                        let dataTemp = res.data.data;
                        if (dataTemp ) {
                            let rd = dataTemp;
                            console.log("rd===",rd);
                            if (rd.length > 0) {
                                for (let i in rd) {
                                    rd[i].key = rd[i].rowId;
                                    rd[i].value = rd[i].reportName;
                                    self.bbmcList.push(rd[i]);
                                }
                            }
                        }
                        let zdy = { key: 'zdy', value: '自定义分类' };
                        self.bbmcList.push(zdy);

                    })
                    .catch((e) => {
                        console.log("error:",e);
                        this.$message({ type: "error", message: "列表数据获取失败，请重试" });
                    });
            },
            onGoodList_Confirm(msg) {
                console.log('onGoodList_Confirm', this.goodIdList, this.goodNameList);

                var datalist = '';
                var dataidlist = '';
                if (this.goodNameList.length > 0) {
                    let list = this.goodNameList;
                    let idlist = this.goodIdList;
                    let len = this.goodNameList.length;
                    for (let i = 0; i < len; i++) {
                        if (len - 1 === i) {
                            datalist += list[i];
                            dataidlist += idlist[i];
                        } else {
                            datalist += list[i] + ","
                            dataidlist += idlist[i] + ","
                        }
                    }
                }
                this.inputGoodVal = datalist;
                this.inputGoodId = dataidlist;
                this.form.pzlx = dataidlist;


            },
            checkChange(val, label) {

                console.log('checkChange', val, label)
                this.goodIdList = val;
                this.goodNameList = label;

            },
            showPzType() {
                this.showCheckList = true;
            },
            onSubjectFocus() {

                this.showSubjectPicker = true;
            },
            onPicked (item) {
                console.log('onPicked', item)
                if (item.length > 0) {
                    for (let i = 0; i < item.length; i++) {
                        if (item.length - 1 === i) {
                            this.form.tjkm += item[i].fileId;
                        } else {
                            this.form.tjkm += item[i].fileId + ","
                        }
                    }
                } else {

                }
                console.log('this form', this.form);
                this.showSubjectPicker = false
            },
            onPickAbort () {
                this.showSubjectPicker = false
            },
            reset() {

                this.tastVal = '';
                this.chileTastVal = '';
                this.cardUrl = '';
                this.form = {};
            },initChart(data){
                Chart.defaults.global.animation.duration = 1000;
                Chart.defaults.global.animation.easing = "easeInOutCubic";
                Chart.defaults.global.responsive = true;
                Chart.defaults.global.barThickness=200;
                var widthChart=document.documentElement.clientWidth ;
                widthChart=widthChart-50;
                var widthDiv=data.length;
                if(widthDiv<5){
                    widthDiv=widthDiv*150;
                }else{
                    widthDiv=widthDiv*80;
                }
                $('#Char_ZongZhang_one').remove();
                $('#ChartDiv').append('<canvas id="Char_ZongZhang_one" style="margin-left:10px;width:'+widthDiv+'px; height:290px;"></canvas>');
                $("#Char_ZongZhang_one").css({ "display":"block" });
                var ctx = document.getElementById("Char_ZongZhang_one").getContext("2d");
                $("#ChartDiv").css("width",widthChart+"px");


                // Define a plugin to provide data labels
                Chart.plugins.register({
                    afterDatasetsDraw: function(chart, easing) {
                        // To only draw at the end of animation, check for easing === 1
                        var ctx = chart.ctx;

                        chart.data.datasets.forEach(function (dataset, i) {
                            var meta = chart.getDatasetMeta(i);
                            if (!meta.hidden) {
                                meta.data.forEach(function(element, index) {
                                    // Draw the text in black, with the specified font
                                    ctx.fillStyle = 'rgb(25 ,25 ,112)';

                                    var fontSize = 14;
                                    var fontStyle = 'normal';
                                    var fontFamily = 'Helvetica Neue';
                                    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                                    // Just naively convert to string for now
                                    var dataString = dataset.data[index].toString();
                                    if(dataString !=undefined && Number(dataString)>0){

                                        // Make sure alignment settings are correct
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';

                                        var position = element.tooltipPosition();
                                        ctx.fillText(dataString, position.x, position.y - 10);
                                    }
                                });
                            }
                        });
                    }
                });
                var myLineChart = new Chart(ctx, {
                    type:'bar',
                    data: this.retChartCommonlyData(data,"bar"),
                    options: {
                        responsive: false,
                        maintainAspectRatio:false,
                        fullWidth:false,
                        title: {
                            display: false,
                            text: "凭证统计",
                            fontSize:14,
                            position:"top",
                            padding:30
                        },
                        onClick:function(event, legendItem) {

                        }
                    }
                });

            },
            retChartCommonlyData(data,chartType,feild){
                var chartData={};
                var lables=[];
                var attrName=[];
                var datasets=[];
                var lablesName=[];
                var lablesTitle=[];
                lables.push("凭证统计（元）");
                if(feild!="" && feild!=undefined){
                    attrName.push(feild);
                }else{
                    attrName.push("money");
                }

                if(chartType && chartType=="bar"){

                    if(data!=undefined ){
                        for(var m in data){
                            lablesName.push(data[m]["title"] );

                            lablesTitle.push(data[m]["title"] );
                        }
                        for(var mi=0;mi<attrName.length;mi++){
                            var dataValue=[];
                            var datasetsMap={};
                            for(var dm in data){
                                if(data[dm][attrName[mi]]!=undefined || data[dm][attrName[mi]]!=""){
                                    dataValue.push(Number(data[dm][attrName[mi]]));
                                }else{
                                    dataValue.push(0);
                                }
                            }
                            var rgba4="rgba(0,191,255)";
                            datasetsMap.data=dataValue;
                            datasetsMap.label= lables[mi];
                            datasetsMap.backgroundColor=rgba4;
                            datasetsMap.borderColor= rgba4;
                            datasetsMap.borderWidth=1;
                            datasets.push(datasetsMap);
                        }
                    }
                    if(lablesName.length>0 && datasets.length>0){
                        chartData.labels=lablesName;
                        chartData.datasets=datasets;
                        chartData.labelsTitle="";
                    }
                }else{

                }
                return chartData;
            }
        }
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    @import '../../../assets/stylus/variable.styl';
    @import '../../../assets/stylus/mixin.styl';

    .tab-content {
        height 100%;
    }

    .renwupingzhengtongji {
        height 100%;


        .scroll-list-wrap {
            height 90%;
            overflow-x:scroll;
        }

    }
</style>
<style type="text/css">

    .vux-tab {
        padding-bottom: 10px !important;
        height: 52px !important;
        background-color: #efefef !important;
    }

    .scrollable .vux-tab-ink-bar {
        bottom: 10px !important;
    }

    .report-tab {

        max-width: calc(100% / 6) !important;
    }

</style>


