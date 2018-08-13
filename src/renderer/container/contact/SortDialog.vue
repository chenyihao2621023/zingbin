<template>
  <div>
      <x-dialog
          v-model="showDialog"
          :dialog-style="{'max-width': '90%', width: '90%', height: '50%'}">
          <x-header style="background:#ff8000" :left-options="{showBack:false}">
              <h3 style="color:#fff" slot="left">添加</h3>
          </x-header>
            <div class="sort-item" v-for="(item,index) in sortItemData" :key="index">
                <p><i>*</i>{{item.text}}</p>
                <input v-model="item.title" class="sort-input" :placeholder="item.text"/>
                <p class="sort-text" v-show="item.showPrompt">{{item.prompt}}</p>
            </div>
          <flexbox style="background-color:#e5e5e5;height:60px;position:fixed;bottom:0;left:0" justify="space-around">
              <flexboxItem align="center">
                  <x-button @click.native="onSubmit" style="width:50%;background:#4c9cfc;color:#fff" action-type="button" text="确定" mini></x-button>
              </flexboxItem>
              <flexboxItem align="center">
                  <x-button @click.native="onCancel" style="width:50%;background:#ff8000;color:#fff" action-type="button" text="取消" mini></x-button>
              </flexboxItem>
           </flexbox>
      </x-dialog>
  </div>
</template>
<script>
    import { XDialog,Flexbox,FlexboxItem,XHeader,XButton,XInput,Group } from "vux"
  export default {
    name: 'SortDialog',
    components: {
        XDialog,Flexbox,FlexboxItem,XHeader,XButton,XInput,Group
    },
    props:{
        showDialog: {
            type: Boolean,
            default: false
        },
        sortItemData: {
            type:Array,
            default() {
                return []
            }
        },
        operateType: {
            type: String,
            default: 'add'
        }
    },
    data() {
      return {
      }
    },
    computed: {},
    methods: {
        onCancel() {
            this.$emit('dialogCancel')
        },
        onSubmit() {
            this.$emit('dialogSubmit',this.operateType)
        }
    },
  }
</script>
<style>
    .weui-cell__bd input {
        text-align: left !important;
    }
    .weui-btn_default button{

    }
</style>
<style lang="stylus" rel="stylesheet/stylus">
    .sort-item
      margin-top:20px
      padding:0 10px
      p
       margin-bottom:10px;
       text-align:left
       i
        color:red
        margin-right:5px
      .sort-text
       color:red
      .sort-input
       border:1px solid #d5d5d5
       height:30px
       width:100%
</style>
