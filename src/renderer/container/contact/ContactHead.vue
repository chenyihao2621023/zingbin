<template>
  <div class="contact-head">
      <zing-head
          :columns="1"
          :title="titleI"
          :popupTitle="title"
          :popupPickerData="allSortList"
           @popup-change="popupChange"
           @popup-onhide="onHide"
      >
        <div slot="header-right">
            <span v-show="showSearchIcon">
                <i @click="onShowSearch" class="iconfont icon-fangdajing header-fangdajing"></i>
            </span>
            <span class="header-jiahao">
                <dropdown style="margin-top:-9px" :data="menuData" trigger="click" placement="bottomRight" @item-click="handleMenu" :placementXAbs="10">
                    <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                        <i class=" iconfont icon-gengduo"></i>
                    </a>
                </dropdown>
            </span>
        </div>
      </zing-head>
      <search
        :searchFlag="showSearch"
        @cancelInput ="onCancel"
        @confirmInput="onSubmit"
      ></search>
  </div>
</template>
<script>
   import ZingHead from "@/components/zingHead/ZingHead.vue"
   import Dropdown from '@/components/dropdown/Dropdown'
   import search from '@/components/search/search'
  export default {
    name: 'ContactHead',
    components: {
        ZingHead,
        Dropdown,
        search
    },
    props:{
        menuData:{
            type:Array,
            default() {
                return []
            }
        },
        allSortList:{
            type:Array,
            default() {
                return []
            }
        },
        showSearchIcon: {
            type:Boolean,
            default:true
        },
        showDropDown: {
            type:Boolean,
            default:true
        },
        title: {
            type:String,
            default: ''
        },
        titleI: {
            type:String,
            default: ''
        }
    },
    data() {
      return {
          showSearch: false,
          value:''
      }
    },
    computed: {},
    methods: {
        onCancel() {
            this.showSearch = false
        },
        onSubmit(val) {
            this.showSearch = false;
            this.$emit('onSearch',val)
        },
        popupChange(val) {
            this.$emit('onHandleSort',val)
        },
         onHide(type, refInstance) {
             console.log(type, refInstance);
         },
        handleMenu(data) {
           this.$emit('onHandleMenu',data)
        },
        onShowSearch() {
           this.showSearch = !this.showSearch
        },
        onChange(val) {
            this.$emit('onSearch',val)
        }
    },
  }
</script>
<style>
</style>
<style lang="stylus" scoped>
    .header-fangdajing
      font-size:22px
      color:#000
      font-weight:bold
      margin-right:5px
    .header-jiahao
      width: 37.5px
      margin-right: 7.5px
      margin-top 3px
      padding-left: 5px
      padding-right: 5px
</style>
