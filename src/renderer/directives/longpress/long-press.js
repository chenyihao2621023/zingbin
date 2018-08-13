/**
 * 注，绑定此自定义事件要确保绑定的element没有子element，可以考虑到绝对定位来实现此布局，见Message的message-mask
 */
import { isPc, createId } from '../../utils/fn'

const delay = 1000
const isDesktop = isPc()

let timeoutDict = {}
// let isOc = false

let mousedownListener = evt => {
    let element = evt.target
    let id = element.getAttribute('long-press-id')
    // console.log('mousedown', element, id)
    // isOc = false
    //长按时间超过delay毫秒，则执行传入的方法
    timeoutDict[id] = setTimeout(() => {
        // isOc = true
        // 阻止事件并向上派发模拟事件，以阻止本次点击事件
        evt.preventDefault()
        evt.stopPropagation()

        let mouseupEvt = new MouseEvent('mouseup', {
            view: window,
            bubbles: true,
            cancelable: true
        })
        element.parentElement && element.parentElement.dispatchEvent(mouseupEvt)

        // 自定义长按事件
        let longPressEvt = new CustomEvent('longpress', {
            bubbles: 'false',
            cancelable: 'true'
        })
        element.dispatchEvent(longPressEvt)
    }, delay)
}
let mouseupListener = evt => {
    // console.log('mouseup')
    let element = evt.target
    let id = element.getAttribute('long-press-id')
    //长按时间少于delay毫秒，不执行传入的方法
    clearTimeout(timeoutDict[id])
}

let touchstartListener = evt => {
    console.log('touchstart')
    let element = evt.target
    let id = element.getAttribute('long-press-id')
    // isOc = false
    //长按时间超过delay毫秒，则执行传入的方法
    timeoutDict[id] = setTimeout(() => {
        // isOc = true
        // 阻止事件并向上派发模拟事件，以阻止本次点击事件
        evt.preventDefault()
        evt.stopPropagation()

        let touchendEvt = new TouchEvent('touchend', {
            view: window,
            bubbles: true,
            cancelable: true
        })
        element.parentElement && element.parentElement.dispatchEvent(touchendEvt)

        // 自定义长按事件
        let longPressEvt = new CustomEvent('longpress', {
            bubbles: 'false',
            cancelable: 'true'
        })
        element.dispatchEvent(longPressEvt)
    }, delay)
}

let touchendListener = evt => {
    console.log('touchend')
    let element = evt.target
    let id = element.getAttribute('long-press-id')
    //长按时间少于delay毫秒，不执行传入的方法
    clearTimeout(timeoutDict[id])
}
/*
let preventClickListener = evt => {
    console.log('click prevent', isOc)
    if (isOc) {
        evt.preventDefault()
        evt.stopPropagation()
    }
}*/

const directive = {
    bind(el) {
        let id = createId()
        el.setAttribute('long-press-id', id)
        if (isDesktop) {
            // 非safari浏览器
            el.addEventListener('mousedown', mousedownListener)
            el.addEventListener('mouseup', mouseupListener)
        } else {
            // safari浏览器
            el.addEventListener('touchstart', touchstartListener)
            el.addEventListener('touchend', touchendListener)
        }
        /*// 先于其他element收到点击事件并中断这个事件
        el.addEventListener('click', preventClickListener, true)*/
    },
    unbind(el) {
        if (isDesktop) {
            el.removeEventListener('mousedown', mousedownListener)
            el.removeEventListener('mouseup', mouseupListener)
        } else {
            el.removeEventListener('touchstart', touchstartListener)
            el.removeEventListener('touchend', touchendListener)
        }
        /*el.removeEventListener('click', preventClickListener)*/
    }
}

export default directive
