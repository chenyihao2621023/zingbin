/**
 * 注，绑定此自定义事件要确保绑定的audio没有子element，可以考虑到绝对定位来实现此布局，见Message的toggle-mask
 */
import { isMhApp, createId } from '../../utils/fn'

let observer

let audioItemDict = {}
let activeAudio = null
let activeAudioItem = null

function audioPlayEvent(evt) {
    // console.log('audioPlayEvent evt', evt)
    let item = evt.target
    let obj = item.querySelector('audio')
    let id = item.getAttribute('data-id')
    let src = item.getAttribute('data-src')
    // app播放录音
    if (isMhApp() && typeof MHAppapi !== 'undefined' && typeof MHAppapi.playR !== 'undefined') {
        // 有其他播放的录音，则暂停播放
        if (activeAudio && activeAudio !== obj) {
            console.log('app pause and play')
            MHAppapi.pauseR();
            activeAudio.currentTime = 0
            activeAudioItem.classList.remove('playing')
        }

        // 如果当前录音正在播放，则暂停；当前录音没有播放，则开始播放
        if (MHAppapi.isRPlaying() === 'true') {
            console.log('app pause')
            MHAppapi.pauseR()
            obj.currentTime = 0
            item.classList.remove('playing')
        } else {
            console.log('app play')
            if (MHAppapi.isRPause() === 'true') {
                MHAppapi.resumeR()
            } else {
                MHAppapi.playR(src, id)
            }
            item.classList.add('playing')
            activeAudio = obj
            activeAudioItem = item
        }
    }
    // 非app播放录音
    else {
        if (activeAudio && activeAudio !== obj) {
            console.log('html pause and play')
            activeAudio.pause()
            activeAudio.currentTime = 0
            activeAudioItem.classList.remove('playing')
        }
        if (obj.paused) {
            try {
                console.log('html play')
                obj.play()
            } catch (e) {
                console.error(e.message, e.stack)
            }

            item.classList.add('playing')
            activeAudio = obj
            activeAudioItem = item

            obj.onended = () => {
                item.classList.remove('playing')
            }
        } else {
            console.log('html pause')
            obj.pause()
            obj.currentTime = 0
            item.classList.remove('playing')
        }
        // console.log(obj.paused);
    }
}

function scanStuff(el) {
    // console.log($(that._settings.wrapper + ':not(.audioControl)'));
    let itemList = el.querySelectorAll('.audio:not(.audio-control)')
    // console.log('__scanStuff', itemList ? itemList.length : 'no change');

    for (let i = 0; i < itemList.length; i++) {
        let item = itemList[i]

        let id = 'audio-control-' + createId()
        item.setAttribute('data-id', id)
        let src = item.getAttribute('data-src')

        // append html
        let tpl = `<div class="audio-control-content" data-id="${id}" data-value="1" ` +
                      `data-name="Messagevoice" style="display: none; width: 0px; height: 0px;">` +
                          `<audio id="${id}" data-value="1" data-id="${id}" controls ` +
                              `name="MessageFromaudio" style="display: none; width: 0px; height: 0px;"` +
                                  `<source src="${src}" type="audio/mp3"/>` +
                          `</audio>` +
                  `</div>`
        item.insertAdjacentHTML('beforeend', tpl)

        item.classList.add('audio-control')

        // bind event
        item.addEventListener('click', audioPlayEvent, { capture: true })

        audioItemDict[id] = item
    }

    /*$(document).on(EVENT_MEDIA_PLAY_COMPLETED, function(){
        $(that._settings.wrapper + '.audioControl.active').removeClass('active');
    });*/

    // console.log('audioItemDict', audioItemDict)
}

const directive = {
    bind(el) {
        scanStuff(el)

        // 监听el子节点变化
        // Options for the observer (which mutations to observe)
        // At the very least, childList, attributes, or characterData must be set to true.
        // Otherwise, "An invalid or illegal string was specified" error is thrown.
        let config = { childList: true, attributes: true, characterData: true }
        // Callback function to execute when mutations are observed
        let callback = mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    scanStuff(el)
                }
            }
        }
        // Create an observer instance linked to the callback function
        observer = new MutationObserver(callback)
        // Start observing the target node for configured mutations
        observer.observe(el, config)
    },
    unbind() {
        observer.disconnect()
    }
}

export default directive
