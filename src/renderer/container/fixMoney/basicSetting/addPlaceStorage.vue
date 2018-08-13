<template>
    <div style="height:100%">
        <ZingHead title="编辑" :isComeBack="false" @doSome="close()">
        </ZingHead>
        <div class="PlaceStorage" :data="PlaceStorage">
            <group label-width="6em" label-margin-right="2em" class="placestorage-child">
                <x-input title="代码" v-model="PlaceStorage.assetCode" class="assetCode" placeholder="001." :readonly="isRead"></x-input>
                <x-input title="名称 " placeholder="请输入名称" class="assetName" v-model="PlaceStorage.assetName" :readonly="isRead">
                </x-input>
            </group>
            <flexbox :gutter="0" class="main-footer">
                <flexbox-item>
                    <x-button style="background-color: #40affc;" type="primary" @click.native="deleteItem">取消</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="submit">保存</x-button>
                </flexbox-item>
            </flexbox>
            <!-- <confirm v-model="isShow" :title="'提示'" @on-cancel="onCancel" @on-confirm="onConfirm" class="palce-comfirm">
                <p style="text-align:center;padding-top:15px;">确定删除吗？</p>
            </confirm> -->
        </div>
    </div>
</template>
<script>
import { Group, XInput, Flexbox, FlexboxItem, XButton } from "vux";
import ZingHead from "components/zingHead/ZingHead.vue";
import { Z_IsEmpty20 } from "@/utils/fn";
export default {
  components: {
    ZingHead,
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton
  },
  data() {
    return {
      isShow: false, // 提示框是否显示
      PlaceStorage: {},
      paramType: {},
      isRead: false
    };
  },
  created() {
    let vm = this;
    vm.paramType = vm.$route.query.item;
    vm.PlaceStorage.assetCode = vm.paramType.code;
    vm.PlaceStorage.assetName = vm.paramType.name;
    let checkAssetStatus = this.checkUseStatus()
    if (checkAssetStatus) {
        vm.isRead = true
    }
  },
  methods: {
    // 检查资产类别是否使用
    checkUseStatus() {
        let vm = this
        vm.$http.post(
              "/zingbiz/fixedAssets/configuration/checkStorePlaceConfigurationUsing",
              { id: vm.paramType.id })
            .then(res => {
              if (res.data.success) {
                   let checkAssetUseStatus = res.data.data.hasUsed
                   return checkAssetUseStatus
              }
            })
    },
    // 删除按钮
    deleteItem() {
      this.$router.push({
            path: "placeStorage",
            query: {}
        });
    },
    close() {
      this.$router.go(-1);
    },
    //保存事件
    submit() {
      let vm = this;
      let url = "/zingbiz/fixedAssets/configuration/editStorePlaceConfiguration";
      // 代码验证（①子集范围001-999；②输入代码与父级代码一致；③ 验证重复输入）
      let paraLenght = vm.paramType.code.split(".").length;
      let currParaLength = vm.PlaceStorage.assetCode.split(".").length;
      //获取父级id数组
      let idCode = vm.paramType.code.split(".").slice(0, paraLenght);
      //获取输入的父级id数组
      let addCode = vm.PlaceStorage.assetCode
        .split(".")
        .slice(0, currParaLength);
          // 获取输入的子集编码
        let childCode = vm.PlaceStorage.assetCode.split(".")[
          currParaLength - 1
        ];
      if (currParaLength === paraLenght) {
        if (idCode[0].toString() !== addCode[0].toString()) {
            this.$vux.toast.text("父级必须一致");
            return;
        } else {
          if (/^(?!0{2})\d{2}$/.test(childCode)) {
            return;
          } else {
            this.$vux.toast.text("子集编码需在001-999之间");
          }
        }
      } else {
        this.$vux.toast.text("请输入正确的代码格式");
      }
      if (Z_IsEmpty20(vm.PlaceStorage.assetName)) {
        vm.$vux.toast.text("请输入资产类别名称");
      }
      let param = {
          id:vm.paramType.id,
        code: vm.PlaceStorage.assetCode,
        name: vm.PlaceStorage.assetName
      };
      this.$http.post(url, param).then(res => {
        if (res.data.success) {
          vm.$vux.toast.text(res.data.mgs);
          this.$router.push({
            path: "placeStorage",
            query: {}
          });
        } else {
          vm.$vux.toast.text(res.data.mgs);
        }
      });
    }
  }
};
</script>
<style>
.PlaceStorage {
  height: 100%;
}
.PlaceStorage .weui-cell {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
}
.placestorage-child {
  height: calc(100%-94px);
}
.PlaceStorage .assetCode .weui-cell__hd:before,
.PlaceStorage .assetName .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 50px;
  color: rgba(255, 128, 0, 1) !important;
}
.weui-dialog__btn_primary {
  color: #ea7e26 !important;
}
.palce-comfirm .weui-dialog__btn_default {
  border-right: 1px solid #b2b2b27a;
}
.palce-comfirm .weui-dialog__ft {
  border-top: 1px solid #b2b2b27a;
}
</style>
