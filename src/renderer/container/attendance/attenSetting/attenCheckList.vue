<template>
  <div class="check-panel weui-panel weui-panel_access">
    <div class="weui-panel__hd" v-if="header" @click="onClickHeader" v-html="header">
      <slot name="header"></slot>
    </div>

    <div class="weui-panel__bd weui-cells weui-cells_checkbox">
      <slot name="body">
          <div class="weui-cell weui-check_label" :class="{'vux-checklist-label-left': labelPosition === 'left'}"
               v-for="(item, index) in list" @click.prevent="onItemClick(item)">
            <label class="weui-cell__hd" v-show="!disabled" :for="`checkbox_${uuid}_${index}`" @click.stop.prevent="onCheckClick(item, index, $event)">
              <input type="checkbox" class="weui-check" :name="`vux-checkbox-${uuid}`" :value="getKey(item)"
                     v-model="currentValue" :id="disabled ? '' : `checkbox_${uuid}_${index}`"
                     :disabled="isDisabled(getKey(item))">
              <i class="weui-icon-checked vux-checklist-icon-checked"></i>
            </label>
            <label class="weui-cell__bd" @click.stop.prevent="onCheckClick(item, index, $event)">
              <a  class="weui-media-box weui-media-box_appmsg">
                <div class="weui-media-box__bd">
                  <h4 class="weui-media-box__title" v-html="item.title"></h4>
                </div>
              </a>
            </label>
             <label >
                    <i class="icon iconfont icon-xiewrite18" style="font-size: 30px;padding: 10px;" @click="editDateSet(item)"></i>
                    <i class="icon iconfont icon-shanchu1" style="font-size: 30px;padding: 10px;" @click="delDateSet(item)"></i> 
             </label>
          </div>
      </slot>
    </div>
    <div class="weui-panel__ft">
      <a class="weui-cell weui-cell_access weui-cell_link" :href="getUrl(footer.url)" v-if="footer && type !== '3'"
         @click.prevent="onClickFooter">
        <div class="weui-cell__bd" v-html="footer.title"></div>
      </a>
    </div>
  </div>
</template>

<script>
import {XButton} from 'vux'
  export default {
    name: 'CheckPanel',
    components: {
        XButton
    },
    props: {
      header: String,
      footer: Object,
      list: Array,
      type: {
        type: String,
        default: '1'
      },
      // from checklist
      value: {
        type: Array,
        default: () => []
      },
      checkDisabled: {
        type: Boolean,
        default: true
      },
      labelPosition: {
        type: String,
        default: 'right'
      },
      max: Number,
      min: Number,
      disabled: Boolean
    },
    data() {
      return {
        uuid: createId(),
        currentValue: [],
        tempValue: '' // used only for radio mode
      }
    },
    computed: {
      isRadio() {
        if (typeof this.max === 'undefined') {
          return false
        } else {
          return this.max === 1
        }
      },
      _total() {
//        console.log(this.list)
        return this.list.length
      },
      _min() {
        if (!this.min) {
          return 0
        }
        if (this.min) {
          return Math.min(this._total, this.min)
        }
        if (this.min) {
          let max = Math.max(1, this.min)
          return Math.min(this._total, max)
        } else {
          return 1
        }
      },
      _max() {
        if (!this.max) {
          return this._total
        }
        if (this.max) {
          if (this.max > this._total) {
            return this._total
          }
          return this.max
        } else {
          return this._total
        }
      },
      valid() {
        return this.currentValue.length >= this._min && this.currentValue.length <= this._max
      }
    },
    watch: {
      value (newVal) {
        // console.log('value', newVal)
        if (JSON.stringify(newVal) !== JSON.stringify(this.currentValue)) {
          this.currentValue = newVal
        }
      },
      tempValue (val) {
        const _val = val ? [val] : []
        this.$emit('input', _val)
        this.$emit('on-change', _val)
      },
      currentValue (newVal) {
        // console.log('currentValue', newVal)
        const val = pure(newVal)

        if (!this.isRadio) {
          this.$emit('input', val)
          this.$emit('on-change', val)
          let err = {}
          if (this._min) {
            if (this.required) {
              if (this.currentValue.length < this._min) {
                err = {
                  min: this._min
                }
              }
            } else {
              if (this.currentValue.length && this.currentValue.length < this._min) {
                err = {
                  min: this._min
                }
              }
            }
          }
          if (!this.valid && this.dirty && Object.keys(err).length) {
            this.$emit('on-error', err)
          } else {
            this.$emit('on-clear-error')
          }
        }
      }
    },
    beforeUpdate() {
      if (this.isRadio) {
        const length = this.currentValue.length
        if (length > 1) {
          this.currentValue = [this.currentValue[length - 1]]
        }
        const val = pure(this.currentValue)
        this.tempValue = val.length ? val[0] : ''
      }
    },
    created() {
      if (this.value) {
        this.currentValue = this.value
        if (this.isRadio) {
          this.tempValue = this.isRadio ? this.value[0] : this.value
        }
      }
    },
    mounted() {
//      console.log(this.list)
    },
    methods: {
      editDateSet(item) {
          this.$emit('goAttenDateTem',item)
      },
      delDateSet(item){
          this.$emit('godelAttenDateTem',item)
      },
      go(url, $router) {
        if (/^javas/.test(url) || !url) return
        const useRouter = typeof url === 'object' || ($router && typeof url === 'string' && !/http/.test(url))
        if (useRouter) {
          if (typeof url === 'object' && url.replace === true) {
            $router.replace(url)
          } else {
            url === 'BACK' ? $router.go(-1) : $router.push(url)
          }
        } else {
          window.location.href = url
        }
      },
      getKey(item) {
        return typeof item === 'object' ? item.key : item
      },
      onImgError(item, $event) {
        this.$emit('on-img-error', JSON.parse(JSON.stringify(item)), $event)
        if (item.fallbackSrc) {
          $event.target.src = item.fallbackSrc
        }
      },
      getUrl(url) {
        // Make sure the href is right in hash mode
        if (this.$router && !this.$router._history && typeof url === 'string' && !/http/.test(url)) {
          return '#!' + url
        }
        return url && typeof url !== 'object' ? url : 'javascript:void(0);'
      },
      onClickFooter() {
        this.$emit('on-click-footer')
        this.go(this.footer.url, this.$router)
      },
      onClickHeader() {
        this.$emit('on-click-header')
      },
      onItemClick(item) {
        this.$emit('on-click-item', item)
        this.go(item.url, this.$router)
      },
      onCheckClick(item, index, $event) {
        // console.log('onCheckClick', item, index, $event)
        if (this.isRadio) {
          this.selectRadio(this.getKey(item))
        } else {
          this.selectCheckbox(this.getKey(item))
        }
        // console.log('currentValue', this.currentValue)
      },
      isDisabled(key) {
        if (!this.checkDisabled) {
          return false
        }
        if (this._max > 1) {
          return this.currentValue.indexOf(key) === -1 && this.currentValue.length === this._max
        }
        return false
      },
      selectRadio (value) {
        if (!this.disabled) {
          if (this.currentValue.length > 0 && this.currentValue[0] === value) {
            this.currentValue = []
            this.tempValue = ''
          } else {
            this.currentValue = [value]
            this.tempValue = value
          }
        }
      },
      selectCheckbox (value) {
        if (!this.currentValue || this.currentValue === null) {
          this.currentValue = []
        }
        const isSimpleValue = typeof value === 'string' || typeof value === 'number'
        if (!this.disabled) {
          let index = -1
          if (isSimpleValue) {
            index = this.currentValue.indexOf(value)
          } else {
            index = this.currentValue.map(one => JSON.stringify(one)).indexOf(JSON.stringify(value))
          }
          if (index > -1) {
            this.currentValue.splice(index, 1)
          } else {
            if (!this.max || (this.max && (this.currentValue !== null && this.currentValue.length < this.max))) {
              if (!this.currentValue || !this.currentValue.length) {
                this.currentValue = []
              }
              this.currentValue.push(value)
            }
          }
        }
      }
    }
  }

  function pure(obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  function createId() {
    return Math.random().toString(36).substring(3, 8)
  }
</script>

<style lang="less">
  @import '~vux/src/styles/weui/widget/weui_cell/weui_cell_global';
  @import '~vux/src/styles/weui/widget/weui_cell/weui_access';
  @import '~vux/src/styles/weui/widget/weui_panel/weui_panel';
  @import '~vux/src/styles/weui/widget/weui_media_box/weui_media_box';
  @import '~vux/src/styles/weui/widget/weui_cell/weui_cell_global';
  @import '~vux/src/styles/weui/widget/weui_cell/weui_check';
  @import '~vux/src/styles/weui/icon/weui_icon_font';
  @import '~vux/src/styles/variable';

  .weui-cells_checkbox .weui-check:checked + .vux-checklist-icon-checked:before {
    color: @checklist-icon-active-color;
  }

  .weui-cells_checkbox > label > * {
    pointer-events: none;
  }

  .vux-checklist-disabled .vux-checklist-icon-checked:before {
    opacity: 0.5;
  }

  .vux-checklist-label-left {
    flex-direction: row-reverse;
  }

  .check-panel .weui-cells {
    margin-top: 0;
  }
  /*.check-panel .weui-cell__hd {*/
    /*padding-top: 1em;*/
    /*padding-bottom: 1em;*/
  /*}*/
</style>
