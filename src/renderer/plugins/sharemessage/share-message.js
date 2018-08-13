import ShareMessageComponent from '../../components/sharemessage/ShareMessage.vue'
import { mergeOptions } from '../plugin_helper'
import router from '../../router'

function createVM (Vue) {
    const ShareMessage = Vue.extend(ShareMessageComponent)
    const $vm = new ShareMessage({
        el: document.createElement('div'),
        router
    })
    document.body.appendChild($vm.$el)
    return $vm
}

function show ($vm, options) {
    if (typeof options === 'object') {
        mergeOptions($vm, options)
    } else if (typeof options === 'string') {
        $vm.content = options
    }
    /*this.watcher && this.watcher()
    this.watcher = $vm.$watch('showValue', (val) => {
        val && options.onShow && options.onShow($vm)
        if (val === false && options.onHide) {
            options.onHide($vm)
            this.watcher && this.watcher()
        }
    })*/
    $vm.showPage = true
}

function hide ($vm) {
    $vm.showPage = false
    /* $vm.$nextTick(() => {
         this.watcher && this.watcher()
         this.watcher = null
     })*/
}

let $vm

const plugin = {
    install (Vue) {
        if (!$vm) {
            $vm = createVM(Vue)
        }

        const shareMessage = {
            show (options = {}) {
                console.log(options);
                return show.call(this, $vm, options)
            },
            hide () {
                return hide.call(this, $vm)
            }
        }

        if (!Vue.$zingp) {
            Vue.$zingp = {
                shareMessage
            }
        } else {
            Vue.$zingp.shareMessage = shareMessage
        }

        Vue.mixin({
            created: function () {
                this.$zingp = Vue.$zingp
            }
        })
    }
}

export default plugin
export const install = plugin.install
