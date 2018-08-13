
/** 获取一个时间段内 全天房总价格
 *  @param begin  开始时间 2018-04-04
 *  @param end  结束时间 2018-04-05
 *  @param priceObj 价格代码 ,含平日价,周末价 { weekdayPrice:100,weekendPrice:120 }
 *  @return totalMoney  总价格
 *  注: 全天房 按天计价,小时数会被置为0
 * */
export function getTotalDayPrice(beginStr, endStr, priceObj) {
    let beginDate = new Date(new Date(beginStr).setHours(0,0,0,0));
    let endDate = new Date(new Date(endStr).setHours(0,0,0,0));
    let totalMoney = 0;
    let diffDays = (endDate - beginDate) / 3600000 / 24;
    for (let i = 0; i < diffDays; i++) {
        let prices = getDayPrice(beginDate.getDay(), priceObj);
        totalMoney += prices;
        beginDate = getNextDay(beginDate);
    }
    return totalMoney;
}


/** 获取一个时间段内 小时房总价格
 *  @param begin  开始时间 2018-04-04 10:00:00
 *  @param end  结束时间 2018-04-05 12:00:00
 *  @param priceObj 价格代码 ,含平日价,周末价 { weekdayPrice:100,weekendPrice:120 }
 *  @return totalMoney  总价格
 * */
export function getTotalHoursPrice(begin, end, priceObj) {
    let totalMoney = 0;
    let beginStr = begin;
    let beginDate = new Date(begin);
    let endDate = new Date(end);

    let days = (endDate - beginDate) / 3600000 / 24;
    for (let i = 0; i < days + 1; i++) {
        let nextDate = getNextDay(beginStr);
        if ((nextDate - endDate) <= 0) {
            let hours = (nextDate - new Date(beginStr)) / 3600000;
            let prices = getHoursPrice(hours, new Date(beginStr).getDay(), priceObj);
            totalMoney += prices;
        } else if ((endDate - new Date(beginStr)) > 0) {
            let hours = (endDate - new Date(beginStr)) / 3600000;
            let prices = getHoursPrice(hours, endDate.getDay(), priceObj);
            totalMoney += prices;
        }
        beginStr = nextDate.getFullYear() + "." + (nextDate.getMonth() + 1) + "." + nextDate.getDate();
    }
    return Number(totalMoney).toFixed(2);
}

/**
 * 获取下一天 的00:00:00 Date时间
 * @param date/2018:08:00
 * @returns {Date}
 */
function getNextDay(date) {
    // let dateStr = date.split(' ');
    // let nextDate = new Date(new Date(dateStr[0]).getTime() + 24 * 60 * 60 * 1000);
    return new Date(new Date(date).setHours(0, 0, 0, 0) + 24 * 3600 * 1000);
}


/**
 * 根据今天周几, 计算今天所有小时的总价
 * @param hours 小时数
 * @param week 星期几
 * @param priceObj 价格代码 ,含平日价,周末价 { weekdayPrice:100,weekendPrice:120 }
 * @returns {number}
 */
function getHoursPrice(hours, week, priceObj) {
    let weekdayPrice = priceObj.weekdayPrice;   //平日价
    let weekendPrice = priceObj.weekendPrice ? priceObj.weekendPrice : priceObj.weekdayPrice;    //周末价,不存在就取平日价

    let prices = 0;
    switch (week) {
        case 1:
            prices = Number(weekdayPrice) * hours;
            break;
        case 2:
            prices = Number(weekdayPrice) * hours;
            break;
        case 3:
            prices = Number(weekdayPrice) * hours;
            break;
        case 4:
            prices = Number(weekdayPrice) * hours;
            break;
        case 5:
            prices = Number(weekendPrice) * hours;
            break;
        case 6:
            prices = Number(weekendPrice) * hours;
            break;
        case 0:
            prices = Number(weekdayPrice) * hours;
            break;
    }
    return prices;
}

/**
 * 根据今天周几, 获取今天房价
 * @param week 星期几
 * @param priceObj 价格代码 ,含平日价,周末价 { weekdayPrice:100,weekendPrice:120 }
 * @returns {number}
 */
function getDayPrice(week, priceObj) {
    let weekdayPrice = priceObj.weekdayPrice;   //平日价
    let weekendPrice = priceObj.weekendPrice ? priceObj.weekendPrice : priceObj.weekdayPrice;    //周末价,不存在就取平日价
    let prices = 0;
    switch (week) {
        case 1:
            prices = Number(weekdayPrice);
            break;
        case 2:
            prices = Number(weekdayPrice);
            break;
        case 3:
            prices = Number(weekdayPrice);
            break;
        case 4:
            prices = Number(weekdayPrice);
            break;
        case 5:
            prices = Number(weekendPrice);
            break;
        case 6:
            prices = Number(weekendPrice);
            break;
        case 0:
            prices = Number(weekdayPrice);
            break;
    }
    return prices;
}

