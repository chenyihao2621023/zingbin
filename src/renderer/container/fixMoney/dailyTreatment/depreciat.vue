<!-- 计提折旧 -->
<template>
    <div style="height:100%">
        <ZingHead title="计提折旧" :isComeBack="false" @doSome="close()">
        </ZingHead>
           <div class="workquery">
              <group label-width="2em" class="list-warp">
                    <div class="workquery-ifo">
                        <span>{{info}}</span>
                    </div>
                  <div class="workquery-ifo">
                        <span>{{infos}}</span>
                    </div>
              </group>
              <flexbox :gutter="0" class="main-footer">
                <flexbox-item>
                    <x-button style="background-color: #40affc;" type="primary" @click.native="cancle">取消</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="toNext">下一步</x-button>
                </flexbox-item>
            </flexbox>
       </div>
    </div>
</template>
<script>
import {
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  XButton,
  Cell
} from "vux";
import ZingHead from "components/zingHead/ZingHead.vue";
export default {
  components: {
    ZingHead,
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    Cell
  },
  data() {
    return {
        info:'如果您的固定资产卡片设置了按工作量法计提折旧，您需要输入本期工作量，如果确认已经正确输入了本期工作量，请安"下一步"继续，否则请安"取消"按钮退出，先输入工作量。',
        infos:'为了合理分摊固定资产在使用中的损耗，应当在期末时按一定的方法对固定资产计提折旧，本指南将自动计算本期各固定资产应踢得折旧额，并编制转账凭证，将折旧额按比例分配到各个费用科目中'
   };
  },
  methods: {
    close() {
      this.$router.go(-1);
    },
    cancle() {
          this.$router.push({
                path: "/fixMoneyMain",
                query: {}
            });
    },
    toNext() {
         this.$router.push({
            path: "depreciationNext",
            query: {
            }
        });
    }
  }
};
</script>
<style scoped>
 .workquery{
   height:100%;
}
 .list-warp {
  height: calc(100%-94px);
}
.cell-left{
    width: 1em;
    float: left;
    padding-left: 10px;
    padding-top: 5%;
}
 .workquery .weui-cell{
     font-family: Arial;
     font-size: 14px !important;
 }

.weui-cell__ft {
    text-align: left !important;
}
.workquery-ifo{
    padding:13px;
    color: #101010;
     font-size: 14px
}
</style>
