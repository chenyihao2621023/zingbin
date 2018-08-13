<!--suppress ALL -->
<template>
    <div class="renwuchengbentongji">
        <!-- 头部 -->
        <zing-head :isShowQuery="true" title="任务成本统计">
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
            <p style="margin: 8px;color:rgb(115, 115, 115);">任务总成本: {{ retTotalMoney }}</p>

                <!--图表组件-->
                <div style="width:350px !important; height:300px !important; margin:0 auto;overflow-x:scroll;" id="ChartDiv" >

                </div>
                <!-- <x-button type="primary" plain @click.native="$refs.demo.rerender()">rerender</x-button>-->


            <hr style="border-color: #fff6;"/>

                <!-- tab页 -->
                <div class="vue-tab" :style="{ marginTop: tabMarginTop + 'px'}">
                    <tab class="tab-main" :line-width="1">
                        <tab-item :selected="defChartTab === item" v-for="(item, index) in tabChartTitle" @on-item-click="changeChartTab"
                                  @click="defChartTab = item" :key="index"  >{{item}}
                        </tab-item>
                    </tab>
                </div>
                <p style="margin: 8px;color:rgb(115, 115, 115);">总额: {{ retTotalMoney }}</p>
            <!--图表组件-->
            <div style="width:350px !important; height:300px !important; margin:0 auto;overflow-x:scroll;" id="ChartDiv2" >

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

        </div>
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
        name: "renwuchengbentongji",
        components: {
            ZingHead, Tab, TabItem, TransferDom, Confirm, Datetime, Cell, Group, Popup,VChart, VLine, VArea, VTooltip, VLegend, VBar, VScale,
            Flexbox, FlexboxItem, XButton, FormDialog,XInput,PopupHeader,Selector,OrgMemberPicker,Radio,CheckListDialog,SubjectPicker
        },
        data() {
            return {
                tabTitle: ['当天', '本周', '本月', '本季', '本年', '自定义'],
                tabChartTitle: ['物料成本', '人力成本', '非人力成本'],
                tabMarginTop: 0,
                defTab: "当天",
                defChartTab:"物料成本",
                tabIndex: 0,
                tabChartIndex:0,
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
                restaurantChileListChart:[],
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
                form : {
                    rwjmc:'',
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
                goodList: [],
                goodIdList: [],
                inputGoodVal:'',
                inputGoodId:'',
                chartField:'',
            }
        } ,
        mounted() {

        },
        computed:{

        },
        created() {
            // this.tabWidth = document.documentElement.offsetWidth || document.body.offsetWidth
            this.curDate = this.getCurDate().nyr
            this.selectBoardListById();
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
            changeChartTab(index){
              console.log("changeChartTab=======",index);
                if(index === 0){
                    this.initNextItemChart(this.restaurantListChart,"物料成本","materiel");
                }else if(index === 1){

                    this.initNextItemChart(this.restaurantListChart,"人力成本","artificial");
                } else if(index === 2){

                    this.initNextItemChart(this.restaurantListChart,"非人力成本","nonrtificial");
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
                let self = this;
                var url = "/zingbiz/report/tastset_report/getCostTastReport";
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
                            self.restaurantListChart[i].allCost = parseFloat(self.restaurantListChart[i].allCost);
                            self.restaurantListChart[i].materiel = parseFloat(self.restaurantListChart[i].materiel);
                            self.restaurantListChart[i].artificial = parseFloat(self.restaurantListChart[i].artificial);
                            self.restaurantListChart[i].nonrtificial = parseFloat(self.restaurantListChart[i].nonrtificial);
                        }

                        //图表组件
                        this.initChart(self.restaurantListChart,"成本统计");
                        console.log("self.restaurantListChart====",self.restaurantListChart);
                        console.log("self.restaurantList====",self.restaurantList);
                    }
                    this.changeChartTab(this.tabChartIndex);


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


                 this.cardUrl = list.map(item => item.userName).toString();

                if (this.initialSelectedType === 'rowId') {
                    this.initialSelected = list.map(item => item.rowId)
                } else {
                    console.log('methods onPicked ',list.map(item => item.cardUrl));
                    this.initialSelected = list.map(item => item.cardUrl)
                }

                    for (let i in this.initialSelected) {
                        if (i === this.initialSelected.length - 1) {
                            this.inputValue += this.initialSelected[i];
                        } else {
                            this.inputValue += this.initialSelected[i] + ",";
                        }
                    }


                console.log("this.inputValue",this.inputValue);
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
            taskSetNameChange(val) {
                this.form.rwjmc = val;
            },
            reset() {

                this.tastVal = '';
                this.chileTastVal = '';
                this.cardUrl = '';
                this.form = {};
            },
            initChart(data,pageName){
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
                            text: "成本统计",
                            fontSize:14,
                            position:"top",
                            padding:30
                        },
                        onClick:function(event, legendItem) {

                        }
                    }
                });
                this.initNextItemChart(this.restaurantListChart,"物料成本","materiel");
            },
            retChartCommonlyData(data,chartType,feild){
                var chartData={};
                var lables=[];
                var attrName=[];
                var datasets=[];
                var lablesName=[];
                var lablesTitle=[];
                lables.push("成本金额（元）");
                if(feild!="" && feild!=undefined){
                    attrName.push(feild);
                }else{
                    attrName.push("allCost");
                }

                if(chartType && chartType=="bar"){

                    if(data!=undefined ){
                        for(var m in data){
                            lablesName.push(data[m]["createReportTime"] );

                            lablesTitle.push(data[m]["createReportTime"] );
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
         },
         initNextItemChart(data,pageName,feild){
                Chart.defaults.global.animation.duration = 1000;
                Chart.defaults.global.animation.easing = "easeInOutCubic";
                Chart.defaults.global.responsive = true;
                Chart.defaults.global.barThickness=200;
                var widthChart=document.documentElement.clientWidth ;
                widthChart=widthChart-50;
                var widthDiv=data.length;
                if(widthDiv==1){
                    widthDiv=widthDiv*300;
                }else if(widthDiv<5){
                    widthDiv=widthDiv*100;
                }else{
                    widthDiv=widthDiv*80;
                }
                $('#Char_ZongZhang_one2').remove();
                $('#ChartDiv2').append('<canvas id="Char_ZongZhang_one2" style="margin-left:10px;width:'+widthDiv+'px; height:290px;"></canvas>');
                $("#Char_ZongZhang_one2").css({ "display":"block" });
               var  ctx = document.getElementById("Char_ZongZhang_one2").getContext("2d");
                $("#ChartDiv2").css("width",widthChart+"px");

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
            data: this.retChartCommonlyData(data,"bar",feild),
            options: {
                responsive: false,
                maintainAspectRatio:false,
                fullWidth:false,
                title: {
                    display: false,
                    text: "成本统计",
                    fontSize:16,
                    position:"top",
                    padding:30
                },
                legend:{

                },

                onClick:function(event, legendItem) {

                }
            },

        });
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

    .renwuchengbentongji {
        height 100%;


        .scroll-list-wrap {
            height 80%;
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


