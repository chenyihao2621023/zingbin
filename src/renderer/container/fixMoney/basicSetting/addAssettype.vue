<template>
    <div class="addAssetType">
        <ZingHead :title="assetTitle" :isComeBack="false" @doSome="close()">
        </ZingHead>
        <div class="assetTypeData" style="overflow-y:scroll; height:100%" :data="assetTypeData">
            <div class="asset-group">
                <group label-width="6em" label-margin-right="2em">
                    <x-input title="代码" v-model="assetTypeData.assetCode" class="code" placeholder="请输入代码（数字）" :readonly="isRead"></x-input>
                    <x-input title="名称 " placeholder="请输入资产类别名称" class="code" v-model="assetTypeData.assetName" :readonly="isRead">
                    </x-input>
                    <x-input title="使用年限" v-model="assetTypeData.workingYears" placeholder="" keyboard="number" :is-type="validateService"></x-input>
                    <div>
                        <div style="width:98%">
                            <x-input title="净残值率 " placeholder="10.00" v-model="assetTypeData.residualRate" keyboard="number" :is-type="validateSalvage" style="float:left; width:96%">
                            </x-input>
                        </div>
                        <div style="padding-top:7px;">
                            <span>%</span>
                        </div>
                    </div>
                    <x-input v-model="assetTypeData.measurementUnits" style="display:none"></x-input>
                    <x-input title="计量单位 " placeholder="请选择计量单位" v-model="assetTypeData.measurementUnitsName" disabled @click.native="onClickunit">
                    </x-input>
                    <selector title="预设折旧方法" v-model="assetTypeData.defaultDepreciationMethod" :options="depreciatmentList"></selector>
                    <!-- <x-input title="预设折旧方法" v-model="assetTypeData.defaultDepreciationMethod" placeholder="平均年限法（基于入账原值和）"></x-input> -->
                    <x-input title="固定资产科目" v-model="assetTypeData.fixedAssetsSubjectName" placeholder="请选择固定资产科目" disabled @click.native="onClickassetSubject"> </x-input>
                    <x-input v-model="assetTypeData.fixedAssetsSubjectCode" style="display:none"></x-input>
                </group>
                <group label-width="6em" label-margin-right="2em">
                    <x-input title="累计折旧科目" v-model="assetTypeData.sumDepreciationSubjectName" placeholder="请选择累计折旧科目" disabled @click.native="onClickdepreciatSubject"></x-input>
                    <x-input v-model="assetTypeData.sumDepreciationSubjectCode" style="display:none"></x-input>
                    <x-input title="减值准备科目" v-model="assetTypeData.decreaseAllowanceSubjectName" placeholder="请选择减值准备科目" disabled @click.native="onClickmuiltSub"></x-input>
                    <x-input v-model="assetTypeData.decreaseAllowanceSubjectCode" style="display:none"></x-input>
                    <x-input title="卡片编码名称" v-model="assetTypeData.classCodePrefix" placeholder="请输入卡片编码名称，仅支持英文" :is-type="validateCodeRule"></x-input>
                    <checklist :label-position="labelPosition" required :max="1" :options="deprecitaList" v-model="assetTypeData.howToDepreciate" @on-change="clickChecklist"></checklist>
                </group>
            </div>
            <flexbox :gutter="0" class="main-footer" v-if="isShow">
                <flexbox-item>
                    <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="submit">确定提交</x-button>
                </flexbox-item>
            </flexbox>
            <flexbox :gutter="0" class="main-footer" v-else>
                <flexbox-item>
                    <x-button style="background-color: #40affc;" type="primary" @click.native="deleteItem">取消</x-button>
                </flexbox-item>
                <flexbox-item>
                    <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="updateAsset">保存</x-button>
                </flexbox-item>
            </flexbox>
            <!-- <confirm v-model="isconfirm" :title="'提示'" @on-cancel="onCancel" @on-confirm="onConfirm" class="palce-comfirm">
                <p style="text-align:center;padding-top:15px;">确定删除吗？</p>
            </confirm> -->
        </div>
        <subject-picker :showPicker="showPicker" :multipleMode="multiMode" :parentSubjectSelectable="true" :showDesc="false" @picked="onPicked" @abort="onPickAbort"></subject-picker>
        <popupUnit :showPopup="unitPopup" @backClick="clickBack" @changeCheck="changeCheck"></popupUnit>
    </div>
</template>
<script>
import {
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  XButton,
  Checklist,
  Cell,
  Selector,
  Confirm
} from "vux";
// import Axios from 'axios'
import popupUnit from "../dailyTreatment/selectorPopup/popupUnit";
import SubjectPicker from "components/subjectpicker/SubjectPicker.vue";
import ZingHead from "components/zingHead/ZingHead.vue";
import { Z_IsEmpty20 } from "@/utils/fn";
export default {
  components: {
    ZingHead,
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    Checklist,
    Cell,
    Confirm,
    popupUnit,
    Selector,
    SubjectPicker
  },
  data() {
    return {
      assetTypeData: {},
      showPicker: false, //科目选择
      multiMode: false, // 科目单选、多选
      validateSalvage: function(value) {
        return {
          valid: /^-?\d+\.?\d{0,2}$/.test(value),
          msg: "请输入两小数"
        };
      },
      validateService: function(value) {
        return {
          valid: /^\d+$/.test(value),
          msg: "请输入数字"
        };
      },
      validateCodeRule: function(value) {
        return {
          valid: /^[A-Za-z]+$/.test(value),
          msg: "只能输入英文"
        };
      },
      assetTitle: "",
      unitPopup: false,
      isShow: true,
      isRead: false,
      isconfirm: false,
      deprecitaList: [
        {
          key: "condition",
          value: "由使用状态决定是否提折旧"
        },
        {
          key: "all",
          value: "不管使用状态如何一定提折旧"
        },
        {
          key: "none",
          value: "不管使用状态如何一定不提折旧"
        }
      ],
      depreciatmentList: [
        {
          key: "pingjun-nianxian-a",
          value: "平均年限法（基于入账原值和入账预计使用期间）"
        },
        {
          key: "pingjun-nianxian-b",
          value: "平均年限法（基于入账净值和入账剩余使用期间）"
        },
        { key: "nianshu-zhonghe", value: "年数总和法" },
        {
          key: "shuangbei-yue-a",
          value: "双倍余额递减法（按年折旧率和年初净值计提）"
        },
        {
          key: "shuangbei-yue-b",
          value: "双倍余额递减法（按月折旧率和月初净值计提）"
        },
        { key: "dongtai-pingjunnian", value: "动态平均年限法" },
        {
          key: "dongtai-shuangbeiyu-a",
          value: "动态双倍余额递减法（按年折旧率和年初净值计提）"
        },
        {
          key: "dongtai-shuangbeiyu-b",
          value: "动态双倍余额递减法（按月折旧率和月初净值计提）"
        },
        { key: "dongtai-nianshu", value: "动态年数总和法" },
        { key: "gongzuoliang", value: "工作量法" }
      ],
      assetItem: [],
      paramType: {}
      //   CodeRule:
      //     "说明：请将编码规则设置为前缀'+'000,后面'0'的个数可根据该类固定资产大约的个数确定，例如：办公设备类固定资产，在1000个以内，设置为'BGSB000',系统自动从BGSB0001开始编码，自动累计，知道BGSB999"
    };
  },
  created() {
    let vm = this;
    vm.assetTypeData.howToDepreciate = ["condition"];
    vm.assetTypeData.residualRate = "10.00";
    vm.assetTypeData.workingYears = 6;
    vm.paramType = "";
    vm.paramType = vm.$route.query;
    vm.assetTypeData.assetCode = vm.paramType.code;
    if (vm.paramType.type === "add") {
      vm.assetTitle = "新增";
    } else {
      vm.isShow = false;
      vm.assetTitle = "编辑";
    //   vm.getAllAssetsClassConfiguration();
      let checkStatus = vm.checkUseStatus();
      if (checkStatus) {
        vm.isRead = true;
      }
    }
  },
  methods: {
    //获取资产类别
    getAllAssetsClassConfiguration() {
      let vm = this;
      let assetItemData = {};
      let checkData = [];
      vm.$http
        .get(
          "/zingbiz/fixedAssets/configuration/getAllAssetsClassConfiguration",
          {}
        )
        .then(res => {
          let assetData = res.data.data;
          assetData.forEach(item => {
            if (vm.paramType.id === item.id) {
              assetItemData = item;
            }
          });
          if (assetItemData.howToDepreciate === "condition") {
            checkData.push("condition");
          } else if (assetItemData.howToDepreciate === "all") {
            checkData.push("all");
          } else {
            checkData.push("none");
          }
          if (vm.paramType.code === assetItemData.code) {
            vm.assetTypeData = {
              assetCode: vm.paramType.code,
              assetName: assetItemData.name,
              workingYears: assetItemData.workingYears,
              residualRate: assetItemData.residualRate,
              measurementUnits: assetItemData.measurementUnits,
              defaultDepreciationMethod:
                assetItemData.defaultDepreciationMethod,
              fixedAssetsSubjectCode: assetItemData.fixedAssetsSubjectCode,
              fixedAssetsSubjectName: assetItemData.fixedAssetsSubjectName,
              sumDepreciationSubjectCode:
                assetItemData.sumDepreciationSubjectCode,
              sumDepreciationSubjectName:
                assetItemData.sumDepreciationSubjectName,
              decreaseAllowanceSubjectCode:
                assetItemData.decreaseAllowanceSubjectCode,
              decreaseAllowanceSubjectName:
                assetItemData.decreaseAllowanceSubjectName,
              classCodePrefix: assetItemData.classCodePrefix,
              howToDepreciate: checkData
            };
          } else {
            assetItemData.children.forEach(element => {
              console.info(element);
              vm.assetTypeData = {
                assetCode: element.code,
                assetName: element.name,
                workingYears: element.workingYears,
                residualRate: element.residualRate,
                measurementUnits: element.measurementUnits,
                defaultDepreciationMethod: element.defaultDepreciationMethod,
                fixedAssetsSubjectCode: element.fixedAssetsSubjectCode,
                fixedAssetsSubjectName: element.fixedAssetsSubjectName,
                sumDepreciationSubjectCode: element.sumDepreciationSubjectCode,
                sumDepreciationSubjectName: element.sumDepreciationSubjectName,
                decreaseAllowanceSubjectCode:
                  element.decreaseAllowanceSubjectCode,
                decreaseAllowanceSubjectName:
                  element.decreaseAllowanceSubjectName,
                classCodePrefix: element.classCodePrefix,
                howToDepreciate: checkData
              };
            });
          }
        });
    },
    onPicked(item) {
      let vm = this;
      if (vm.subjectFlag === "assetSubject") {
        vm.assetTypeData.fixedAssetsSubjectCode = item.fileId;
        vm.assetTypeData.fixedAssetsSubjectName = item.text;
      }
      if (vm.subjectFlag === "depreciatSubject") {
        vm.assetTypeData.sumDepreciationSubjectCode = item.fileId;
        vm.assetTypeData.sumDepreciationSubjectName = item.text;
      }
      if (vm.subjectFlag === "singleSub") {
        vm.assetTypeData.decreaseAllowanceSubjectCode = item.fileId;
        vm.assetTypeData.decreaseAllowanceSubjectName = item.text;
      }
      vm.showPicker = false;
    },
    onPickAbort() {
      this.showPicker = false;
    },
    //固定资产科目
    onClickassetSubject() {
      this.showPicker = true;
      this.subjectFlag = "assetSubject";
    },
    //累计折旧科目
    onClickdepreciatSubject() {
      this.showPicker = true;
      this.subjectFlag = "depreciatSubject";
    },
    //多个科目
    onClickmuiltSub() {
      this.showPicker = true;
      this.subjectFlag = "singleSub";
    },
    // 删除按钮
    deleteItem() {
      this.$router.push({
        path: "assetType",
        query: {}
      });
    },
    // 检查资产类别是否使用
    checkUseStatus() {
      let vm = this;
      vm.$http
        .post(
          "/zingbiz/fixedAssets/configuration/checkAssetsClassConfigurationUsing",
          { id: vm.paramType.id }
        )
        .then(res => {
          if (res.data.success) {
                let checkData = [];
                let assetItemData = res.data.data.data
                if (assetItemData.howToDepreciate === "condition") {
                    checkData.push("condition");
                } else if (assetItemData.howToDepreciate === "all") {
                    checkData.push("all");
                } else {
                    checkData.push("none");
                }
                let checkAssetUseStatus = res.data.data.hasUsed;
                vm.assetTypeData = {
                assetCode: vm.paramType.code,
                assetName: assetItemData.name,
                workingYears: assetItemData.workingYears,
                residualRate: assetItemData.residualRate,
                measurementUnits: assetItemData.measurementUnits,
                defaultDepreciationMethod:
                assetItemData.defaultDepreciationMethod,
                fixedAssetsSubjectCode: assetItemData.fixedAssetsSubjectCode,
                fixedAssetsSubjectName: assetItemData.fixedAssetsSubjectName,
                sumDepreciationSubjectCode:
                assetItemData.sumDepreciationSubjectCode,
                sumDepreciationSubjectName:
                assetItemData.sumDepreciationSubjectName,
                decreaseAllowanceSubjectCode:
                assetItemData.decreaseAllowanceSubjectCode,
                decreaseAllowanceSubjectName:
                assetItemData.decreaseAllowanceSubjectName,
                classCodePrefix: assetItemData.classCodePrefix,
                howToDepreciate: checkData
            };
            return checkAssetUseStatus;
          }
        });
    },
    // 修改
    updateAsset() {
        let vm = this;
        let paraLenght = vm.paramType.code.split(".").length;
        let currParaLength = vm.assetTypeData.assetCode.split(".").length;
        //获取父级id数组
        let idCode = vm.paramType.code.split(".").slice(0, paraLenght);
        //获取输入的父级id数组
        let addCode = vm.assetTypeData.assetCode
            .split(".")
            .slice(0, currParaLength);
          // 获取输入的子集编码
        let childCode = vm.assetTypeData.assetCode.split(".")[currParaLength - 1];
        if (currParaLength === paraLenght) {
            // console.info(idCode[0].toString())
            // console.info(addCode[0].toString())
            // console.info(idCode[0].toString() === addCode[0].toString())
            if (idCode[0].toString() !== addCode[0].toString()) {
                this.$vux.toast.text("父级必须一致");
                return;
            } else {
            if (/^(?!0{3})\d{3}$/.test(childCode)) {
                console.info(vm.assetTypeData.assetCode)
            } else {
                this.$vux.toast.text("子集编码需在001-999之间");
                return;
            }
            }
        } else {
            this.$vux.toast.text("请输入正确的代码格式");
            return;
        }
        if (Z_IsEmpty20(vm.assetTypeData.assetCode)) {
            vm.$vux.toast.text("请输入资产类别编码");
            return;
        }
        if (Z_IsEmpty20(vm.assetTypeData.assetName)) {
            vm.$vux.toast.text("请输入资产类别名称");
            return;
        }
      let url =
        "/zingbiz/fixedAssets/configuration/editAssetsClassConfiguration";
      vm.addAssetData(url, {}).then(res => {
        if (res.data.success) {
          vm.$vux.toast.text(res.data.mgs);
          this.$router.push({
            path: "assetType",
            query: {}
          });
        } else {
          vm.$vux.toast.text(res.data.mgs);
        }
      });
    },
    // 顶部返回事件
    close() {
      this.$router.go(-1);
    },
    // clickBack() {
    //   this.unitPopup = false;
    // },
    // 选择计量单位popup显示
    onClickunit() {
      let vm = this;
      vm.unitPopup = true;
    },
    // chexkList 选项值改变触发事件
    clickChecklist(val, label) {
      let vm = this;
      vm.assetTypeData.howToDepreciate = val;
    },
    //计量单位
    changeCheck(val, label) {
      let vm = this;
      vm.assetTypeData.measurementUnitsName = label.toString();
      vm.assetTypeData.measurementUnits = val[0];
      vm.unitPopup = false;
    },
    // 新增、编辑接口
    addAssetData(url, parentId) {
      let vm = this;
      let workingYears = vm.assetTypeData.workingYears
        ? { workingYears: vm.assetTypeData.workingYears }
        : {};
      let residualRate = vm.assetTypeData.residualRate
        ? { residualRate: vm.assetTypeData.residualRate }
        : {};
      let measurementUnits = vm.assetTypeData.measurementUnits
        ? { measurementUnits: vm.assetTypeData.measurementUnits }
        : {};
      let defaultDepreciationMethod = vm.assetTypeData.defaultDepreciationMethod
        ? {
            defaultDepreciationMethod:
              vm.assetTypeData.defaultDepreciationMethod
          }
        : {};
      let fixedAssetsSubjectCode = vm.assetTypeData.fixedAssetsSubjectCode
        ? { fixedAssetsSubjectCode: vm.assetTypeData.fixedAssetsSubjectCode }
        : {};
      let sumDepreciationSubjectCode = vm.assetTypeData
        .sumDepreciationSubjectCode
        ? {
            sumDepreciationSubjectCode:
              vm.assetTypeData.sumDepreciationSubjectCode
          }
        : {};
      let decreaseAllowanceSubjectCode = vm.assetTypeData
        .decreaseAllowanceSubjectCode
        ? {
            decreaseAllowanceSubjectCode:
              vm.assetTypeData.decreaseAllowanceSubjectCode
          }
        : {};
      let classCodePrefix = vm.assetTypeData.classCodePrefix
        ? { classCodePrefix: vm.assetTypeData.classCodePrefix }
        : {};
      let howToDepreciate = vm.assetTypeData.howToDepreciate
        ? { howToDepreciate: vm.assetTypeData.howToDepreciate[0] }
        : {};
      let id = vm.paramType.id ? { id: vm.paramType.id } : {};

      let param = {
        code: vm.assetTypeData.assetCode,
        name: vm.assetTypeData.assetName
      };
      param = Object.assign(
        {},
        id,
        parentId,
        param,
        workingYears,
        residualRate,
        measurementUnits,
        defaultDepreciationMethod,
        fixedAssetsSubjectCode,
        sumDepreciationSubjectCode,
        decreaseAllowanceSubjectCode,
        classCodePrefix,
        howToDepreciate
      );
      return vm.$http.post(url, param);
    },
    //确认提交事件
    submit() {
      let vm = this;
      if (vm.paramType.leave) {
        if (/^(?!0{3})\d{3}$/.test(vm.assetTypeData.assetCode)) {
          if (!Z_IsEmpty20(vm.assetItem)) {
            vm.assetItem.forEach(item => {
              if (vm.assetTypeData.assetCode === item.code) {
                this.$vux.toast.text("不可以重复添加");
                return;
              } else {
                console.info(vm.assetTypeData.assetCode);
                return;
              }
            });
          }
        } else {
          this.$vux.toast.text("请输入正确的代码格式");
          return;
        }
      } else {
         // 代码验证（①子集范围001-999；②输入代码与父级代码一致；③ 验证重复输入）
            let currParaLength = vm.assetTypeData.assetCode.split(".").length;
            let paraLenght = vm.paramType.code.split(".").length;
            //获取父级id数组
            let idCode = vm.paramType.code.split(".").slice(0, paraLenght);
            //获取输入的父级id数组
            let addCode = vm.assetTypeData.assetCode
                .split(".")
                .slice(0, currParaLength - 1);
            // 获取输入的子集编码
            let childCode = vm.assetTypeData.assetCode.split(".")[currParaLength - 1];
            // 判断输入的父级是否与数据父级是否一致
            if (paraLenght + 1 === currParaLength) {
                // 进行子集范围001-999验证
                if (/^(?!0{3})\d{3}$/.test(childCode)) {
                //针对输入的父级
                if (idCode.toString() === addCode.toString()) {
                    if (!Z_IsEmpty20(vm.assetItem.children)) {
                    vm.assetItem.children.forEach(item => {
                        if (vm.assetTypeData.assetCode === item.code) {
                        this.$vux.toast.text("不可以重复添加");
                        return;
                        } else {
                        console.info(vm.assetTypeData.assetCode);
                        }
                    });
                    }
                } else {
                    vm.$vux.toast.text("父级编码必须以" + vm.paramType.code);
                }
                } else {
                vm.$vux.toast.text("子集编码需在001-999之间");
                }
            } else {
                vm.$vux.toast.text("代码格式不正确");
            }
      }
      if (Z_IsEmpty20(vm.assetTypeData.assetName)) {
        vm.$vux.toast.text("请输入资产类别名称");
        return;
      }
      let url =
        "/zingbiz/fixedAssets/configuration/addAssetsClassConfiguration";
      let parentId = vm.paramType.id ? { parentId: vm.paramType.id } : {};
      vm.addAssetData(url, parentId).then(res => {
        if (res.data.success) {
          vm.$vux.toast.text(res.data.mgs);
          this.$router.push({
            path: "assetType",
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
<style scoped>
.addAssetType {
  height: 100%;
}
.asset-group {
  height: calc(100%-94px);
}
.addAssetType .weui-cell {
  font-family: Arial;
  font-size: 16px !important;
}
.palce-comfirm .weui-dialog__btn_default {
  border-right: 1px solid #b2b2b27a;
}
.palce-comfirm .weui-dialog__ft {
  border-top: 1px solid #b2b2b27a;
}
</style>
<style>
.assetTypeData .code .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 50px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>



