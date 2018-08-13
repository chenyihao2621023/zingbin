<template>
    <div style="font-size:14px;height:100%">
        <popup v-model="showPopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%">
            <div class="root-div">
                <ZingHead :title="'选择计量单位'" :isComeBack="false" @doSome="backClick">
                </ZingHead>
                <div class="check-list" v-for="(item,index) in unitData" :key="index">
                    <group>
                        <cell :title="item.name" is-link :border-intent="false" :arrow-direction="showcheckList ? 'up' : 'down'" @click.native="showcheckList = !showcheckList"></cell>
                        <!-- <div v-for="(unititem,index) in item.child" :key="index"> -->
                            <checklist :options="getunit(item.child)" @on-change="change" :max="1"></checklist>
                        <!-- </div> -->
                    </group>
                </div>
                <!-- <group>
                            <cell :title="'电脑配件数量组'" is-link :border-intent="false" :arrow-direction="showcheckList2 ? 'up' : 'down'" @click.native="showcheckList2 = !showcheckList2"></cell>
                            <template v-if="showcheckList2">
                                <checklist :options="computerGroup" v-model="computerGroupItem" :max="1" @on-change="change"></checklist>
                            </template>
                        </group>
                        <group>
                            <cell :title="'手机数量组'" is-link :border-intent="false" :arrow-direction="showcheckList3 ? 'up' : 'down'" @click.native="showcheckList3 = !showcheckList3"></cell>
                            <template v-if="showcheckList3">
                                <checklist :options="mobileGroup" v-model="mobileGroupItem" :max="1" @on-change="change"></checklist>
                            </template>
                        </group> -->

            </div>
        </popup>
    </div>
</template>
<script>
import { Popup, Checklist, Cell, Group } from "vux";
import ZingHead from "components/zingHead/ZingHead.vue";
export default {
  components: {
    Popup,
    ZingHead,
    Checklist,
    Cell,
    Group
  },
  props: {
    showPopup: {
      type: Boolean,
      default: function() {
        return false;
      }
    }
  },
  data() {
    return {
      unitData: [],
      PrinterGroupItem: "",
      computerGroupItem: "",
      mobileGroupItem: "",
      showcheckList: true,
      demo: false
    };
  },
  created() {
    let vm = this;
    vm.getUnitData();
  },
  methods: {
    getunit(unititem) {
        let unitData = []
        let mockDatas = []
        Object.keys(unititem).forEach((key,value) => {
            mockDatas.push({
              key: unititem[key].measureUnitId,
              value: unititem[key].measureUnitName,
            })
            unitData = [...mockDatas]
          })
            return unitData
    },
    getUnitData() {
      let vm = this;
      let url = "/zingbiz/finance/measureUnit/searchMeasureUnitCollection";
      vm.$http.get(url, { status: "1" }).then(res => {
        if (res.data.success) {
          vm.unitData = res.data.data;
        }
      });
    },
    backClick() {
      this.$emit("backClick");
    },
    change(val, label) {
      this.$emit("changeCheck", val, label);
    }
  }
};
</script>
<style scoped>
.check-list.weui-cells {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
}
.popupDate-picker-popup .weui-cells {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
}
.check-list {
  height: 100%;
}
</style>


