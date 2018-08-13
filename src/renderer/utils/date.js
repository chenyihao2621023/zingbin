
/**
 * 返回两时间段之间 总小时数
 * @param {开始时间} time_str1
 * @param {结束时间} time_str2
 * 注: 两个参数,必须格式相同,要么都带日期,要么都不带
 * 如: getHour('2017-8-23 12:05:05', '2017-8-25 10:05:05')
 *      getHour('10:05:05', '12:05:05')
 */
export function getHours(s1, s2) {
    let reDate = /\d{4}-\d{1,2}-\d{1,2} /;
    s1 = new Date((reDate.test(s1) ? s1 : '2017-1-1 ' + s1).replace(/-/g, '/'));
    s2 = new Date((reDate.test(s2) ? s2 : '2017-1-1 ' + s2).replace(/-/g, '/'));
    var ms = s2.getTime() - s1.getTime();
    if (ms < 0) return 0;
    return Math.floor(ms / 1000 / 60 / 60);
}

export function str2Date(date_time_str) {
    let date_str = date_time_str.split(' ')[0];
    let date_arr = date_str.split('-');
    return new Date(date_arr[0], date_arr[1] - 1, date_arr[2]);
}

/**
 * 比较两日期大小
 * @param date1_str
 * @param date2_str
 * @return {number} 若大于0，则date1_str大于date2_str，否则相反
 */
export function compareDate(date1_str, date2_str) {
    return str2Date(date1_str) - str2Date(date2_str);
}

/**
 * 日期加减
 * @param date 操作的日期 Date类型
 * @param days 加减的天数，正数为加，负数为减
 * @return {Date} 新日期 Date类型
 */
export function AddDays(date, days) {

    let days_num = 1000 * 60 * 60 * 24 * days;
    return new Date(date.getTime() + days_num);
}

/**
 * 日期转为字符串
 * @param date 日期
 * @return {string} 该日期字符串格式: yyyy-MM-dd
 */
export function parseDateStr(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var days = date.getDate();
    if (month < 10) {
        month = '0' + month
    }
    if (days < 10) {
        days = '0' + days
    }
    return year + '-' + month + '-' + days;
}

export function dateFormat(date, fmt = 'yyyy-MM-dd HH:mm:ss') {
    if (!date || !(date instanceof Date)) {
        console.error('dateFormat error date', date)
        return ''
    }

    var o = {
        'y+' : date.getFullYear(),                     // 年份（4位数）
        'M+' : date.getMonth() + 1,                    // 月份
        'd+' : date.getDate(),                         // 日
        'H+' : date.getHours(),                        // 小时（24小时）
        'm+' : date.getMinutes(),                      // 分
        's+' : date.getSeconds(),                      // 秒
        'S+'  : date.getMilliseconds()                 // 毫秒
    }

    let dateStr = fmt
    for (let k in o) {
        if (!o.hasOwnProperty(k)) continue
        if (new RegExp('(' + k + ')').test(fmt)) {
            dateStr = dateStr.replace(RegExp.$1, ('0'.repeat(RegExp.$1.length) + o[k]).substr(String(o[k]).length))
        }
    }
    return dateStr
}

export function Z_BuildDate(dateString, formatter) {
    let tmpStr = dateString
    let tmpFmt = formatter

    let today = new Date()
    if (!tmpStr || tmpStr === '') {
        return today
    }
    if (!tmpFmt || tmpFmt === '') {
        tmpFmt = "yyyy-MM-dd HH:mm:ss"
    }
    let yearMarker = tmpFmt.replace(/[^y|Y]/g, '')
    let monthMarker = tmpFmt.replace(/[^M]/g, '')
    let dayMarker = tmpFmt.replace(/[^d]/g, '')
    let hourMarker = tmpFmt.replace(/[^H]/g, '')
    let minutesMarker = tmpFmt.replace(/[^m]/g, '')
    let secondsMarker = tmpFmt.replace(/[^s]/g, '')
    let yearPosition = tmpFmt.indexOf(yearMarker)
    let yearLength = yearMarker.length
    let year = Number(tmpStr.substring(yearPosition, yearPosition + yearLength))
    if (yearLength === 2) {
        if (year < 50) {
            year += 2000
        }
        else {
            year += 1900
        }
    }
    let monthPosition = tmpFmt.indexOf(monthMarker)
    let month = Number(tmpStr.substring(monthPosition, monthPosition + monthMarker.length)) - 1
    let dayPosition = tmpFmt.indexOf(dayMarker)
    let day = Number(tmpStr.substring(dayPosition, dayPosition + dayMarker.length))
    let hourPosition = tmpFmt.indexOf(hourMarker)
    let hour = Number(tmpStr.substring(hourPosition, hourPosition + hourMarker.length))
    let minutesPosition = tmpFmt.indexOf(minutesMarker)
    let minutes = Number(tmpStr.substring(minutesPosition, minutesPosition + minutesMarker.length))
    let secondsPosition = tmpFmt.indexOf(secondsMarker)
    let seconds = Number(tmpStr.substring(secondsPosition, secondsPosition + secondsMarker.length))
    return new Date(year, month, day, hour, minutes, seconds)
}
