<!--模板-->
<template>
    <div v-transfer-dom>
        <popup v-model="showMould" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
          <div class="typeWrap">
            <zing-head :isShowQuery="false" title="选择模板" :isComeBack="false" @doSome="backToAddManage">
                <!--<div slot="left"></div>-->
            </zing-head>
            <div class="content">
                <div class="variable">
                    <checklist ref="checklist" :label-position="labelPosition" :options="commonList" v-model="checklistMould" :max="1" @on-change="change"></checklist>
                </div>
                <div class="bottom">
                    <div>
                        <x-button class="subject-picker-button" type="primary" @click.native="checkSelected">选择</x-button>
                    </div>
                </div>
            </div>
          </div>
        </popup>
    </div>
</template>
<script>
import { Checklist, XButton, Popup } from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
import _ from "lodash";
import { mapMutations } from "vuex";
export default {
  components: {
    ZingHead,
    Checklist,
    XButton,
    Popup
  },
  props: {
    showMould: {
      // 是否显示
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      labelPosition: "right",
      commonList: [
        
      ],
      fullValues: [],
      checklistMould: [] //选中
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    ...mapMutations({
      setMode: "SET_MODE"
    }),
    checkSelected() {
      this.fullValues = this.$refs.checklist.getFullValue();
      this.$emit("checkSelectedMould", this.fullValues);
    },
    backToAddManage() {
      this.$emit("abort");
    },
    initData() {
      let url =
        "/ZingMH/ZDesk/projectManageBoard/mater/loadBoardPMTByUser.action";
      let params = { tag: "projectManage" };
      params.PMT = true;

      this.$http
        .get(url, { params: params })
        .then(res => {
          let data = res.data.data[0].data || [];
          let commonList = this.commonList;
          _.each(data, v => {
            commonList.push({ key: v.boardId, value: v.title });
          });
        })
        .catch(err => {
          this.$message({ message: "模板请求失败！", type: "error" });
        });
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.typeWrap {
    height: 100%;

    .content {
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        background-color: white;
        height: calc(100% -50px) !important;
    }

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
</style>
