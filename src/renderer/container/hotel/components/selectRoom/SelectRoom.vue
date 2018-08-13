<template>
    <el-dialog :title="title" :visible.sync="visible" width="70%" top="10vh" :append-to-body="append" >
        <div v-loading="showLoading">
            <el-row>
                <el-col :span="5" class="flex">
                    <span class="label-title"> 楼区: </span>
                    <el-select placeholder="请选择楼区" v-model="roomArea" size="mini" @change="selectRoomArea">
                        <el-option label="全部楼区" value="1"></el-option>
                        <el-option v-for="(value,key) in floorArea" :key="key" :label="value" :value="key"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5" class="flex">
                    <span class="label-title">楼座: </span>
                    <el-select placeholder="请选择楼座" v-model="roomFloor" size="mini" @change="selectRoomBlock">
                        <el-option label="全部楼座" value="1"></el-option>
                        <el-option v-for="(value,key) in floorBlock" :key="key" :label="value" :value="key"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="5" class="flex">
                    <span class="label-title">房型: </span>
                    <el-select placeholder="请选择房型" v-model="roomType" size="mini" @change="changeRoomType">
                        <el-option label="全部房型" value="1"></el-option>
                        <el-option v-for="(row,index) in roomListData" :key="index" :label="row.roomTypeDesc" :value="row.roomTypeId"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="7" :offset="2" class="flex">
                    <span class="label-title"> 房号: </span>
                    <el-input v-model="roomNoText" size="mini" clearable placeholder="请输入房间号"></el-input>&nbsp;
                    <el-button type="primary" size="mini" @click="searchRoomNo">搜索</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="2">
                    房间示例:
                </el-col>
                <el-col :span="8">
                    <el-button size="mini" type="success">已选</el-button>
                    <el-button size="mini">可选</el-button>
                    <el-button size="mini" type="info">不可选</el-button>
                </el-col>
                <el-col :span="4">
                    <span>角标示例：</span>
                    <span class="example" :style="{backgroundColor:getColor('116')}"></span> 空脏房
                </el-col>
                <el-col :span="3" :offset="7">
                    <el-checkbox v-model="isAvailable" @change="onlyAvailable">仅看空房</el-checkbox>
                </el-col>
                <!--<el-col :span="3">-->
                    <!--<el-checkbox v-model="isCheckIn" @change="onlyCheckIn">仅看在店</el-checkbox>-->
                <!--</el-col>-->
            </el-row>
            <el-row>
                <label>已选房间：</label>
                <el-tag v-for="(tag,index) in selectTags" :key="tag.roomId" :closable="tag.status==='2'?false:true" @close="closeTag(tag,index)">{{tag.roomNo}}</el-tag>
            </el-row>
            <div class="content-list">
                <el-collapse class="zing-collapse" v-model="activeNames">
                    <el-collapse-item v-for="(row,key) in roomListData" v-if="row.hotelRoomInfos.length>0" :title="row.roomTypeDesc" :key="row.roomTypeId" :name="row.roomTypeDesc" v-show="row.show != -1">
                        <template slot="title">
                            <div style="display: flex">
                                <span style="display: inline-block;width:120px">
                                     {{row.roomTypeDesc}}
                                     <!--<span>{{row.ableTotal}}/{{row.roomTotal}}</span>-->
                                </span>
                                <span v-if="reserve">
                                    <label>按数量预订&nbsp;&nbsp;</label>
                                    <span style="display: inline-block;width:110px" @click="focusInput($event)">
                                        <el-input type="number" :max="row.ableNum" size="mini" v-model="row.reserveNum" @change="reserveByNum($event,row)" clearable placeholder="预订数量"></el-input>
                                    </span>&nbsp;&nbsp;
                                    <span>可预订总数：{{row.canReserveRoomNum}}</span>&nbsp;&nbsp;
                                    <span>剩余可预订数：{{row.ableNum}}</span>
                                </span>
                            </div>
                        </template>
                        <span class="room-span" v-for="(room,index) in row.hotelRoomInfos" :key="index" >
                        <span class="roomMark" v-if="room.isCheck === '0' && room.isClean === '1'" :style="{'border-top-color':getColor(getCode(room))}"></span>
                        <el-button v-show="room.show != -1" :type="room.type" :label="room.roomNo"
                                   size="mini" @click="selectOneRoom(room,row)">{{room.roomNo}}
                        </el-button>
                </span>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div slot="footer" class="footer">
                <span v-if="reserve">
                    <span>共预订数量：{{totalReserveNum}}</span>&nbsp;&nbsp;
                    <span>已排房：{{selectTags.length}}</span>&nbsp;&nbsp;
                    <span>未排房：{{totalReserveNum - selectTags.length}}</span>
                </span>
                <span v-if="!reserve">
                    <span>已选房数：{{totalReserveNum}}</span>
                </span>
                <span>
                    <el-button type="primary" size="small" @click="confirmSelect">确 定</el-button>&nbsp;
                    <el-button size="small" @click="cancel">取 消</el-button>
                </span>
            </div>
        </div>
    </el-dialog>
</template>
<script>
    import { AddDays, parseDateStr } from "../../../../utils/date";
    export default {
        name: "SelectRoom",
        props: {
            enterTime: {
                type: String,
                default: function () {
                    return parseDateStr(new Date());
                }
            },
            outerTime: {
                type: String,
                default: function () {
                    return parseDateStr(AddDays(new Date(), 1));
                }
            },
            //已选
            tags: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            show: {
                type: Boolean,
                default: false
            },
            append: {
                type: Boolean,
                default: true
            },
            maxSelect: {
                type: Number,
                default: Number.MAX_VALUE
            },
            isReserve :{
                type:Boolean,
                default:false
            },
            //不可选的列表
            unSelect:{
                type: Array,
                default: function () {
                    return [];
                }
            },
            //只能选择在店的 (用于转账等操作)
            selectCheckIn:{
                type:Boolean,
                default:false
            },
            //选房标题控制
            title:{
                type:String,
                default:"选择房间"
            }
        },
        data() {
            return {
                activeNames:[],     //展开的collapse name集合
                roomListData: [],   //load数据
                showLoading:false,
                floorArea:{},       //楼区数据{key(floorAreaId):value(描述)}
                floorBlock:{},      //楼座数据
                visible: false,
                roomFloor:"1",      //楼座model
                roomArea:"1",       //楼区model
                roomType:"",        //房型筛选
                roomNoText:"",      //房号搜索,
                isAvailable:false,     //空房checkbox
                isCheckIn:false,       //在店checkbox
                unableRoom:[],        //不可选的房间
                selectTags: [],     //已排
                roomTypeNumObj:{},  //未排
                reserve:false,
                maxVal:1000,
                totalReserveNum:0,      //总预订数

                //房态图颜色配置, 以下是默认设置
                colorConfig:[
                    {
                        "configCode": "115",
                        "configValue": "#FFFFFF",
                    }, {
                        "configCode": "116",
                        "configValue": "#C9C9C9",
                    }, {
                        "configCode": "117",
                        "configValue": "#40AFFC",
                    }, {
                        "configCode": "118",
                        "configValue": "#996600",
                    }, {
                        "configCode": "119",
                        "configValue": "#18C34D",
                    }, {
                        "configCode": "120",
                        "configValue": "#D81E06",
                    }, {
                        "configCode": "121",
                        "configValue": "#88147F",
                    }
                ],
            };
        },
        watch: {
            selectTags:function () {
                let num = 0;
                num += Number(this.selectTags.length);
                Object.values(this.roomTypeNumObj).forEach(row => {
                    num += Number(row);
                });
                this.totalReserveNum = num;
            },
            show: function () {
                if (this.show) {
                    let handled = this.handleTag(this.tags);     //组件内使用传进数据的副本
                    this.selectTags = handled.planed;               //已选的房间
                    this.roomTypeNumObj = handled.unplaned;         //未排房的房间
                    this.maxVal = this.maxSelect;                   //最大可选数
                    this.reserve = this.isReserve;
                    this.unableRoom = this.handleTag(this.unSelect).planed;       //不可选的房间
                    // this.reloadRoom();       //需要重新加载可选房
                    this.loadRoomInfo();
                    this.visible = true;
                } else {
                    this.visible = false;
                    this.reserve = false;
                    this.maxVal = 1000;
                    this.unableRoom = [];
                    // this.resetUnableRoom();
                }
            },
            visible: function () {
                if (!this.visible) {
                    this.cancel();
                }
            },
        },
        created() {
            // this.loadRoomInfo();
        },
        methods: {
            getReserveTotal() {
                let num = 0;
                num += Number(this.selectTags.length);
                Object.values(this.roomTypeNumObj).forEach(row => {
                    num += Number(row);
                });
                this.totalReserveNum = num;
            },
            getColor(val) {
                for (let i = 0; i < this.colorConfig.length; i++ ) {
                    if (this.colorConfig[i].configCode === val) {
                        return this.colorConfig[i].configValue
                    }
                }
            },
            getCode(room) {
                let isCheck = room.isCheck;
                let isClean = room.isClean;
                // let isLock = room.isLock;
                // let isRepair = room.isRepair;
                //仅显示空脏
                if (isCheck === "0" && isClean === "1") {    //空脏
                    return "116";
                }

                // if (isCheck === "0" && isClean === "0") {           //空净
                //     return "115";
                // } else if (isCheck === "0" && isClean === "1") {    //空脏
                //     return "116";
                // } else if (isCheck === "1" && isClean === "0") {    //住净
                //     return "118";
                // } else if (isCheck === "1" && isClean === "1") {    //住脏
                //     return "117";
                // } else if (isLock === "1") {        //锁定
                //     return "121";
                // } else if (isRepair === "1") {      //维修
                //     return "120";
                // }
            },
            //处理传参数据,分出排房与未排房
            handleTag(tag) {
                let planed = [];
                let unplaned = {};
                tag.forEach(row => {
                    if (row.isPlaned === "true") {
                        planed.push(row);
                    } else {
                        if (unplaned.hasOwnProperty(row.roomTypeId + "-" + row.roomTypeDesc)) {
                            unplaned[row.roomTypeId + "-" + row.roomTypeDesc]++;
                        } else {
                            unplaned[row.roomTypeId + "-" + row.roomTypeDesc] = 1;
                        }
                    }
                });
                console.log("planed",planed,"unplaned",unplaned);
                return {
                    planed:planed,
                    unplaned:unplaned
                }
            },
            //把可以预约,但是禁选的去掉禁选
            resetUnableRoom () {
                // let self = this;
                // this.roomListData.forEach(roomType => {
                //     let rooms = roomType.hotelRoomInfos ? roomType.hotelRoomInfos : [];
                //     rooms.forEach(room => {
                //         if (room.roomStatus === "0") {
                //             self.unableRoom.forEach(row => {
                //                 if (row.roomId === room.roomId) {
                //                     room.type = "";
                //                 }
                //             })
                //         }
                //     });
                // });
                this.unableRoom = [];
            },
            loadRoomInfo() {
                let self = this;
                // if (!self.enterTime || !self.outerTime) {
                //     return;
                // }
                this.showLoading = true;
                let param = {};
                if (self.enterTime && self.outerTime) {
                    param = {
                        enterTime: self.enterTime,
                        outerTime: self.outerTime
                    };
                }
                let roomListUrl = "/zingbiz/hotel/hotelNew/getHotelRoomSelectInfo";
                self.$httpSilent
                    .get(roomListUrl, { params:param })
                    .then(res => {
                        self.showLoading = false;
                        if (res.data.success) {
                            console.log("allroom",res.data);
                            self.colorConfig = res.data.data.colorConfigs;
                            let roomList = res.data.data.roomInfo;
                            roomList.forEach(roomType => {
                                //可用房统计
                                roomType.ableNum = Number(roomType.canReserveRoomNum);

                                if (self.activeNames.length < 3) {
                                    self.activeNames.push(roomType.roomTypeDesc);
                                }
                                //设置回显数据
                                let key = roomType.roomTypeId + "-" + roomType.roomTypeDesc;
                                if (self.roomTypeNumObj.hasOwnProperty(key)) {
                                    roomType.reserveNum = self.roomTypeNumObj[key];
                                    roomType.ableNum = Number(roomType.ableNum) - Number(self.roomTypeNumObj[key])  //扣除已预订
                                } else {
                                    roomType.reserveNum = "";
                                }
                                let rooms = roomType.hotelRoomInfos ? roomType.hotelRoomInfos : [];
                                // let roomTotal = 0;
                                // let ableTotal = 0;
                                rooms.forEach(room => {
                                    // roomTotal++;
                                    room.roomTypeId = roomType.roomTypeId;
                                    room.roomTypeDesc = roomType.roomTypeDesc;
                                    //可预约
                                    if (room.roomStatus === "0") {
                                        // ableTotal++;
                                        room.type = "";
                                        self.selectTags.forEach(tag => {
                                            if (tag.roomId === room.roomId) {
                                                room.type = "success";
                                                roomType.ableNum--;     //扣除已选的
                                            }
                                        });
                                        self.unableRoom.forEach(row => {
                                            if (row.roomId === room.roomId) {
                                                room.type = "info";
                                                // ableTotal--;
                                            }
                                        })
                                    } else if (room.roomStatus === "-1") {
                                        room.type = "info";       //不能预约
                                    }
                                    //组织楼区和楼座数据
                                    if (!self.floorArea.hasOwnProperty(room.floorAreaId)) {
                                        self.floorArea[room.floorAreaId] = room.floorArea;
                                    }
                                    if (!self.floorBlock.hasOwnProperty(room.floorBlockId)) {
                                        self.floorBlock[room.floorBlockId] = room.floorBlock;
                                    }
                                });
                                // roomType['roomTotal'] = roomTotal;
                                // roomType['ableTotal'] = ableTotal;
                            });
                            self.roomListData = roomList;
                        } else {
                            self.showLoading = false;
                            self.$message({ message: "请求数据失败,请刷新重试", type: "warning" });
                        }
                });
            },
            focusInput (eve) {
                //阻止折叠面板事件冒泡
                eve.cancelBubble = true;
            },
            //输入预订数量
            reserveByNum (str,roomType) {
                console.log("r",str);
                let num = str.trim();
                if (Number.isNaN(Number(num))) {
                    this.$message.error("请输入数字");
                    roomType.reserveNum = "";
                    return;
                }
                if (!num) {
                    this.roomTypeNumObj[roomType.roomTypeId + "-" + roomType.roomTypeDesc] = "0";
                } else {
                    if (Number(num) > Number(roomType.ableNum)) {
                        this.$message.warning("超出可预订数量,请重新输入");
                        roomType.reserveNum = "";
                        this.roomTypeNumObj[roomType.roomTypeId + "-" + roomType.roomTypeDesc] = "0";
                    } else {
                        this.roomTypeNumObj[roomType.roomTypeId + "-" + roomType.roomTypeDesc] = num;
                    }
                }
                //可用房数统计
                roomType.ableNum = this.getRoomTypeAbleNum(roomType);
                this.getReserveTotal()
            },
            //获取房型当前可用数量
            getRoomTypeAbleNum (roomType) {
                let num1 = 0;
                this.selectTags.forEach(room => {
                    if (room.roomTypeId === roomType.roomTypeId) {
                        num1++;
                    }
                });
                let num2 = 0;
                if (this.roomTypeNumObj.hasOwnProperty(roomType.roomTypeId + "-" + roomType.roomTypeDesc)) {
                    num2 = Number(this.roomTypeNumObj[roomType.roomTypeId + "-" + roomType.roomTypeDesc])
                }
                return roomType.canReserveRoomNum - num1 - num2;
            },
            /**选择房间
             *  有两种情况: 一种只能选未入住的; 一种只能选已入住的. 通过selectCheckIn判断
             * */
            selectOneRoom(room,roomType) {
                if (this.selectCheckIn) {
                    if (room.type === "") {
                        this.$message({ message: "请选择已入住房间", type: "warning" });
                    } else if (room.type === "info") {
                        if (this.selectTags.length === this.maxVal) {
                            this.$message({ message: "最多可选" + this.maxVal + "个房间" });
                            return;
                        }
                        if (this.isSelected(room) === -1) {
                            room.type = "success";
                            this.selectTags.push({
                                roomId:room.roomId,
                                roomNo:room.roomNo,
                                roomTypeId:room.roomTypeId,
                                roomTypeDesc:room.roomTypeDesc
                            });
                        }
                    } else if (room.type === "success") {
                        let index = this.isSelected(room);
                        if (index !== -1) {
                            if (room.roomStatus === "-1") {
                                room.type = "info";
                            } else if (room.roomStatus === "0") {
                                room.type = "";
                            }
                            this.selectTags.splice(index, 1);
                        }
                    }
                } else {
                    if (room.type === "") {
                        //在可选的时候再判断最大可选值
                        if (this.selectTags.length === this.maxVal) {
                            this.$message({ message: "最多可选" + this.maxVal + "个房间" });
                            return;
                        }
                        //TODO
                        if (roomType.ableNum <= 0 ) {
                            this.$message({ message: "超出可预定数量" });
                            return;
                        }
                        if (this.isSelected(room) === -1) {
                            room.type = "success";
                            this.selectTags.push({
                                roomId:room.roomId,
                                roomNo:room.roomNo,
                                roomTypeId:room.roomTypeId,
                                roomTypeDesc:room.roomTypeDesc
                            });
                            roomType.ableNum--;
                        }
                    } else if (room.type === "success") {
                        let index = this.isSelected(room);
                        if (index !== -1) {
                            room.type = "";
                            this.selectTags.splice(index, 1);
                        }
                        roomType.ableNum++;
                    } else if (room.type === "info") {
                        this.$message({ message: "该房间不可选择", type: "warning" });
                    }
                }
            },
            //删除标签方法
            closeTag(row, index) {
                this.selectTags.splice(index, 1);
                this.roomListData.forEach(roomType => {
                    if (roomType.hotelRoomInfos) {
                        roomType.hotelRoomInfos.forEach(room => {
                            if (room.roomId === row.roomId) {
                                room.type = "";
                                roomType.ableNum++;
                            }
                        });
                    }
                });
            },
            //判断是否存在
            isSelected (room) {
                let flag = -1;
                this.selectTags.forEach((row,index) => {
                    if (row.roomId === room.roomId) {
                        flag = index;
                    }
                });
                return flag;
            },
            //重新排列房间 ---未用
            reloadRoom() {
                let self = this;
                let listData = this.roomListData;
                if (!listData || listData.length === 0) {
                    return;
                }
                listData.forEach(roomType => {
                    let rooms = roomType.hotelRoomInfos ? roomType.hotelRoomInfos : [];
                    rooms.forEach(room => {
                        if (room.roomStatus === "0") {    //可以预约
                            room.type = "";
                            if (self.isSelected(room) !== -1) {
                                room.type = "success";
                            }
                            self.unableRoom.forEach(row => {    //
                                if (row.roomId === room.roomId) {
                                    room.type = "info";
                                }
                            })
                        } else if (room.roomStatus === "-1") {
                            room.type = "info";       //不能预约
                        }
                    });
                });
            },
            //取消按钮
            cancel() {
                this.$emit("cancel");
            },
            //确定,返回选择的房间
            confirmSelect() {
                //返回已选房和未排房的总数
                let result = {
                    planed:this.selectTags.concat(),
                    unPlaned:Object.assign({},this.roomTypeNumObj)
                };
                this.$emit("callback", result);
            },
            //根据楼区筛选
            selectRoomArea(val) {
                this.roomListData.forEach(roomType => {
                    if (roomType.hotelRoomInfos) {
                        roomType.hotelRoomInfos.forEach(room => {
                            if (val === "1" || room.floorAreaId === val) {
                                room.show = '';
                            } else {
                                room.show = -1;     //-1为不显示
                            }
                        });
                    }
                });
                this.roomListData = this.roomListData.concat();
            },
            //按楼座筛选
            selectRoomBlock(val) {
                this.roomListData.forEach(roomType => {
                    if (roomType.hotelRoomInfos) {
                        roomType.hotelRoomInfos.forEach(room => {
                            if (val === "1" || room.floorBlockId === val) {
                                room.show = '';
                            } else {
                                room.show = -1;     //-1为不显示
                            }
                        });
                    }
                });
                this.roomListData = this.roomListData.concat();
            },
            //筛选房间类型
            changeRoomType(val) {
                this.roomListData.forEach(roomType => {
                    if (roomType.roomTypeId === val || val === "1") {
                        roomType.show = 1;
                    } else {
                        roomType.show = -1;
                    }
                });
                this.roomListData = this.roomListData.concat();
            },
            //仅看可选
            onlyAvailable(flag) {
                this.roomListData.forEach(roomType => {
                    if (roomType.hotelRoomInfos) {
                        roomType.hotelRoomInfos.forEach(room => {
                            if (room.type === "info") {
                                if (flag) {
                                    room.show = -1;     //-1为不显示
                                } else {
                                    room.show = '';
                                }
                            }
                        });
                    }
                });
                this.roomListData = this.roomListData.concat();
            },
            //仅看在店的
            onlyCheckIn(flag) {
                this.roomListData.forEach(roomType => {
                    if (roomType.hotelRoomInfos) {
                        roomType.hotelRoomInfos.forEach(room => {
                            if (flag) {
                                if (room.roomStatus === "-1") {
                                    room.show = '';
                                } else {
                                    room.show = -1;     //-1为不显示
                                }
                            } else {
                                room.show = '';
                            }

                        });
                    }
                });
                this.roomListData = this.roomListData.concat();
            },
            //房号查找
            searchRoomNo() {
                let self = this;
                this.roomListData.forEach(roomType => {
                    if (roomType.hotelRoomInfos) {
                        roomType.hotelRoomInfos.forEach(room => {
                            if (self.roomNoText === "") {
                                room.show = '';
                            } else {
                                if (room.roomNo === self.roomNoText) {
                                    room.show = '';
                                } else {
                                    room.show = -1;     //-1为不显示
                                }
                            }
                        });
                    }
                });
                this.roomListData = this.roomListData.concat();
            }
        }
    };
</script>
<style scoped>
    .el-row{
        margin-bottom: 10px;
    }
    .content-list{
        max-height: 350px;
        overflow: auto;
    }
    .zing-collapse{
        margin: 10px;
    }
    .room-span{
        position: relative;
        display: inline-block;
        margin: 5px;
    }
    .roomMark{
        position: absolute;
        right: 0;
        width: 0;
        height: 0;
        border-top: 15px solid transparent;
        border-left: 15px solid transparent;
    }
    .exampleBox{
        display: flex;
        justify-content: flex-end;
    }
    .example{
        display: inline-block;
        width: 30px;
        height: 15px;
        border: 1px solid darkgrey;
    }
    .flex{
        display: flex;
        align-items: center;
    }
    .label-title{
        min-width: 40px;
        text-align: center;
    }
    .footer{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>


