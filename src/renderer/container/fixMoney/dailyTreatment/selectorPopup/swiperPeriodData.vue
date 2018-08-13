<template>
    <div style="height:100%">
            <div class="assetData" style="overflow-y:scroll;">
                <group label-width="8em" label-margin-right="2em">
                    <cell title="当期数据" ></cell>
                    <x-input placeholder="2010年11期" v-model="periodData.searchData" title="当期查询期间 " :readonly="TabreadOnly"></x-input>
                    <x-input title="当前已使用期间数" v-model="periodData.usedPeriod" placeholder="19" :readonly="TabreadOnly"></x-input>
                    <x-input title="当前原值" placeholder="6,500.00" v-model="periodData.currentValue" :readonly="TabreadOnly"></x-input>
                    <x-input title="当期累计折旧" v-model="periodData.depretciaCount" placeholder="1,225.00" :readonly="TabreadOnly"></x-input>
                    <x-input title="当期净值" v-model="periodData.countNumber" placeholder="2,275.00" :readonly="TabreadOnly"></x-input>
                </group>
            </div>
            <flexbox class="inner" v-if="isTabShow">
                <flexbox-item>
                    <x-button class="review" @click.native="checkout">反审核</x-button>
                </flexbox-item>
            </flexbox>
        </div>
</template>
<script>
import { Group, XInput, Flexbox, FlexboxItem, XButton, Cell } from "vux";
export default {
  components: {
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    Cell
  },
  props: {
    periodData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    isTabShow: {
      type: String,
      default: function() {
        return "";
      }
    },
    TabreadOnly: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    checkout() {
      console.info("");
    },
  }
};
</script>
<style scoped>
.assetData {
  height: calc(100%-150px);
}
</style>


