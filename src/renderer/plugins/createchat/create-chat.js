import CreateChatComponent from '../../components/chat/CreateChat'
import { mergeOptions } from '../plugin_helper'
import router from '../../router'

function createVM (Vue) {
    const CreateChat = Vue.extend(CreateChatComponent)
    const $vm = new CreateChat({
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

        const createChat = {
            show (options = {}) {
                return show.call(this, $vm, options)
            },
            hide () {
                return hide.call(this, $vm)
            }
        }

        if (!Vue.$zingp) {
            Vue.$zingp = {
                createChat
            }
        } else {
            Vue.$zingp.createChat = createChat
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
