<template>
    <div class="sortTypeAndTemplate-picker" v-transfer-dom>
        <popup v-model="showSortTypeAndTemplate"
               height="100%"
               width="100%"
               position="right"
               :popup-style="{'overflow': 'hidden'}">
            <div class="sortTypeAndTemplate-picker-popup">
                <zing-head :title="'审批排序'"
                           :isComeBack="false"
                           @doSome="cancleClick"
                ></zing-head>
                <div id="sortTypeAndTemplate" class="sortTypeAndTemplate">
                    <!-- 分类及模板显示 -->
                    <div v-for="(value,key,index) in initData" :key="index">
                        <div :id="value.typeData.rowId" style="clear:both;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
                        <div style="padding:8px;border-bottom:1px solid #EFEFF4;">
                            <flexbox>
                                <flexbox-item :span="6"><div>
                                    <p v-if="value.typeData.isDeleteForType=='启用'" >{{value.typeData.categoryName}}</p>
                                    <p v-else style="text-decoration:line-through;color:#ccc;">{{value.typeData.categoryName}}</p>
                                </div></flexbox-item>
                                <flexbox-item style="text-align: right;">
                                    <i @click="moveUp(value.typeData,'type',value.curTypeIndex)" class="iconfont icon-shangyi"></i>
                                    <i @click="moveDown(value.typeData,'type',value.curTypeIndex)" class="iconfont icon-xiayi"></i>
                                    <i v-show="hidTplDiv.indexOf(key)!=-1" @click="handleHidTplDiv(key)" style="color: #ccc;font-size: 20px;" class="iconfont icon-xiala"></i>
                                    <i v-show="hidTplDiv.indexOf(key)==-1" @click="handleHidTplDiv(key)" style="color: #ccc;font-size: 20px;" class="iconfont icon-shouqi"></i>
                                </flexbox-item>
                            </flexbox>
                        </div>
                        <div v-show="hidTplDiv.indexOf(key)==-1">
                            <GridCard :id="item.rowId" v-for="(item,index2) in value.tplData" :key="index2">
                                <div slot="cardLeft" class="left" >
                                    <avatar shape="square" :style="{background:'#fff'}">
                                        <i v-if="item.isDeleteForTemplate=='启用'" style="color:#F59324;font-size: 45px;" :class="['iconfont', `icon-${item.templateIcon}`]"></i>
                                        <i v-else style="color:#ccc;font-size: 45px;" :class="['iconfont', `icon-${item.templateIcon}`]"></i>
                                    </avatar>
                                    <div class="left-wrapper">
                                        <p class="left-wrapper-title">{{item.templateName}}</p>
                                        <div class="left-wrapper-desc">{{item.templateDesc}}</div>
                                    </div>
                                </div>
                                <div slot="cardRight" class="right">
                                    <i @click="moveUp(item,'template',key,index2)" class="iconfont icon-shangyi"></i>
                                    <i @click="moveDown(item,'template',key,index2)" class="iconfont icon-xiayi"></i>
                                </div>
                            </GridCard>
                        </div>
                    </div>
                    <div v-show="!isHaveTpl" style="text-align: center;color:#ff8000;font-size: 16px;">
                        <div style="clear:both;border-top: 1px solid #ccc;border-bottom: 1px solid #ccc;height:8px;background-color:#EFEFF4;"></div>
                        <br/>
                        无数据！
                    </div>

                    <!--<div style="display: flex;position: absolute;z-index: 500;bottom: 5px;width: 100%;background-color: #f7f7fa;">-->

                        <!--<flexbox>-->
                            <!--<flexbox-item>-->
                                <!--<x-button type="primary" class="btn-common" @click.native="cancleClick">取消</x-button>-->
                            <!--</flexbox-item>-->
                            <!--<flexbox-item>-->
                                <!--<x-button type="primary" class="btn-save" @click.native="submit">确定</x-button>-->
                            <!--</flexbox-item>-->
                        <!--</flexbox>-->
                    <!--</div>-->
                </div>


            </div>
            <confirm v-model="confirmShow.confirmOne"
                     title = "提示"
            >
                <p style="text-align:left;">

                </p>
            </confirm>
        </popup>

    </div>
</template>

<script>
import ZingHead from "@/components/zingHead/ZingHead";
import GridCard from "@/components/gridcard/GridCard";
import Avatar from "@/components/avatar/Avatar";

import {
  Confirm,
  Actionsheet,
  Flexbox,
  XButton,
  Popup,
  FlexboxItem,
  TransferDomDirective as TransferDom
} from "vux";
export default {
  name: "sortTypeAndTemplate",
  components: {
    ZingHead,
    Confirm,
    Actionsheet,
    Flexbox,
    FlexboxItem,
    GridCard,
    Avatar,
    Popup,
    XButton
  },
  directives: {
    TransferDom
  },
  data() {
    return {
      confirmShow: {
        confirmOne: false
      },
      tplData: {}, //模板数据
      hidTplDiv: []
    };
  },
  watch: {
    initData: {
      handler: function(value, oldvalue) {
        this.$forceUpdate();
        //                    console.log(value,oldvalue);
      }
    }
  },
  props: {
    showSortTypeAndTemplate: {
      // 是否显示
      type: Boolean,
      default: function() {
        return false;
      }
    },
    initData: {
      // 是否显示
      type: Array,
      default: function() {
        return [];
      }
    },
    isHaveTpl: {
      // 是否显示
      type: Boolean,
      default: function() {
        return false;
      }
    },
    allTypeData: {
      // 是否显示
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  //钩子加载完触发
  created: function() {},
  methods: {
    handleHidTplDiv(typeId) {
      let temp = this.hidTplDiv.indexOf(typeId);
      if (temp != -1) {
        this.hidTplDiv.splice(temp, 1);
      } else {
        this.hidTplDiv.push(typeId);
      }
    },
    cancleClick() {
      this.$emit("cancleClick");
    },
    moveUp(curData, dataType, key, index2) {
      let dataTemp = this.initData;
      let url = "";
      if (dataType == "type") {
        let previousData = key - 1 < 0 ? undefined : this.allTypeData[key - 1];
        if (previousData == undefined) {
          this.$vux.toast.text("无位置可移动了！", "top");
          return false;
        }

        let curN = curData.serialNumberForType;
        let preN = previousData.serialNumberForType;

        console.log("互换后数据", dataTemp);
        let postParams = {
          curData: {
            rowId: curData.rowId,
            categoryId: curData.categoryId,
            serialNumberForType: preN
          },
          otherData: {
            rowId: previousData.rowId,
            categoryId: previousData.categoryId,
            serialNumberForType: curN
          }
        };
        url = "/zingbiz/workflow/typeAndTemplate/updateTypeOrder";
        this.updateData(url, postParams, "up");
      } else if (dataType == "template") {
        let previousData = this.initData[key].tplData[index2 - 1];
        if (previousData == undefined) {
          this.$vux.toast.text("无位置可移动了！", "top");
          return false;
        }

        let curN = curData.serialNumberForTemplate;
        let preN = previousData.serialNumberForTemplate;

        let postParams = {
          curData: {
            rowId: curData.rowId,
            templateId: curData.templateId,
            serialNumberForTemplate: preN
          },
          otherData: {
            rowId: previousData.rowId,
            templateId: previousData.templateId,
            serialNumberForTemplate: curN
          }
        };
        url = "/zingbiz/workflow/typeAndTemplate/updateTemplateOrder";
        this.updateData(url, postParams, "up");
      }
    },
    moveDown(curData, dataType, key, index2) {
      let dataTemp = this.initData;
      let url = "";
      if (dataType == "type") {
        let nextData =
          parseInt(key) + 1 >= this.allTypeData.length
            ? undefined
            : this.allTypeData[parseInt(key) + 1];
        if (nextData == undefined) {
          this.$vux.toast.text("无位置可移动了！", "top");
          return false;
        }
        let curN = curData.serialNumberForType;
        let nextN = nextData.serialNumberForType;

        let postParams = {
          curData: {
            rowId: curData.rowId,
            categoryId: curData.categoryId,
            serialNumberForType: nextN
          },
          otherData: {
            rowId: nextData.rowId,
            categoryId: nextData.categoryId,
            serialNumberForType: curN
          }
        };
        url = "/zingbiz/workflow/typeAndTemplate/updateTypeOrder";
        this.updateData(url, postParams, "down");
      } else if (dataType == "template") {
        let nextData = this.initData[key].tplData[index2 + 1];
        if (nextData == undefined) {
          this.$vux.toast.text("无位置可移动了！", "top");
          return false;
        }
        let curN = curData.serialNumberForTemplate;
        let nextN = nextData.serialNumberForTemplate;

        let postParams = {
          curData: {
            rowId: curData.rowId,
            templateId: curData.templateId,
            serialNumberForTemplate: nextN
          },
          otherData: {
            rowId: nextData.rowId,
            templateId: nextData.templateId,
            serialNumberForTemplate: curN
          }
        };
        url = "/zingbiz/workflow/typeAndTemplate/updateTemplateOrder";
        this.updateData(url, postParams, "down");
      }
    },
    updateData(url, postParams, upOrDown) {
      this.$http.post(url, postParams).then(res => {
        if (res.data.success) {
          let retData = res.data.data.categoryNameTpl;
          if (retData != undefined) {
            this.allTypeData = [];
            this.allTypeData =
              res.data.data.allTypeData == undefined
                ? {}
                : res.data.data.allTypeData;
            this.handleTemplate(this.allTypeData, retData);
          }
          this.$emit("reload");
          let dom = document.getElementById("sortTypeAndTemplate");
          if (upOrDown == "up") {
            let otherDataPosition = document.getElementById(
              postParams.otherData.rowId
            ).offsetTop;
            dom.scrollTo(dom.scrollLeft, otherDataPosition - 50);
          } else {
            let scrollPosition = document.getElementById(
              postParams.curData.rowId
            ).offsetTop;
            dom.scrollTo(dom.scrollLeft, scrollPosition - 50);
          }

          //                    this.$vux.toast.text("操作成功！",'top');
        } else {
          this.$vux.toast.text("操作异常，请稍后重试！", "top");
        }
      });
    },
    handleTemplate(allTypeData, tpl) {
      let sortTplDataTemp = [];
      if (allTypeData != undefined) {
        for (let key in allTypeData) {
          //获取当前分类下的模板数据
          let tplDataForCurType = tpl[allTypeData[key].categoryId];
          sortTplDataTemp.push({
            tplData: tplDataForCurType,
            typeData: allTypeData[key],
            curTypeIndex: key
          });
        }
        this.initData = sortTplDataTemp;
      }
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.iconfont {
  font-size: 20px;
  padding: 6px;
}

.sortTypeAndTemplate-picker {
  .vux-popup-dialog {
    z-index: 600;
  }

  .sortTypeAndTemplate-picker-popup {
    display: flex;
    flex-direction: column;
    background-color: $component-background;
    width: 100%;
    height: 100%;
  }
}

.sortTypeAndTemplate {
  height: 100%;
  overflow-y: scroll;
}
</style>
