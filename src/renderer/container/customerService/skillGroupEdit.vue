<template>
    <div class="popupDate-picker">
        <popup v-model="showPopupDate" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
            <div class="popupDate-picker-popup">
                <div class="root-div">
                    <ZingHead :title="modelTitle" :isComeBack="false" @doSome="backClick">
                    </ZingHead>
                    <div class="scolley-div" style="overflow-y:scroll;" :data="getSkillData">
                        <group label-align="left" label-width="7.5em" class="main-from" label="16px">
                            <selector title="技能组类别: " :options="skType" v-model="getSkillData.skType" required placeholder="">
                            </selector>
                            <x-input title="技能组标识: " v-model="getSkillData.skName" placeholder="" required>
                            </x-input>
                            <x-input title="技能组名称:" v-model="getSkillData.skId" required placeholder=""></x-input>
                            <br>
                            <check-icon :value.sync="getSkillData.mustSkill"> 是否为默认技能组</check-icon>
                        </group>
                        <group>
                            <flexbox :gutter="0" class="main-footer">
                                <flexbox-item>
                                    <x-button class="btn-save" type="primary" @click.native="submit(getSkillData)">提交</x-button>
                                </flexbox-item>
                                <flexbox-item>
                                    <x-button @click.native="cancle" :gradients="['#FF8000','']">取消</x-button>
                                </flexbox-item>
                            </flexbox>
                        </group>
                    </div>
                </div>
            </div>
        </popup>
    </div>
</template>

<script>
import {
  Group,
  XButton,
  Flexbox,
  FlexboxItem,
  XInput,
  Selector,
  Popup,
  CheckIcon,
  TransferDomDirective as TransferDom
} from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
import GridCard from "@/components/gridcard/GridCard";
export default {
  components: {
    GridCard,
    Popup,
    ZingHead,
    XInput,
    Selector,
    Flexbox,
    FlexboxItem,
    Group,
    XButton,
    CheckIcon
  },
  data() {
    return {
      screenHeight: 0,
      skType: [
        {
          key: "",
          value: "请选择"
        },
        {
          key: "DEFAULT",
          value: "DEFAULT"
        },
        {
          key: "_zdy",
          value: "自定义类别"
        }
      ]
    };
  },
  props: {
    showPopupDate: {
      // 是否显示
      type: Boolean,
      default: function() {
        return false;
      }
    },
    modelTitle: {
      type: String,
      default: function() {
        return "";
      }
    },
    getSkillData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  methods: {
    submit(data) {
      this.$emit("submitClick", data);
    },
    cancle(data) {
      this.$emit("cancleclick");
    },
    backClick() {
      this.$emit("backClick");
    }
  },
  created() {
    // this.initSelData = "TYPE_HR_QJ"
  }
};
</script>
<style lang= 'less' scoped>
.main-from {
  height: 450px;
  /*height:auto!important; */
}
.weui-cell {
  /deep/ label {
    font-size: 16px;
  }
}
.main-footer {
  padding: 15px;
}
</style>
