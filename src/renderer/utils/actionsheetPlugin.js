import { Actionsheet } from 'vux'
let $vm
/* let watcher
let delayTime = null */
const plugin = {
  install(vue, options) {
    const ActionsheetPlugin = vue.extend(Actionsheet)

    if (!$vm) {
      $vm = new ActionsheetPlugin({
        el: document.createElement('div')
      })
      document.body.appendChild($vm.$el)
    }

    const actionsheet = {
      show(options = {}) {
        let params = {};
        if (typeof options === 'object') {
          params = options;
        }
        if (typeof params.theme === "undefined") {
          params.theme = "android"
        }
        Object.assign($vm,params)
        //deepClone($vm, params);
        $vm.show = true;
        // destroy watcher
        /*  watcher && watcher()
         
         if (typeof options === 'object' && options.onShow || options.onHide) {
           watcher = $vm.$watch('show', (val) => {
             val && options.onShow && options.onShow($vm)
             val === false && options.onHide && options.onHide($vm)
           })
         }
         delayTime && clearTimeout(delayTime)
         delayTime = setTimeout(() => {
           $vm.show = true
         }, options.delay || 0) */
      },
      hide() {
        /*  if (delayTime) {
           clearTimeout(delayTime)
           delayTime = null
         }
         $vm.show = false */
      }
    }

    // all Vux's plugins are included in this.$vux
    if (!vue.$vux) {
      vue.$vux = {
        actionsheet
      }
    } else {
      vue.$vux.actionsheet = actionsheet
    }

    vue.mixin({
      created: function () {
        this.$vux = vue.$vux
      }
    })
  }
}

export default plugin
export const install = plugin.install