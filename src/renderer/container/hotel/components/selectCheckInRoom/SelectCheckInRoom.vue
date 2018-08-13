<template>
    <div class="select-room" v-transfer-dom>
        <popup v-model="visible" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden','z-index':'3000'}">
            <div class="select-room-popup">
                <popup-header class="select-room-head" :left-text="'取消'" :right-text="'确定'" :title="title" :show-bottom-border="false"
                              @on-click-left="cancelSelect" @on-click-right="confirmSelected">
                </popup-header>
                <!--<div class="room-search">-->
                    <!--<group>-->
                        <!--<selector title="房型筛选" :options="roomTypeOption" v-model="roomTypeSearch"></selector>-->
                    <!--</group>-->
                <!--</div>-->
                <div class="room-tag">
                    <div v-for="row in roomListData" :key="row.roomTypeId">
                        <div class="title">{{row.roomTypeDesc}}</div>
                        <div class="content">
                            <span class="btn-span" v-for="(room,index) in row.hotelRoomInfos" :key="index">
                                <el-button :label="room.roomNo" size="mini" :type="room.type"
                                           @click="selectOneRoom(room,$event,'click')">{{room.roomNo}}
                                </el-button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </popup>
    </div>
</template>
<script>
    import { Popup,PopupHeader,Selector,Group,TransferDomDirective as TransferDom } from 'vux'
    export default {
        components: {
            Popup,PopupHeader,Selector,Group,
        },
        directives: {
            TransferDom
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            title:{
                type:String,
                default:"选择房间"
            },
            tags:{
                type:Array,
                default:function () {
                    return [];
                }
            }
        },
        data() {
            return {
                visible: false,
                roomListData: [],           //load数据

                roomTypeSearch:"",          //房型筛选
                selectedRoom:[],            //已选房间
            };
        },
        computed:{
            roomTypeOption:function () {
                let list = [{ key:"0",value:"全部房型" }];
                this.roomListData.forEach(row => {
                    list.push({
                        key:row.roomTypeId,
                        value:row.roomTypeDesc,
                    })
                })
                return list;
            }
        },
        watch: {
            show: function () {
                if (this.show) {
                    this.visible = true;
                    this.selectedRoom = this.tags//Object.assign({},this.tags);
                    this.loadRoomInfo();
                } else {
                    this.visible = false;
                    this.resetAll();
                }
            },
            visible: function () {
                if (!this.visible) {
                    this.cancelSelect();
                }
            },
        },
        created() {
            // this.loadRoomInfo();
        },
        methods: {
            cancelSelect() {
                this.$emit('cancel', false);
            },
            confirmSelected() {
                this.$emit('callback',this.selectedRoom);
            },
            loadRoomInfo() {
                let self = this;
                this.showLoading = true;
                let roomListUrl = "/zingbiz/hotelNew/hotelBill/getInRoomSelectInfo";
                self.$httpSilent
                    .get(roomListUrl, { params:{}})
                    .then(res => {
                        self.showLoading = false;
                        if (res.data.success) {
                            console.log("roomIn",res.data);
                            self.roomListData = res.data.data;
                            //设置颜色,数据回显
                            self.resetRoomChecked();
                        } else {
                            self.$message({ message: "请求数据失败,请刷新重试", type: "warning" });
                        }
                });
            },
            selectOneRoom(room,event,click) {
                event.preventDefault();
                if (room.type === "") {
                    this.resetRoomChecked(click);        //先把其他的都取消选中
                    this.$set(room,"type","success");
                    this.selectedRoom = [room];
                } else if (room.type === "success") {
                    this.$set(room,"type","");
                    this.selectedRoom = [];
                }
                this.roomListData = this.roomListData.concat();
            },
            //单选,去掉其他选中项颜色 和 回显
            resetRoomChecked(click) {
                //数据回显,因为目前只有单选,直接取第一个.
                let oneRoom = {};
                if (this.tags.length) {
                    oneRoom = this.tags[0];
                }
                let that = this
                this.roomListData.forEach(row => {
                    if (row.hotelRoomInfos && row.hotelRoomInfos.length) {
                        row.hotelRoomInfos.forEach(room => {
                            //给房间添加房型属性
                            room.roomTypeId = row.roomTypeId;
                            room.roomTypeDesc = row.roomTypeDesc;
                            //设置回显
                            if (click && click === "click") {
                                that.$set(room,"type","")
                            } else {
                                if (oneRoom && oneRoom.roomId === room.roomId) {
                                    that.$nextTick(() => {
                                        that.$set(room,"type","success")
                                    })
                                    //room.type = "success";
                                } else {
                                    that.$nextTick(() => {
                                        that.$set(room,"type","")
                                    })
                                    //room.type = "";
                                }
                            }
                        })
                    }
                })
            },
            //重置所有选中颜色
            resetAll() {
                this.roomListData.forEach(row => {
                    if (row.hotelRoomInfos && row.hotelRoomInfos.length) {
                        row.hotelRoomInfos.forEach(room => {
                            room.type = "";
                        })
                    }
                })
            }

        }
    };
</script>
<style scoped>
    .select-room-popup{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
    .select-room-head{
        flex-shrink: 0;
    }
    .title{
        padding:5px 10px;
        background-color: white;
    }
    .content{
        padding:5px;
    }
    .btn-span{
        display: inline-block;
        margin: 2px;
    }
    .room-tag{
        overflow-y: auto;
    }
</style>


