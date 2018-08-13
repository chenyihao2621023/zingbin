import EmojiConvertor from '../../assets/js/emoji'
import { emojiMapping } from './emoji-data'

let emoji = new EmojiConvertor();
emoji.init_colons()
emoji.img_sets.apple.path = './static/emoji/img-apple-64/'
emoji.img_set = 'apple'
// console.log('emoji', emoji)

const rx_emojiname = /\[[\u4e00-\u9fa5]+]/g

export default emoji

export function emoji2text(msg) {
    emoji.colons_mode = true

    let msgTmp = emoji.replace_unified(msg);
    // console.log('emoji',msgTmp)

    let retMsg = msgTmp.replace(emoji.rx_colons, function(m) {
        let val = emojiMapping[m];
        // console.log('emoji', emoji.map.colons)
        return val ? val : m;
    });

    console.log('emoji2text' + msg + ' >> ' + retMsg)

    return retMsg
}

export function text2emoji(msg) {
    let msgTmp = msg.replace(rx_emojiname, function(m) {
        let val = emojiMapping[m];
        return val ? val : m;
    });

    emoji.replace_mode = 'unified';
    emoji.allow_native = true;
    emoji.colons_mode = false;

    let retMsg = emoji.replace_colons(msgTmp);

    console.log('text2emoji' + msg + ' >> ' + retMsg)
    return retMsg
}

export function text2image(msg) {
    // console.log('emoji', msg, msg.match(rx_emojiname))
    let msgTmp = msg.replace(rx_emojiname, function(m) {
        // console.log('emoji match', m, emojiMapping[m])
        let val = emojiMapping[m];
        return val ? emojiMapping[m] : m;
    });

    emoji.replace_mode = 'unified'
    emoji.allow_native = false
    emoji.colons_mode = false
    let retStr = emoji.replace_colons(msgTmp)

    // console.log('text2image' + msg + ' >> ' + retStr)
    return retStr
}

export function text2imageOld(msg) {
    emoji.replace_mode = 'unified'
    emoji.allow_native = false
    emoji.colons_mode = false
    let retStr = emoji.replace_colons(msg.replace(/\[\^:]/g, ':'))
    emoji.replace_mode = 'unified'
    emoji.allow_native = true
    emoji.colons_mode = false
    let retUni = emoji.replace_colons(msg.replace(/\[\^:]/g, ':'))
    return [retStr, retUni]
}
