export function callCancel(documentEle) {
    let el;
    let qx = ".weui-search-bar__cancel-btn";
    if (documentEle) {
        el = documentEle.querySelector(qx);
    } else {
        el = document.querySelector(qx);
    }
    let clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    el && el.dispatchEvent(clickEvent);
}
export function forwardingMeg(removeGroupList,message,cb,show,chatInfo=PSMU.chatInfo) {
    chatInfo.msg2Group(removeGroupList,message).then(() => {
        console.log('forwardingMeg success');
        // show({
        //     text: '转发成功,正在跳转',
        //     type: 'text',
        //     position: 'bottom',
        //     onHide() {
        //         cb()
        //     }
        // })
        cb()
    }, err => {
        console.error('forwardingMeg failed', err);
        // show({
        //     text: '转发失败',
        //     type: 'text',
        //     position: 'bottom'
        // })
    })
}
