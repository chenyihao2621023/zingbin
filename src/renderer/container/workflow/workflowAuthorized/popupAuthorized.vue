<!--节点属性页面-->
<template>
  <!-- <div class="popupDate-picker">
    <popup v-model="showPopupDate" height="100%" width="100%" position="right" :popup-style="{'overflow': 'hidden'}">
      <div class="popupDate-picker-popup"> -->
        <div class="root-div">
          <zing-head :title="certificateTitle" :isComeBack="false" @doSome="backClick"></zing-head>
          <div class="scolley-div" style="overflow-y: scroll;">
            <group label-width="8em" class="main-from">
              <checklist required :options="commonList" v-model="checkItem" @on-change="change"></checklist>
            </group>
          </div>
          <group>
            <flexbox :gutter="0" class="main-footer">
              <flexbox-item>
                <x-button class="btn-save" type="primary" @click.native="submit">提交</x-button>
              </flexbox-item>
              <flexbox-item>
                <x-button @click.native="cancle">取消</x-button>
              </flexbox-item>
            </flexbox>
          </group>

        </div>
      <!-- </div>
    </popup>
  </div> -->
</template>

<script>
import {
  XTextarea,
  Popup,
  XInput,
  Group,
  XButton,
  Flexbox,
  FlexboxItem,
  Selector,
  Checklist
} from "vux";
import ZingHead from "@/components/zingHead/ZingHead";
import { O_RDONLY } from "constants";
export default {
  data() {
    props: ['roleCode']
    return {
      screenHeight: 0, //页面高度
      checkItem: [],
      commonList:[],
      roleCode:'',
      checkCategoryId:[],
      certificateTitle:'模板'
    };
  },
  components: {
    Selector,
    Group,
    XTextarea,
    XInput,
    XButton,
    Flexbox,
    FlexboxItem,
    ZingHead,
    Popup,
    Checklist
  },
  created() {
    let vm = this;
    vm.roleCode = vm.$route.query.roleCode;
    vm.getAllAuthoridData()
    vm.getcategoryRole()
    // vm.setAuthoridData()
  },
  // props: {
  //   showPopupDate: {
  //     type: Boolean,
  //     default: function() {
  //       return false;
  //     }
  //   },
  //   // checkItem: {
  //   //   type: Array,
  //   //   default: function() {
  //   //     return [];
  //   //   }
  //   // },
  //   commonList: {
  //     type: Array,
  //     default: function() {
  //       return false;
  //     }
  //   },
  //   certificateTitle: {
  //     type: String,
  //     default: function() {
  //       return "";
  //     }
  //   }
  // },
  methods: {
    submit(data) {
      this.setAuthoridData();
      // this.$emit("submitClick", data);
    },
    cancle(data) {
      this.$router.back(-1)
      console.info("xujiadnsbf");
      // this.$emit("cancleClick");
    },
    backClick() {
      this.$router.back(-1)
      // this.$emit("backClick");
    },
    change(val, label) {
       let vm = this;
      vm.checkCategoryId = val;
      console.log("change", val, label);
      // this.$emit("change", val, label);
    },
    // 查询所有的模板
    getAllAuthoridData() {
      let vm = this;
      let url = "/zingbiz/workflow/helper/getDataForAllTemplate";
      let params = {};
      vm.$http.post(url, params).then(res => {
        console.info(res.data.data.data);
        if (res.data.data.total > 0) {
          vm.getData = res.data.data.data;
          vm.getData.forEach(function(item) {
            vm.commonList.push({
              key: item.templateId,
              value: item.templateName
            });
          });
          console.info(vm.certifiData);
        } else {
          vm.$vux.toast.text("没有模板数据",'top');
        }
      });
    },
     // 设置模板授权
    setAuthoridData() {
      let vm = this;
      let temp = "";
      let url = "/zingbiz/workflow/helper/setCategoryPrivilege";
      if (vm.checkCategoryId.length === 1) {
        vm.categoryIds = vm.checkCategoryId + "";
      } else {
        vm.checkCategoryId.forEach(function(item) {
          temp = item + ",";
          vm.categoryIds += temp;
        });
      }
      let params = {
        roleCode: vm.roleCode,
        categoryId: vm.categoryIds
      };
      console.info(params);
      this.$http.post(url, params).then(res => {
        console.info(res.data);
        if (res.data.success === true) {
          vm.$vux.toast.text(res.data.mgs,'top');
          this.$router.push({
            path: "workflowAuthorized"
          })
        }
      });
    },
    getcategoryRole() {
      let vm = this;
      let mockDate = [];
      let url = "/zingbiz/workflow/helper/getWX_categoryPrivilegeByRoleCode";
      let params = {
        roleCode:vm.roleCode
        // 62471963100001  62471963100002
        // roleCode: 52589658100001
      };
      vm.$http.post(url, params).then(res => {
        if (res.data.success === true) {
          vm.getData = res.data.data;
          if (vm.getData != []) {
            vm.getData.forEach(function(item) {
              // mockDate.push({
              //   key: item.templateId,
              //   value: item.templateName
              // });
              console.log("选中数据", item);
              // vm.checkItem.push(item);
              vm.checkItem.push(item.templateId);
              // vm.checkItem.push(item.templateName);
            });
          }
        } else {
          console.info("");
        }
      });
    }
  }
};
</script>
<style lang= 'less' scoped>
.scolley-div {
  /deep/ .weui-cell {
    font-size: 16px;
  }
}
.main-from {
  height: 450px;
  /* height:auto!important; */
}
.list-wrapper {
  overflow: inherit;
}
.main-footer {
  padding: 15px;
}
</style>

