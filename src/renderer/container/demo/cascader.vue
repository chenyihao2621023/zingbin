<template>
    <span :class="pickerCls" v-clickoutside="closeDropdown">
        <v-breadcrumb>
          <v-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index" @click.native="handleBread(item.path)">{{item.names}}</v-breadcrumb-item>
        </v-breadcrumb>
        <ul class="ant-cascader-menu" v-if="type === 1">
            <template v-for="(item,index) in selfData">
                <li   :key="index" 
                    :class="['ant-cascader-menu-item', {[prefix+'-item-expand']: item.children, },{[prefix+'-item-disabled']: item.disabled, }, {[prefix+'-item-active']: value == index}]" 
                    :title="item.text" @click.stop="changeMenuValue(num, index)">
                    {{item.text}}
                </li>
            </template>
        </ul>
        <v-checkbox-group @change="checkGroup" v-if="type === 2">
            <v-checkbox v-for="item in selfData" :true-value="item.text" :disabled="item.disabled" :key="item.text">{{item.text}}</v-checkbox>
        </v-checkbox-group>
    </span>
</template>

<script>
import vmenu from "./menu";
import emitter from "../../mixins/emitter";
import { getOffset } from "../../utils/fn";
import { Checklist } from 'vux'
export default {
    name: 'Cascader',
    components: { Checklist },
    mixins: [emitter],
    data: () => ({
        selefData: [],
        num: 0,
        i: -1,
        prefix: 'ant-cascader',
        defaultValue: [],
        style: {},
        container: null,
        open: false,
        label: '',
        path: [],
        type: 1,
        breadcrumb: [{
          path: [0],
          names: '首页'
        }]
    }),
    props: {
        popupContainer: {
            type: Function,
            default: () => document.body,
        },
        position: {
            type: String,
            default: 'absolute',
        },
        data: Array,
        value: {
            type: Array,
            default: () => [],
        },
        placeholder: {
            type: String,
            default: '请选择',
        },
        size: String,
        disabled: {
            type: Boolean,
            default: false,
        },
        allowClear: {
            type: Boolean,
            default: true,
        },
    },
    mounted() {
        this.num = this.path.length 
        this.init();
    },
    watch: {
        num: {
            handler() {
                let res = this.getTreeData(this.num)
                this.selfData = res
                if(res[0] && res[0].children) {
                    this.type =  1
                }else {
                    this.type = 2
                }
            },
            deep: true,
            immediate: true
        },
        path(val) {
          const value = [];
          const label = [];
          this.breadcrumb = [{
          path: [],
          names: '首页'
        }]
          let opt = this.data;
          let arr = []
          for (const i of val) {
              if (i < 0) break;
              arr.push(i)
              value.push(opt[i].value);
              if(opt[i].children) {
                  label.push({
                    path: [...arr],
                    names: opt[i].text
                  });
                  opt = opt[i].children;
              }
              
          }
          this.defaultValue = value;
          this.breadcrumb = this.breadcrumb.concat(label) 

          this.pathChange = true;
        },
        value() {
            if (this.pathChange) return this.pathChange = false;
            this.init();
        },
    },
    computed: {
        pickerCls() {
            return [
                `${this.prefix}-picker`,
                { [`${this.prefix}-picker-disabled`]: this.disabled },
            ];
        },
        inpCls() {
            const size = { large: 'lg', small: 'sm' }[this.size];

            return [
                'ant-input',
                'ant-cascader-input',
                { [`ant-input-${size}`]: size },
            ];
        },

    },
    methods: {
        checkGroup(val) {

        },
        handleLeaf() {

        },
        selectLeaf(leaf) {

        },
        handleBread(path) {


          this.path = path
          this.num = this.path.length 
        },
        getTreeData(index) {
          let res = this.data;
            for (let i = 0; i < index; i++) {
                const s = this.path[i];
                if (res[s].children) {
                    res = res[s].children;
                } else {
                    res = null;
                    break;
                }
            }

            return res;
        },
        init() {
            this.defaultValue = JSON.parse(JSON.stringify(this.value));
            const res = [];
            let opt = this.data;

            for (const val of this.value) {
                for (const [i, item] of opt.entries()) {
                    if (item.value === val) {
                        res.push(i);
                        opt = opt[i].children;
                        break;
                    }
                }
            }
            if (opt) res.push(-1);
            if (this.path.join() !== res.join()) {
              this.path = this.path;

            }
        },
        clear() {
            // this.path = [-1];
        },
        setPosition() {
            if (!this.$el) {
                return;
            }
            const p = getOffset(this.$el, this.container);

            this.style = {
                top: `${p.bottom + 4}px`,
                left: `${p.left}px`,
            };
        },
        getMenuData(index) {
            let res = this.data;
            for (let i = 0; i < index; i++) {
                const s = this.path[i];
                if (res[s].children) {
                    res = res[s].children;
                } else {
                    res = null;
                    break;
                }
            }
            return res;
        },
        closeDropdown() {
            this.open = false;
        },
        toggleMenu() {
            if (this.disabled) return;
            this.open = !this.open;
            if (this.open) {
                this.$nextTick(() => {
                    this.setPosition();
                });
            }
        },
        changeMenuValue(key, i) {
            this.$set(this.path, key, i);
            if (this.getMenuData(key + 1)) {
                
                this.num = key + 1
                this.path.splice(key + 2, this.path.length - 1 - key - 1);

            } else {
                this.path.splice(key + 1, this.path.length - 1 - key);
                this.open = false;
            }
        },
        initPath() {

        }
    },
};
</script>