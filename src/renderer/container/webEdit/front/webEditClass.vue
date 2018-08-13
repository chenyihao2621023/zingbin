<template>
  <div v-transfer-dom>
    <popup v-model="show" position="right" height="100%" width="100%"
           :popup-style="{'overflow': 'hidden','z-index':'6000'}">
      <popup-header :left-text="'取消'" :right-text="'确定'" :title="'选择分类'" :show-bottom-border="false"
                    @on-click-left="cancelSelect" @on-click-right="confirmSelected"></popup-header>
      <div class="web-class">
        <div class="clazz-list">
          <group>
            <radio title="title" :options="clazzOptions" v-model="radioSelect" @on-change="change"></radio>
          </group>

          <!--<div class="li" v-for="(item,index) in 14" :key="index">-->
          <!--<span style="height: 30px;line-height: 30px">{{item}}</span>-->
          <!--<button class="select-btn">选择</button>-->
          <!--</div>-->
        </div>
      </div>
    </popup>
  </div>
</template>
<script>
  import ZingHead from "@/components/zingHead/ZingHead";
  import { XButton, Popup, TransferDom, PopupHeader, Group, Radio, } from 'vux'

  export default {
    name: "webEditClass",
    components: { ZingHead, XButton, Popup, PopupHeader, Group, Radio, },
    directives: {
      TransferDom
    },
    props: {
      show: {
        type: Boolean,
        default: function () {
          return false;
        }
      },
      //传入的已选
      selected: {
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data() {
      return {
        clazzData: [],
        serviceClazz: [],        //商号分类
        radioSelect: "",         //当前选择
        target: {},              //选择的对象
      }
    },
    computed: {
      clazzOptions: function () {
        let arr = [];
        this.clazzData.forEach(item => {
          arr.push({
            key: item.rowId,
            value: item.tags,
          })
        });
        return arr;
      }
    },
    watch: {
      show: function (isShow) {
        if (isShow) {
          this.loadTags()
        } else {
          this.radioSelect = "";
          this.target = {};
        }
      }
    },
    methods: {
      loadTags() {
        let vm = this;
        let url = "/zingbiz/common/serviceModule/getAllTags.action";
        this.$http
          .get(url, { params: {tagType: "ServiceDesk" }})
          .then(res => {
            console.log("分類", res.data);
            if (res.data.success) {
              vm.clazzData = res.data.data.data;
            }
          });
      },
      change(k, v) {
        this.target.name = v;
        this.target.id = k;
      },
      cancelSelect() {
        this.$emit('cancel', false);
      },
      //确定选择
      confirmSelected() {
        this.$emit('confirm', this.target);
      },
    },
  }
</script>
<style scoped lang="stylus">
  @import '../../../assets/stylus/mixin.styl';
  .web-class, .clazz-list {
    flex-column(column)
  }

  .clazz-list {
    overflow: auto;
    .li {
      padding 5px 13px
      font-size 16px
      border-bottom: 1px solid #e3e3e3;
      .select-btn {
        width 68px;
        height 30px;
        line-height 30px;
        background-color: #ff8000;
        color: #ffffff;
        font-size 16px;
        float right;
        border-radius 5px;
        border none;
      }
    }
  }


</style>
