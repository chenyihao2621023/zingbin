<template>
    <div class="class-setter" v-transfer-dom>
        <popup v-model="showPicker" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="subject-picker-popup">
                <zing-head class="subject-picker-head" :title="'选择分类'" :isComeBack="false" @doSome="backClick"></zing-head>

                <tab v-model="index" class="vue-tab" active-color="#ff8000" height="300px" :show-dots="false">
                    <tab-item class="vux-center" @on-item-click="onTabClick">{{title1}}</tab-item>
                    <tab-item class="vux-center" @on-item-click="onTabClick">{{title2}}</tab-item>
                </tab>
                <div class="content">
                    <div class="variable">
                        <div v-show="currentTab === 'ownedClass'">
                            <checklist title="" :max="1" :label-position="labelPosition" :options="ownedClass" v-model="checklist001" @on-change="change"></checklist>
                        </div>

                        <div v-show="currentTab === 'PublicClass'">
                            <checklist title="" :max="1" :label-position="labelPosition" :options="PublicClass" v-model="checklist002" @on-change="change"></checklist>
                        </div>
                    </div>
                    <div class="bottom">
                        <div>
                            <x-button class="subject-picker-button" type="primary" @click.native="checkSelected">选择
                            </x-button>
                        </div>
                    </div>
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
import {
  Flexbox,
  FlexboxItem,
  Checklist,
  Tab,
  TabItem,
  Popup,
  TransferDomDirective as TransferDom,
  XButton
} from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
import GridCard from "@/components/gridcard/GridCard";
import Scroll from "@/components/scroll/Scroll";
import _ from "lodash";
export default {
  name: "manageClassSetter",
  components: {
    Flexbox,
    FlexboxItem,
    Checklist,
    Scroll,
    GridCard,
    Tab,
    TabItem,
    Popup,
    XButton,
    ZingHead
  },
  directives: {
    TransferDom
  },
  props: {
    title1: {
      type: String
    },
    title2: {
      type: String
    },
    showPicker: {
      // 是否显示
      type: Boolean,
      default: function() {
        return false;
      }
    },
    tagType1: {
      type: String
    },
    tagType2: {
      type: String
    }
  },
  data() {
    return {
      index: 0,
      currentTab: "ownedClass",
      checkedList: [],
      labelPosition: "left",
      ownedClass: [], //私有分类
      PublicClass: [], //公有分类
      checklist001: [], //选中私有
      checklist002: [], //选中公有
      checklistValue001: [],
      checklistValue002: []
    };
  },
  watch: {
    showPicker(isShown) {
      if (isShown) {
        this.initData();
      }
    }
  },

  methods: {
    onTabClick(index) {
      if (index === 0) {
        this.currentTab = "ownedClass";
      } else if (index === 1) {
        this.currentTab = "PublicClass";
      }
    },
    change(val, label) {
      //                console.log("change", val, label);
    },
    initData() {
      //私有请求
      let url = "/zingbiz/common/serviceModule/getAllTags.action";
      let params1 = {
        tagType: this.tagType1,
        pageSize: 50
      };
      this.$http
        .get(url, { params: params1 })
        .then(res => {
          let tagType1 = this.tagType1;
          let owned = res.data.data[tagType1];
          this.ownedClass.splice(0, this.ownedClass.length);
          for (var i = 0; i < owned.length; i++) {
            this.ownedClass.push({ key: owned[i].rowId, value: owned[i].tags });
          }
        })
        .catch(err => {
          this.$message({ message: "失败pp", type: "error" });
        });
      //公有请求
      let params2 = {
        tagType: this.tagType2
      };
      this.$http
        .get(url, { params: params2 })
        .then(res => {
          let tagType2 = this.tagType2;
          let Public = res.data.data[tagType2];
          this.PublicClass.splice(0, this.PublicClass.length);
          for (var i = 0; i < Public.length; i++) {
            this.PublicClass.push({
              key: Public[i].rowId,
              value: Public[i].tags
            });
          }
        })
        .catch(err => {
          this.$message({ message: "失败oo", type: "error" });
        });
    },
    checkSelected() {
      let privateWorkType;
      let superWorkType;

      _.each(this.ownedClass, json => {
        if (this.checklist001.length > 0) {
          if (json.key === this.checklist001[0]) {
            privateWorkType = json.value;
          }
        }
      });
      _.each(this.PublicClass, json => {
        if (this.checklist002.length > 0) {
          if (json.key === this.checklist002[0]) {
            superWorkType = json.value;
          }
        }
      });
      let selected = {
        privateWorkType: privateWorkType,
        superWorkType: superWorkType,
        privateTypeIds: this.checklist001,
        superTypeIds: this.checklist002
      }; //私有分类value 共有分类value
      this.$emit("checkSelected", selected);
    },

    backClick() {
      this.$emit("abort");
    }
  }
};
</script>

<style lang="stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.class-setter {
  .subject-picker-popup {
    height: 100%;

    .content {
      display: flex;
      height: calc(100% - 95px);
      flex-flow: row wrap;
      width: 100%;
      background-color: white;

      .variable {
        width: 100%;
        height: calc(100% -50px);
        align-self: flex-start;
        overflow: auto;
      }

      .bottom {
        width: 100%;
        height: 50px;
        align-self: flex-end;
      }
    }
  }

  .scroll-list-wrap {
    position: relative;
    height: 100%;
    border-radius: 4px;
    transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
    overflow: hidden;
  }
}
</style>
