import {emoji2text, text2imageOld} from "../../chat/emoji-convertor";
import filterXSS from "xss";

export function getNewDate(createTime) {
        let timeMsg;
        let now = new Date()
         let nowTime = now.getTime()
        let today = now.getDate()
        let newYear = now.getFullYear()
        let newMouth = now.getMonth() + 1;
        let oldDate = new Date(createTime.replace(/-/g,"/"));
        let date = oldDate.getTime();
        let oldYear = oldDate.getFullYear()
        let mouth = parseInt(oldDate.getMonth()) + 1
        let day = oldDate.getDate()
        let hour = oldDate.getHours()
        let min = oldDate.getMinutes()
        let timeCha = nowTime - date
        let dayOffset = Math.abs(today - day)
        let yearOffset = Math.abs(newYear - oldYear)
        let mouthOffset = Math.abs(newMouth - mouth)
         day < 10 ? day = `0${day}` : null;
         hour < 10 ? hour = `0${hour}` : null;
         min < 10 ? min = `0${min}` : null;
        if (!yearOffset && !mouthOffset) {
             if (dayOffset === 0) {
                    if (timeCha < 60000) {
                        timeMsg = "刚刚"
                    } else if (timeCha < 3600000) {
                        timeMsg = parseInt((timeCha / 60000)) + "分前"
                    } else {
                        timeMsg = parseInt((timeCha / 3600000)) + "小时前"
                    }
                } else {
                    timeMsg = `${mouth}月${day}日 ${hour}:${min}`
                }
            } else {
                timeMsg = `${oldYear}年${mouth}月${day}日`
            }
    return  timeMsg
}


// } else if (offset === 1) {
//     timeMsg = "昨天"
// } else if (offset === 2) {
//     timeMsg = "前天"
// }
export function initText (text) {
    let cn_text = text;
    // emoji转义
    // cn_text = emoji2text(cn_text)
    //换行占位符[^br]
    cn_text = cn_text.replace(/[\n]/g, '[^br]')
    //空格占位符 [^bn]
    // cn_text = cn_text.replace(/[\s]/g,'[^bn]')
    //'\', '"'等特殊字符
    // cn_text = cn_text.replace(/\\/g, '[^bs]').replace(/"/g, '[^dq]')
    // xss filter
//        console.log(filterXSS(msg));
    cn_text = filterXSS(cn_text)
//        msg = $('<span/>').text(msg).html();
    cn_text = PSMU.html2txt(cn_text)
    console.log(cn_text);
    return cn_text
}
// function getText(msgTmp) {
//     let cot = msgTmp;
//     cot = cot.replace(/\[\^br]/g, '</br>').replace(/\[\^bn]/g,'&nbsp;');
//     return cot
// }
// .replace(/\[\^bs]/g, '\\').replace(/\[\^dq]/g, '"')
export function processData(data,cardUrl,selectedFlag) {
    let o = data.map(item => {
            let discoveryItem = {};
            let discoveryImgList = item.discoveryImgList || [];
            let praise = item.praise || '';
            discoveryItem.already = praise.includes(cardUrl);
            discoveryItem.source = item;
            discoveryItem.name = item.companyName;
            discoveryItem.src = `/ImgRender?imgpath=${item.companyImg}.jpg&thumb=200x200&errpath=/JsLib/dist/app/images/weicard.jpg&time=9999.9999&type=.jpg`;
            discoveryItem.list = discoveryImgList.map( item => {
                return { src:item, msrc:item }
            });
            if (selectedFlag === "全选") {
                discoveryItem.selectInput = false
            } else if (selectedFlag === "全不选") {
                discoveryItem.selectInput = true
            }
            discoveryItem.isAdmin = item.isAdmin;//权限 删除
            if (item.discoveryContent) {
                discoveryItem.text = item.discoveryContent;
                let leg = item.discoveryContent.match(/[\n]/g);
                discoveryItem.hideText = (leg && leg.length > 6) || item.discoveryContent.length > 153;
            }
            discoveryItem.showText = false;
            discoveryItem.rowId = item.rowId;
            discoveryItem.time = getNewDate(item.createTime);
            discoveryItem.praiseNum = item.praiseCont;
            discoveryItem.commentNum = item.commentCont;
            return discoveryItem
        });
        return o
}
