<template>
    <div id="print" v-bind:style="styles" @click="outsideClick($event)">
        <!--标题初始化-->
        <ZingHead :title = "title" class="header">
            <div slot="header-right">
                <span @click="pre()">上一页</span>
                <span @click="next()">下一页</span>
                <span class = "header-save" @click="saveClick()">保存</span>
            </div>
        </ZingHead>
        <div class="inner">
            <div class="container" ref="containerH">
                <x-table style="background-color:#fff;">
                    <thead>
                    <tr style="background-color: #F7F7F7 ">
                        <th v-for="(item,index) in list" :key="index" class="timeSize">{{item}}</th>
                    </tr>
                    </thead>
                    <tbody v-bind:style="{height:heightb + 'px'}">
                        <tr v-for="(value, key) in userData" :key="key">
                            <td>{{key}}</td>
                            <td :id="dataTime[1]" @click="itemClick(value,$event)">
                                    <span v-for="(item,index) in value" v-if="item.dayTime === dataTime[1]" :key="index">{{item.dateName}}
                                    </span>
                            </td>
                            <td :id="dataTime[2]" @click="itemClick(value,$event)">
                                    <span v-for="(item,index) in value" v-if="item.dayTime === dataTime[2]" :key="index">{{item.dateName}}
                                    </span>
                            </td>
                            <td :id="dataTime[3]" @click="itemClick(value,$event)">
                                    <span v-for="(item,index) in value" v-if="item.dayTime === dataTime[3]" :key="index">{{item.dateName}}
                                    </span>
                            </td>
                            <td :id="dataTime[4]" @click="itemClick(value,$event)">
                                    <span v-for="(item,index) in value" v-if="item.dayTime === dataTime[4]" :key="index">{{item.dateName}}
                                    </span>
                            </td>
                            <td :id="dataTime[5]" @click="itemClick(value,$event)">
                                    <span v-for="(item,index) in value" v-if="item.dayTime === dataTime[5]" :key="index">{{item.dateName}}
                                    </span>
                            </td>
                            <td :id="dataTime[6]" @click="itemClick(value,$event)">
                                    <span v-for="(item,index) in value" v-if="item.dayTime === dataTime[6]" :key="index">{{item.dateName}}
                                    </span>
                            </td>
                            <td :id="dataTime[7]" @click="itemClick(value,$event)">
                                    <span v-for="(item,index) in value" v-if="item.dayTime === dataTime[7]" :key="index">{{item.dateName}}
                                    </span>
                            </td>
                        </tr>
                    </tbody>
                </x-table>
            </div>
        </div>
        <!--浮层-->
        <div class="layer" v-show="flag">
            <div class="arrangeType">按天排班</div>
            <ul>
                <li v-for="(item, index) in arrangeTypeList" :key="index" @click="typeClick(item)">{{item.dateName}}</li>
            </ul>
        </div>
    </div>
</template>


<script>
    import ZingHead from "@/components/zingHead/ZingHead";
    import { XTable } from 'vux'
    export default {
        name: "arrange-calendar",
        components: {
            ZingHead,
            XTable,
        },
        data() {
            return {
                mql : window.matchMedia('(orientation: portrait)'),
                //竖屏
                portrait:{
                    width :"",
                    height:"",
                    top:"",
                    left:"",
                    transform:"",
                    transformOrigin :""
                },
                //横屏
                landscape:{
                    width :"",
                    height:"",
                    top:"",
                    left:"",
                    transform:"",
                    transformOrigin :""
                },
                styles:{},
                title:"点击表格进行排班",
                currentFirstDate:"",
                //时间数据
                list:[],
                dataTime:[],
                startTime:"",
                endTime:"",
                month:"",
                day:"",
                //初始化数据
                Data:[],
                //添加的数据
                dataNew:[],
                //修改数据
                changeData:[],
                concatData:[],
                userName:[],
                userData:{},
                //排班类型数据
                arrange:[],
                arrangeTypeList:[{ dateName:"休息",value:0 }],

                cardUrl:"",
                Name:"",
                flag:false,
                target:"",
                flag1:true,
                flag2 :true,
                heightb:""
            }
        },
        watch:{
            //监听数据改变
            dataNew:function () {
                this.userName = []
                this.userData = {}
                this.concatData = this.Data.concat(this.dataNew)
                this.initDate(this.concatData)
            },
            Data:function () {
                // this.setDate(new Date())
            },
            arrange:function () {
                let that = this
                that.arrange.filter(function (val) {
                    if (!val) {
                        return false
                    }
                    let obj = {}
                    obj.dateName = val.dateName
                    obj.value = val.rowId
                    that.arrangeTypeList.push(obj)
                    return true
                })
            }
        },
        created() {
            let that = this
            that.setDate(new Date())
            that.startTime = this.dataTime[1]
            that.endTime = this.dataTime[7]
            that.handleOrientationChange(that.mql);
            that.mql.addListener(that.handleOrientationChange);
            //初始化排班类型
            that.arrangeType()
            that.initPage(that.startTime,that.endTime)
        },
        mounted() {
            this.heightb = this.$refs.containerH.offsetHeight
        },
        methods: {
            //横竖屏
            handleOrientationChange: function (mql) {
                let width = document.documentElement.clientWidth;
                let height =  document.documentElement.clientHeight - 50;
                if (mql.matches) {
                    this.portrait.width = height + "px"
                    this.portrait.height = width + "px"
                    this.portrait.top = (height - width) / 2 + "px"
                    this.portrait.left = 0 - (height - width) / 2 + "px"
                    this.portrait.transform = "rotate(90deg)"
                    this.portrait.transformOrigin = '50% 50%'
                    this.styles = this.portrait

                } else {
                    this.landscape.width = width + "px"
                    this.landscape.height = height + "px"
                    this.landscape.top = 0
                    this.landscape.left = 0
                    this.landscape.transform = "none"
                    this.landscape.transformOrigin = '50% 50%'
                    this.styles = this.landscape
                }
            },
            //日期格式化
            formatDate: function (date) {
                let year = date.getFullYear() + '-';
                this.month = (date.getMonth() + 1);
                this.day = date.getDate();
                let week = ['周天','周一','周二','周三','周四','周五','周六'][date.getDay()];
                if (this.day < 10) {
                    this.day = "0" + this.day
                }
                if (this.month < 10) {
                    this.month = "0" + this.month
                }
                return week + year + this.month + "-" + this.day;
            },
            //添加时间
            addDate: function (date,n) {
                date.setDate(date.getDate() + n);
                return date;
            },
            //设置时间
            setDate: function (date) {
                this.list = []
                let week = date.getDay() - 1;
                this.currentFirstDate = new Date(date);
                this.list.push("姓名")
                for (let i = 1; i < 8; i++) {
                    this.list.push(this.formatDate(i === 1 ? date : this.addDate(date,1)));
                }
                let that = this
                that.list.map(function (val,index) {
                    if (!val) {
                        return false
                    }
                    if (index !== 0) {
                        that.dataTime.push(val.substring(2))
                    } else {
                        that.dataTime.push(val)
                    }
                    return true
                })
            },
            //上一页pre
            pre: function () {
                this.dataTime = []
                this.setDate(this.addDate(this.currentFirstDate,-7));
                this.startTime = this.dataTime[1]
                this.endTime = this.dataTime[7]
                this.initPage(this.startTime, this.endTime)
            },
            //下一页
            next: function () {
                this.dataTime = []
                this.setDate(this.addDate(this.currentFirstDate,7));
                this.startTime = this.dataTime[1]
                this.endTime = this.dataTime[7]
                this.initPage(this.startTime, this.endTime)
            },
            //td点击
            itemClick:function (value,$event) {
                let ev = $event || window.event
                ev.stopPropagation()
                this.target = $event.currentTarget
                this.cardUrl = value[0].cardUrl
                this.Name = value[0].userName
                this.flag = !this.flag
            },
            //页面初始化数据
            initPage:function (startTime,endTime) {
                let that = this
                that.$http.post("/zingbiz/attendance/attendancesetting/getShiftDataByAttendanceId",{
                    attenUser:that.$route.query.attenUser,
                    attendanceId :that.$route.query.rowId,
                    startTime:startTime,
                    endTime:endTime
                }).then(function (res) {
                    that.Data = res.data.data
                    that.Data.filter(function (val) {
                        if (!val) {
                            return false
                        }
                        that.changeData.filter(function (item) {
                            if (!item) {
                                return false
                            }
                            if (val.userName === item.userName && val.dayTime === item.dayTime) {
                                 val.dateName = item.dateName
                            }
                            return true
                        })
                        return true
                    })
                    if (res.data.success) {
                        let arr = Object.keys(that.userData)
                        that.userName = []
                        arr.filter(function (item) {
                            if (!item) {
                                return false
                            }
                            that.userData[item] = []
                            return true
                        })
                        that.concatData = that.Data.concat(that.dataNew)
                        that.initDate(that.concatData)
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //数据整合
            initDate: function (data) {
                let that = this
                data.filter(function (item) {
                    if (!item) {
                        return false
                    }
                    //判断userName出现几次
                    let arr = []
                    if (!that.userName.includes(item.userName)) {
                        that.userName.push(item.userName)
                        arr.push(item)
                        if (item.dateName === null) {
                            item.dateName = "休息"
                        }
                        that.$set(that.userData,item.userName,arr)
                        // that.userData[item.userName] = arr
                    } else {
                        if (item.dateName === null) {
                            item.dateName = "休息"
                        }
                        that.userData[item.userName].push(item)
                    }
                    return true
                })
            },
            //排班类型
            arrangeType: function () {
                let that = this
                that.$http.post("/zingbiz/attendance/attendancesetting/getAttendanceDateByIds",{
                    rowId :that.$route.query.attenDateId
                }).then(function (res) {
                    if (res.data.data.data) {
                        that.arrange = res.data.data.data
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            //浮层点击(增加)
            typeClick: function (item) {
                let that = this
                that.flag1 = true
                that.flag2 = true
                if (that.target.innerText === "") {
                    //将数据更新(数据添加)
                    that.dataNew.push({
                        userName: that.Name,//人员名称
                        cardUrl : that.cardUrl,//人员
                        attendanceId : that.$route.query.rowId,//参数rowId
                        attendanceDateId : item.value, // 班次的rowId
                        dayTime : that.target.id, //当前时间
                        dateName :item.dateName === "休息" ? null : item.dateName
                    })
                } else {
                    that.dataNew.filter(function (val) {
                        if (!val) {
                            return false
                        }
                        if (val.dayTime === that.target.id && val.userName === that.Name) {
                            val.dateName = item.dateName === "休息" ? null : item.dateName
                            that.flag1 = false
                        }
                        return true
                    })

                    that.changeData.filter(function (value) {
                        if (!value) {
                            return false
                        }
                        if (value.dayTime === that.target.id && value.userName === that.Name) {
                            value.attendanceDateId = item.value
                            that.flag2 = false
                        }
                        return true
                    })
                    if (that.flag2 && that.flag1) {
                        that.add(item)
                    }
                    //改变userData数据
                    that.userData[that.Name].filter(function (val) {
                        if (!val) {
                            return false
                        }
                        if (val.dayTime === that.target.id) {
                            val.dateName = item.dateName
                        }
                        return true
                    })
                }
                that.flag = false
            },
            //保存
            saveClick:function () {
                let that = this
                //发送的数据
                let params = {}
                params.add = []
                params.update = []
                params.add = that.dataNew.filter(function (item) {
                    if (!item) {
                        return false
                    }
                    delete item.dateName
                    delete item.userName
                    return true
                })
                params.update = that.changeData.filter(function (item) {
                    if (!item) {
                        return false
                    }
                    delete item.dayTime
                    delete item.userName
                    delete item.dateName
                    return true
                })
                that.$http.post("/zingbiz/attendance/attendancesetting/addOrUpdateShift",params).then(function (res) {
                    if (res.data.success) {
                        that.$vux.toast.show({ text: "保存成功",type:"success" });
                        that.$router.push({ path:"/attendanceHome/attenSettingList" })
                    }
                })
            },
            //外层点击
            outsideClick:function (event) {
                let ev = event || window.event
                ev.stopPropagation()
                this.flag = false
            },
            add (item) {
                this.changeData.push({
                    attendanceId : this.$route.query.rowId,//参数rowId
                    attendanceDateId : item.value, // 班次的rowId
                    dayTime:this.target.id,
                    userName:this.Name,
                    dateName:item.dateName
                })
            },
        }
    }
</script>


<style  lang="stylus" rel="stylesheet/stylus" scoped>
    #print{
        height: 100%;
    }
    @media screen and (orientation: portrait) {
        html{
            width : 100% ;
            height : 100% ;
            overflow : hidden;
        }
        body{
            width : 100% ;
            height : 100% ;
            overflow : hidden;
        }
        #print{
            position : absolute ;
        }
    }
    @media screen and (orientation: landscape) {
        html{
            width : 100% ;
            height : 100% ;
            background-color: white ;
        }
        body{
            width : 100% ;
            height : 100% ;
            background-color: white ;
            cursor:pointer;
        }
        #print{
            position : absolute ;
            top : 0 ;
            left : 0 ;
            width : 100% ;
            height : 100% ;
        }
    }
    .header-save {
        font-size 16px
        color blue
        margin-right 10px
    }
    .timeSize{
        font-size .8rem
    }
    .layer{
        position: absolute;
        z-index: 99;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 70%;
        border-radius: 5px;
        background-color:white;
        border: 1px solid gray;
    }
    .layer li{
        height: 35px;
        line-height: 35px;
        text-align: center;
        margin: 0 10%;
        border-radius: 4px;
        margin-bottom: 10px;
        background-color:#C4E1FF ;
    }
    .arrangeType{
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        text-align: center;
        color:#0134C1;
    }
    .header{
        background-color white!important
    }
    .inner{
        height 100%
    }
    .container{
        margin 0 10px
        height calc(100% - 70px)
        overflow auto
        -webkit-overflow-scrolling touch
    }
    .container::-webkit-scrollbar {
        display: none;
    }


    table tbody {
        display:block;
        /*height:100%;*/
        overflow-y:scroll;
    }
    table tbody::-webkit-scrollbar {
        display: none;
    }
    table thead, tbody tr {
        display:table;
        width:100%;
        table-layout:fixed;
    }
    thead th,tbody td{
        border: 1px solid #E5E5E5
    }
</style>
