
/**
 * 该对象提取了 入住,预订,订单修改,办理入住,复制预订等页面的公共处理数据的方法
 * */
const hotelFormatJs = {

    //交易代码数据请求
    initTradeCodeData(self, filed) {
        let queryParam = {
            pageNumber: 1,
            pageSize: 10000,
        };
        let url = "/zingbiz/hotel/hotelNew/getTradeCodeConfig";
        self.$httpSilent
            .get(url, { params: queryParam })
            .then(res => {
                self[filed] = res.data.data;
            }).catch(error => {
                self.$message({ type: "error", message: "请求数据失败，请刷新重试" });
            });
    },

    //格式化billitem的交易详情显示
    formatBusinessItem: function (item, self) {
        if (!Number.isNaN(Number(item.businessItem))) {
            for (let i = 0; i < self.tradeCodeData.length; i++) {
                let row = self.tradeCodeData[i];
                if (row.rowId === item.businessItem) {
                    return row.descript;
                }
            }
        } else {
            return item.businessItem
        }
    },

    //格式化billitem状态
    formatBillItemType: function (key) {
        switch (key) {
            case "0":
                return "未结算";
            case "1":
                return "已结";
            case "2":
                return "已转到虚拟账户";
            case "3":
                return "已冲账";
            case "4":
                return "已授权";
            case "5":
                return "已解除授权"
        }
    },
    //格式化订单房间状态
    formatStatus: function (row) {
        let status = "";
        if (row.status) {
            status = row.status;
        } else if (row.orderStatus) {
            status = row.orderStatus;
        }
        switch (status) {
            case "0":
                return "已结";
            case "1":
                return "预订";
            case "2":
                return "在店";
            case "3":
                return "NoShow";
            case "4":
                return "已结未付";
            case "-2":
                return "取消";
            case "-1":
                return "已作废";
            case "5":
                return "已退待结";
        }
    },
    //格式化客户类型
    formatCustomerType: function (row) {
        let type = row.customerType;
        switch (type) {
            case "1":
                return "普通客户";
            case "2":
                return "会员";
            case "3":
                return "协议单位";
            case "4":
                return "中介";
        }
    },
    //格式化客户属性
    formatCustomerProp: function (row) {
        let type = row.customerProperty;
        switch (type) {
            case "1":
                return "个人";
            case "2":
                return "团队";
        }
    },
    //格式化入住类型
    formatCheckInType: function (row) {
        let type = row.checkInType;
        switch (type) {
            case "1":
                return "全天房";
            case "2":
                return "钟点房";
            case "3":
                return "自用房";
            case "4":
                return "免费房";
        }
    },
    //同住人显示格式化
    formatTogetherMan: function (row) {
        let roomPerson = row.hotelRoomPerson;
        let str = "";
        if (roomPerson && roomPerson.length) {
            roomPerson.forEach(row => {
                str += row.checkInPersonName + "，"
            })
        }
        return str;
    },
    //格式化时间,只显示日期,不显示时间
    formatEnterTime: function (row) {
        if (row.enterTime) {
            let arr = row.enterTime.split(" ");
            let timeArr = arr[1].split(":");
            return arr[0] + " " + timeArr[0] + ":" + timeArr[1];
        }
    },
    //格式化时间,只显示日期,不显示时间
    formatOuterTime: function (row) {
        if (row.outerTime) {
            let arr = row.outerTime.split(" ");
            let timeArr = arr[1].split(":");
            return arr[0] + " " + timeArr[0] + ":" + timeArr[1];
        }
    },
    /**
     * domId: 打印模版的domId
     * noMargin : 是否去除边距  ----统一去掉(可去除页眉页脚)
     * */
    printTemplateByDomId(domId,noMargin) {
        let ele = document.getElementsByTagName("iframe");
        let iframe = null;
        if (!ele.length) {
            iframe = document.createElement('IFRAME');
            document.body.appendChild(iframe);
        } else {
            iframe = ele[0];
        }
        iframe.setAttribute('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;');
        let doc = iframe.contentWindow.document;
        doc.write(document.getElementById(domId).innerHTML);
        doc.close();

        //去除边距
        let parent = doc.getElementsByTagName("html")[0];
        let styleEle = doc.createElement("style");
        styleEle.innerHTML = "@page { margin: 0; padding: 0;}";
        parent.appendChild(styleEle);

        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }

}

export default hotelFormatJs
