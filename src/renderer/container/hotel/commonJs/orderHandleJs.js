import { getTotalHoursPrice, getTotalDayPrice } from "../commonJs/hotelCommonJs";
import { dateFormat,AddDays } from "../../../utils/date";
/**
 * 提取了 入住,预订,订单修改,办理入住,复制预订等页面的公共处理数据的方法
 * */
const hotelUtils = {
    //酒店配置时间校验
    validHotelConfigTime(self) {
        if (!self.configTime || !self.checkOutTime) {
            self.$confirm("酒店时间未启用，请先到酒店时间配置页面进行启用？", "提示", {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                self.$router.push({
                    path: "/hotel/hotelConfig",
                });
            });
        }
    },
    /**
     *  设置表单默认值,即下拉菜单第一个
     *  option 配置项,即哪些需要设置
     *      reserveType:预订类型
     *      channelType:渠道类型
     * */
    setFormDefaultVal(allData,self,option) {
        //预订类型 (直接入住不设置)
        if (option.reserveType && allData.hotelConfigReserveTypes && allData.hotelConfigReserveTypes.length) {
            let reserveTypeObj = allData.hotelConfigReserveTypes[0];
            self.form.reserveTypeId = reserveTypeObj.rowId;
            self.form.reserveTypeDesc = reserveTypeObj.configValue;
        }
        //渠道
        if (option.channelType && allData.hotelConfigChannels && allData.hotelConfigChannels.length) {
            let channel = allData.hotelConfigChannels[0];
            self.form.channelTypeId = channel.rowId;
            self.form.channelTypeDesc = channel.configValue;
        }
    },

    //预订 提交前表单数据的处理
    handleFormData(self,form) {
        for (let i = 0; i < form.hotelOrderRoomList.length; i++) {
            let row = form.hotelOrderRoomList[i];
            //处理入住人员数据
            let checkin = [];
            if (row.checkInPeople && row.checkInPeople.length) {
                row.checkInPeople.forEach(item => {
                    let obj = {
                        enterTime:form.enterTime,
                        outerTime:form.outerTime,
                        checkInPersonId:item.contactsId,
                        checkInPersonName:item.contactsName,
                        personSign:"0",
                        telPhone:item.telPhone,
                    };
                    checkin.push(obj);
                });
            }
            //处理同住人
            let together = [];
            if (row.housemate && row.housemate.length) {
                row.housemate.forEach(item => {
                    let obj = {
                        enterTime:form.enterTime,
                        outerTime:form.outerTime,
                        checkInPersonId:item.contactsId,
                        checkInPersonName:item.contactsName,
                        personSign:"1",
                        telPhone:item.telPhone,
                    };
                    together.push(obj);
                });
            }
            //合并
            row.hotelRoomPersonList = checkin.concat(together);
            row.roomPersonNum = row.hotelRoomPersonList.length;
            row.enterTime = form.enterTime;
            row.outerTime = form.outerTime;
        }
        //删除其他数据,防止提交
        for (let i = 0; i < form.hotelOrderRoomList.length; i++) {
            let row = form.hotelOrderRoomList[i];
            delete row['housemate'];
            delete row['checkInPeople'];
        }
    },

    //入住 提交前的校验
    handleFormDataForCheckIn(self,form) {
        for (let i = 0; i < self.form.hotelOrderRoomList.length; i++) {
            let row = self.form.hotelOrderRoomList[i];
            if (row.isPlaned === "false") {
                self.$message({ type: "warning", message: "你还有未排房的预订,请先排房" });
                return false;
            }
            if (!row.checkInPeople || !row.checkInPeople.length) {
                self.$message({ type: "warning", message: "请选择入住人" });
                return false;
            }
            if (!row.priceCodeId) {
                self.$message({ type: "warning", message: "请选择房价" });
                return false;
            }
            if (!row.taxStructureId) {
                self.$message({ type: "warning", message: "请选择房税结构" });
                return false;
            }
            //处理入住人员数据
            let checkin = [];
            row.checkInPeople.forEach(item => {
                let obj = {
                    enterTime:self.form.enterTime,
                    outerTime:self.form.outerTime,
                    checkInPersonId:item.contactsId,
                    checkInPersonName:item.contactsName,
                    personSign:"0",
                    telPhone:item.telPhone,
                };
                checkin.push(obj);
            });
            //处理同住人
            let together = [];
            if (row.housemate && row.housemate.length) {
                row.housemate.forEach(item => {
                    let obj = {
                        enterTime:self.form.enterTime,
                        outerTime:self.form.outerTime,
                        checkInPersonId:item.contactsId,
                        checkInPersonName:item.contactsName,
                        personSign:"1",
                        telPhone:item.telPhone,
                    };
                    together.push(obj);
                });
            }
            //合并
            row.hotelRoomPersonList = checkin.concat(together);
            row.roomPersonNum = row.hotelRoomPersonList.length;
            row.enterTime = self.form.enterTime;
            row.outerTime = self.form.outerTime;
        }

        //删除其他数据,防止提交
        for (let i = 0; i < self.form.hotelOrderRoomList.length; i++) {
            let row = self.form.hotelOrderRoomList[i];
            delete row['housemate'];
            delete row['checkInPeople'];
        }
        return true;
    },

    /**
     * 实时时间,记得clear掉
     * */
    getCurrentTime(self,key,id) {
        var timeId = setInterval(function() {
            let time = dateFormat(new Date());
            let doc = document.getElementById(id);
            if (!doc) {
                window.clearInterval(timeId);
            } else {
                doc.innerText = time;
            }
            // self[key] = time;
        },1000);
    },
    /**
     * 1.设置入住时间 (预订用,)
     * */
    setEnterTime (self) {
        if (self.enterTimeCopy && self.checkInTypeCopy !== "2") {
            // self.form.enterTime = self.form.enterTime.split(" ")[0] + " " + (self.configTime ? self.configTime : "00:00:00");
            //使用退房配置时间
            self.form.enterTime = self.form.enterTime.split(" ")[0] + " " + self.checkOutTime;
        }
    },
    /**
     * 设置入住的实际入住时间
     * */
    setCheckInEnterTime (self) {
        self.form.enterTime = dateFormat(new Date());
    },
    /**
     * 设置离店时间
     *      退房配置时间
     * */
    setOuterTime (self) {
        if (self.outerTimeCopy && self.checkInTypeCopy !== "2") {
            self.form.outerTime = self.form.outerTime.split(" ")[0] + " " + self.checkOutTime;
        }
    },
    /**
     * 根据天数更新离店日期
     * */
    updateOuterTime(self) {
        if (self.form.checkInType === "2") {
            return;
        }
        if (self.form.enterTime) {
            self.form.outerTime = dateFormat(new Date(AddDays(new Date(self.form.enterTime),self.dayNumber).setHours(12,0,0,0)));
        }
    },
    /**
     * 根据日期更新天数
     *      如果入住类型是钟点房,清空天数
     * */
    updateDayNumber(self) {
        if (self.form.checkInType !== "2") {
            if (self.form.enterTime && self.form.outerTime) {
                let d1 = new Date(self.form.enterTime).setHours(0,0,0,0);
                let d2 = new Date(self.form.outerTime).setHours(0,0,0,0);
                self.dayNumber = parseInt((d2 - d1) / (1000 * 60 * 60 * 24));
            }
        } else {
            self.dayNumber = "";
        }
    },

    /**
     * 处理表单回显数据
     *      处理房间列表回显数据
     * */
    handleOrderData (order) {
        let data = Object.assign({},order);
        if (data.pubTradeCode) {
            data.pubTradeCode = order.pubTradeCode.split(" ");
        }
        if (data.hotelOrderRoomList && data.hotelOrderRoomList.length) {
            //倒序遍历,动态删除room状态为noShow=3的房间
            let len = data.hotelOrderRoomList.length - 1;
            for (let i = len; i >= 0; i--) {
                let row = data.hotelOrderRoomList[i];
                if (row.status === "3" || row.status === "-2") {
                    data.hotelOrderRoomList.splice(i,1);
                } else {
                    let personList = row.hotelRoomPersonList;
                    let housemate = [];
                    let checkInPeople = [];
                    personList.forEach(item => {
                        item.contactsName = item.checkInPersonName;
                        item.contactsId = item.checkInPersonId;
                        if (item.personSign === "0") {
                            checkInPeople.push(item);
                        } else {
                            housemate.push(item);
                        }
                    });
                    row.checkInPeople = checkInPeople;
                    row.housemate = housemate;
                }
            }
        } else {
            data.hotelOrderRoomList = [];
        }
        return data;
    },

    /**
     * 获取时间组件的type属性
     * */
    getDateTimePicker (checkInType) {
        if (checkInType === "2") {
            return "datetime";
        } else {
            return "date";
        }
    },

    /**
     * 验证form表单时间是否为空
     * */
    ValidFormTime:function (form,self) {
        if (!form.enterTime) {
            self.$message({ message: "请选择入住时间", type: "warning" });
        } else if (!form.outerTime) {
            self.$message({ message: "请选择离店时间", type: "warning" });
        }
    },

    /**
     * 预订 入住 宾客列表功能的表单验证规则
     * */
    formValid:{
        reserveId: [{ required: true, message: '请选择预定人', trigger: 'blur' }],
        reserveTypeId: [{ required: true, message: '请选择预订类型', trigger: 'blur' }],
        channelTypeId: [{ required: true, message: '请选择渠道类型', trigger: 'blur' }],
        checkInType: [{ required: true, message: '请选择入住类型', trigger: 'blur' }],
        customerType: [{ required: true, message: '请选择客户类型', trigger: 'blur' }],
        customerId:[{ required: true, message: '请选择名称', trigger: 'blur' }],
        customerProperty:[{ required: true, message: '请选择客户性质', trigger: 'blur' }],
        groupName:[{ required: true, message: '请输入团队名称', trigger: 'blur' }],
        enterTime:[{ required: true, message: '请选择入住时间', trigger: 'blur' }],
        outerTime:[{ required: true, message: '请选择离店时间', trigger: 'blur' }],
        hotelOrderRoomList:[{ required: true, message: '请选择入住房间', trigger: 'blur' }],
        deposit:[{ required: true, message: '请输入金额', trigger: 'blur' }],
        businessItem:[{ required: true, message: '请选择收款方式', trigger: 'blur' }],
        depositBelongTo:[{ required: true, message: '请选择入账房间', trigger: 'blur' }],
        bankCardNo:[{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
        licenseNo:[{ required: true, message: '请输入预授权号', trigger: 'blur' }],
        licenseAmount:[{ required: true, message: '请输入金额', trigger: 'blur' }],
    },

    //添加预订人
    addBookingPeople:function(self) {
        self.selectedMan = self.form.reserveId ? [{ contactsId:self.form.reserveId,contactsName:self.form.reserveName }] : [];
        self.disabledManTrans = [];
        self.selectType = "booking";
        self.isMultiple = false;

        //改为调用添加组件,以上数据处理仍需要,调用选人组件时传参回显等,
        self.addPersonModal = true;         //改为调用添加外联人组件,
        // self.selectManModal = true;      //调用外联人选择组件

    },
    //添加入住人
    addCheckInPeople:function (self,row) {
        console.log("tar",row);
        self.targetRow = row;
        self.selectedMan = self.targetRow.checkInPeople;
        self.disabledManTrans = hotelUtils.filterDisableMan(self.targetRow.checkInPeople,self.form.hotelOrderRoomList);
        self.selectType = "checkIn";    //因多处调用选人组件,用此标志确定执行的回调,可避免多次引用组件
        self.isMultiple = false;        //切换单选

        //改为调用添加组件,以上数据处理仍需要,调用选人组件时传参回显等,
        self.addPersonModal = true;         //改为调用添加外联人组件
        // self.selectManModal = true;      //调用外联人选择组件
    },

    //添加同住人
    addHousemate:function(self,row) {
        self.targetRow = row;
        self.selectedMan = self.targetRow.housemate;
        self.disabledManTrans = hotelUtils.filterDisableMan(self.targetRow.housemate,self.form.hotelOrderRoomList);
        self.selectType = "housemate";
        self.isMultiple = true;

        //改为调用添加组件,以上数据处理仍需要,调用选人组件时传参回显等,
        self.addPersonModal = true;         //改为调用添加外联人组件
        // self.selectManModal = true;      //调用外联人选择组件
    },
    /**
     * 过滤不可选的人
     *      把其他房间已选的人过滤掉,但是当前的房间依然保持可选
     * @param roomList 房间列表
     * @param filterArr 保留的可选的人
     * */
    filterDisableMan:function (filterArr,roomList) {
        let disableMan = [];
        //取出所有已选过的人员
        for (let i = 0; i < roomList.length; i++) {
            let row = roomList[i];
            if (row.checkInPeople && row.checkInPeople.length) {
                row.checkInPeople.forEach(item => {
                    disableMan.push(item.contactsId);
                });
            }
            if (row.housemate && row.housemate.length) {
                row.housemate.forEach(item => {
                    disableMan.push(item.contactsId);
                });
            }
        }
        //过滤:把传进来的值过滤掉,即当前选中的仍可选
        let arr = disableMan.filter(item => {
            let flag = true;
            if (filterArr) {
                filterArr.forEach(row => {
                    if (row.contactsId === item) {
                        flag = false;
                    }
                });
            }
            return flag;
        });
        return arr;
    },

    /**
     * 添加人员的回调,(通过添加组件获取的人员)
     * */
    addExternalMan:function (obj,self) {
        let type = self.selectType;
        if (!obj.contactsId || !obj.contactsName) {
            self.$message({ type: "warning", message: "人员数据添加异常" });
            return;
        }
        switch (type) {
            case "booking":
                self.form.reserveId = obj.contactsId;
                self.form.reserveName = obj.contactsName;
                self.form.telPhone = obj.telPhone;
                break;
            case "checkIn":
                obj.personSign = "0";
                self.targetRow['checkInPeople'] = [obj];

                self.targetRow['checkInPersonName'] = obj.contactsName;
                self.targetRow['telPhone'] = obj.telPhone;
                self.form.hotelOrderRoomList = self.form.hotelOrderRoomList.concat();
                break;
            case "housemate":
                obj.personSign = "1";
                if (self.targetRow['housemate']) {
                    self.targetRow['housemate'].push(obj);
                } else {
                    self.targetRow['housemate'] = [obj];
                }
                self.form.hotelOrderRoomList = self.form.hotelOrderRoomList.concat();
                break;
        }
    },

    /** 选人的回调(通过选人组件获取的人员)
     *      选择预定人,入住人,同住人
     * */
    getExternalMan: function(list,self) {
        if (self.selectType === "booking") {
            if (list.length) {
                self.form.reserveId = list[0].contactsId;
                self.form.reserveName = list[0].contactsName;
                self.form.telPhone = list[0].telPhone;
            } else {
                self.form.reserveId = "";
                self.form.reserveName = "";
                self.form.telPhone = "";
            }
        } else if (self.selectType === "checkIn") {
            list.forEach(row => {
                row.personSign = "0";
            });
            self.targetRow['checkInPeople'] = list;
            if (list.length) {
                self.targetRow['checkInPersonName'] = list[0].contactsName;
                self.targetRow['telPhone'] = list[0].telPhone;
            } else {
                self.targetRow['checkInPersonName'] = "";
                self.targetRow['telPhone'] = "";
            }
            self.form.hotelOrderRoomList = self.form.hotelOrderRoomList.concat();
        } else if (self.selectType === "housemate") {
            list.forEach(row => {
                row.personSign = "1";
            });
            self.targetRow['housemate'] = list;
            self.form.hotelOrderRoomList = self.form.hotelOrderRoomList.concat();
        }
    },
    /** 获取销售人员
     * */
    getSalePerson:function(form,list) {
        if (list.length) {
            form.salePersonId = list[0].rowId;
            form.salePerson = list[0].title;
        } else {
            form.salePersonId = "";
            form.salePerson = "";
        }
    },

    /**
     * 当入住时间和入住方式变化时,重置房间
     *               -----------暂------未---------用-----------
     * */
    resetSelectedRoom: function(self) {
        self.form.hotelOrderRoomList = [];
    },

    /**
     * 房间选择的回调
     * */
    getRoomInfo: function (obj,self) {
        let planed = obj.planed;    //返回的已排房
        let planArr = [];           //保存排过房的数组
        planed.forEach(row => {
            row.isPlaned = "true";
            let roomTemp = row;
            //如果组件返回的房间,和已有房间id相同,保留原有房间数据
            if (self.form.hotelOrderRoomList && self.form.hotelOrderRoomList.length) {
                self.form.hotelOrderRoomList.forEach(room => {
                    if (row.roomId === room.roomId) {
                        roomTemp = room;
                    }
                })
            }
            planArr.push(roomTemp);
        });

        let unPlanArr = [];         //保存未排房的数组
        let unPlanData = obj.unPlaned;  //返回的未排房的数据
        //处理未排房的,
        Object.keys(unPlanData).forEach(row => {
            let num = unPlanData[row];      //取出未排房的数量,进行独立设置
            if (num) {
                let arr = row.split("-");
                for (let i = 0; i < num; i++ ) {
                    unPlanArr.push({
                        roomTypeId:arr[0],
                        roomTypeDesc:arr[1],
                        isPlaned : "false",
                    })
                }
            }
        });
        self.form.hotelOrderRoomList = planArr.concat(unPlanArr);
    },
    /**
     * 过滤房价代码
     *      房价代码需要根据 入住类型和房间类型 过滤
     * */
    filterPriceCode(self,room) {
        let arr = [];
        self.allData.hotelPriceCodeConfigs.forEach((row, index) => {
            if (row.checkInType === self.form.checkInType) {    //先筛选入住类型
                let roomTypePrice = row.hotelRoomTypePriceConfigList;
                roomTypePrice.forEach(item => {
                    if (room.roomTypeId === item.roomTypeId) { //在筛选房间类型
                        let obj = Object.assign({},row);
                        let weekdayPrice = item.weekdayPrice ? item.weekdayPrice : "";
                        let weekendPrice = item.weekendPrice ? item.weekendPrice : "";
                        let str =  weekdayPrice;
                        if (weekendPrice) {
                            str += "/" + weekendPrice;
                        }
                        // let str = row.priceCode + "(" + weekdayPrice + "/" + weekendPrice + ")";
                        obj.priceCode = str;
                        obj.title = row.priceCode;
                        arr.push(obj);
                    }
                })
            }
        });
        return arr;
    },

    /**
     * 入住类型等改变时, 重置房价代码和房价预计
     * */
    resetPriceCode(roomList) {
        if (roomList && roomList.length) {
            roomList.forEach(item => {
                item.priceCodeId = "";
                item.priceCode = "";
                item.roomCharge = 0;
            });
            roomList = roomList.concat();
        }
    },
    /**
     * 选择房价代码
     *      进行价格计算
     * */
    selectPriceCode:function(code, item,self) {
        item.priceCodeId = code;
        item.priceCode = self.$refs[code][0].$attrs.title;

        let roomTypePriceList = [];
        //已选价格代码,查询价格代码明细列表
        let priceCode = self.filterPriceCode(item);
        priceCode.forEach(row => {
            if (code === row.rowId) {
                roomTypePriceList = row.hotelRoomTypePriceConfigList;
            }
        });
        //根据房间类型,查询确定房价代码中该房型的价格列表
        let roomPriceObj = {};
        roomTypePriceList.forEach(row => {
            if (row.roomTypeId === item.roomTypeId) {
                roomPriceObj = row;
            }
        });
        if (JSON.stringify(roomPriceObj) === "{}") {
            self.$message({ type: "error", message: "房价代码匹配出错" });
            code = item.priceCodeId = item.priceCode = "";
            self.$set(item, 'roomCharge', 0);
            return;
        }
        let totalMoney = 0;
        //根据入住日期和入住类型 区别计算预期价格总额 (周末价,平日价)
        if (self.form.checkInType === "1") {
            totalMoney = getTotalDayPrice(self.form.enterTime, self.form.outerTime, roomPriceObj);
        } else if (self.form.checkInType === "2") {
            totalMoney = getTotalHoursPrice(self.form.enterTime, self.form.outerTime, roomPriceObj);
        }
        self.$set(item, 'roomCharge', totalMoney);
    },

    /**
     * 日期改变时,重新计算房间预计价格
     *          //todo   部分代码与上重复
     * */
    updateRoomPrice:function(form,self) {
        if (!form.enterTime || !form.outerTime) {
            return;
        }
        if (form.hotelOrderRoomList && form.hotelOrderRoomList.length) {
            form.hotelOrderRoomList.forEach(item => {
                //判断是否已选房价代码
                if (item.priceCodeId) {
                    let roomTypePriceList = [];
                    //已选价格代码,查询价格代码明细列表
                    let priceCode = self.filterPriceCode(item);
                    priceCode.forEach(row => {
                        if (item.priceCodeId === row.rowId) {
                            roomTypePriceList = row.hotelRoomTypePriceConfigList;
                        }
                    });
                    //根据房间类型,查询确定房价代码中该房型的价格列表
                    let roomPriceObj = {};
                    roomTypePriceList.forEach(row => {
                        if (row.roomTypeId === item.roomTypeId) {
                            roomPriceObj = row;
                        }
                    });

                    let totalMoney = 0;
                    //根据入住日期和入住类型 区别计算预期价格总额 (周末价,平日价)
                    if (self.form.checkInType === "1") {
                        totalMoney = getTotalDayPrice(self.form.enterTime, self.form.outerTime, roomPriceObj);
                    } else if (self.form.checkInType === "2") {
                        totalMoney = getTotalHoursPrice(self.form.enterTime, self.form.outerTime, roomPriceObj);
                    }
                    self.$set(item, 'roomCharge', totalMoney);
                    console.log("update-money",totalMoney);
                }
            })
        }
    },
    /**
     * 初始化协议单位
     *      供页面进行下拉选取
     * */
    initAgreeUnit: function(self) {
        let queryParams = {
            pageNumber: 0,
            pageSize : 1000,
        };
        let url = "/zingbiz/hotel/hotelAgreeUnitService/loadHotelAgreeUnit";
        self.$httpSilent
            .post(url, queryParams)
            .then(res => {
                if (res.data.success) {
                    self.agreeUnitData = res.data.data.data;
                } else {
                    self.$message({ type: "error", message: "请求协议单位异常，请重试" });
                }
            }).catch(error => {
            self.$message({ type: "error", message: "请求数据失败，请重试" });
        });
    },
    getUnitCompany:function(keyword,self) {
        if (keyword) {
            setTimeout(() => {
                self.loadingForUnit = true;
                let param = {
                    agreeUnitName: keyword,
                    pageSize:100,
                    pageNumber:0
                };
                let url = "/zingbiz/hotel/hotelAgreeUnitService/loadHotelAgreeUnit";
                self.$httpSilent
                    .post(url, param)
                    .then(res => {
                        self.loadingForUnit = false;
                        if (res.data.success) {
                            self.unitCompanyList = res.data.data.data;
                        } else {
                            self.$message({ type: "error", message: "没有查到相关团队" });
                        }
                    })
                    .catch(() => {
                        self.loadingForUnit = false;
                        self.$message({ type: "error", message: "没有查到相关团队" });
                    });
            }, 200);
        }
    },
}

export default hotelUtils

