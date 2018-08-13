<template>
    <div style="height:100%">
        <div class="deptAddOther" style="overflow-y:scroll;">
            <group label-width="6em" label-margin-right="2em" v-model="modelType">
                <x-input v-model="deptment.fixedAssetsSubjectId" style="display:none"></x-input>
                <x-input placeholder="请选择科目" title="固定资产科目" class="deptment" :readonly="TabreadOnly" v-model="deptment.fixedAssetsSubjectIdName" @click.native="onClickassetSubject" disabled></x-input>
                <x-input v-model="deptment.depreciationSubjectId" style="display:none"></x-input>
                <x-input placeholder="请选择科目" title="累计折旧科目" class="deptment" :readonly="TabreadOnly" v-model="deptment.depreciationSubjectIdName" @click.native="onClickdepreciatSubject" disabled></x-input>
            </group>
            <group>
                <x-input title="使用部门" class="charges"></x-input>
                <div class="cell-list">
                    <div style="float:left;padding-top:5px;">
                        <check-icon :value.sync="single" type="plain" @click.native="updatecheckSingle">单个部门 </check-icon>
                    </div>
                    <div class="cell-right">
                        <x-input v-model="deptment.department" style="display:none"></x-input>
                        <x-input placeholder="请选择部门" v-model="deptment.departmentName" @click.native="onClick" :readonly="TabreadOnly" disabled></x-input>
                    </div>
                </div>
                <div class="cell-list">
                    <div style="float:left;padding-top:5px;">
                        <check-icon type="plain" :value.sync="multipleDepart" @click.native="updatecheckMulit">多个部门 </check-icon>
                    </div>
                    <div class="cell-right">
                        <cell :value="deptment.MulitdepartmentName" @click.native="onClickmultDept" :readonly="TabreadOnly" disabled placeholder="请选择科目"> </cell>
                        <x-input v-model="deptment.Mulitdepartment" style="display:none"></x-input>
                    </div>
                </div>
            </group>
            <group>
                <x-input title="折旧费用分配" class="deptment" disabled></x-input>
                <div class="cell-list">
                    <div style="float:left;padding-top:5px;">
                        <check-icon :value.sync="singleSub" type="plain" @click.native="updatecheckSub" >单个科目 </check-icon>
                    </div>
                    <div class="cell-right">
                        <x-input v-model="deptment.subjectId" style="display:none"></x-input>
                        <x-input placeholder="请选择科目" v-model="deptment.subjectIdName" @click.native="onClicksingleSub" :readonly="TabreadOnly" disabled></x-input>
                    </div>
                </div>
                <div class="cell-list">
                    <div style="float:left;padding-top:5px;">
                        <check-icon type="plain" :value.sync="multipleSub" @click.native="updatecheckItem"> 多个科目</check-icon>
                    </div>
                    <div class="cell-right">
                        <cell :value="deptment.MulitsubjectIdName" @click.native="onClickmuiltSub" :readonly="TabreadOnly" disabled> </cell>
                        <x-input v-model="deptment.MulitsubjectId" style="display:none"></x-input>
                    </div>
                </div>
            </group>
            <group>
                <x-input v-model="deptment.departAction" style="display:none"></x-input>
                <x-input v-model="deptment.subjectAction" style="display:none"></x-input>
            </group>
        </div>
        <department :showPopup="showDept" :typePath="typePath" @comeback="clickBlack" @submitDept="submitDept"></department>
        <multiSubjectDept :showPopup="showsubject" :typePath="typePath" :departmentList="deptData" @comeback="clickBlack" @submitdepart="submitSubject"></multiSubjectDept>
        <subject-picker :showPicker="showPicker" :multipleMode="multiMode" :parentSubjectSelectable="true" :showDesc="false" @picked="onPicked" @abort="onPickAbort"></subject-picker>
        <!-- 选人组件 -->
        <org-member-picker :initialSelected="initSelectPerson" :multiple="false" :showTab="isAuthRole" :showPicker="showPersonPicker" @picked="onPickDept" @abort="onPickAbortdept"></org-member-picker>
    </div>
</template>
<script>
import multiSubjectDept from "../depement/multiSubjectDept.vue";
import department from "../depement/deptmentInfo";
import SubjectPicker from "components/subjectpicker/SubjectPicker.vue";
import {
  Group,
  XInput,
  Flexbox,
  FlexboxItem,
  XButton,
  CheckIcon,
  XTextarea,
  Cell
} from "vux";
import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
import { Z_IsEmpty20 } from "@/utils/fn";
export default {
  components: {
    Group,
    XInput,
    Flexbox,
    FlexboxItem,
    XButton,
    CheckIcon,
    Cell,
    XTextarea,
    SubjectPicker,
    OrgMemberPicker,
    multiSubjectDept,
    department
  },
  props: {
    deptment: {
      type: Object,
      default: function() {
        return {};
      }
    },
    TabreadOnly: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    single: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    multipleDepart: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    singleSub: {
      type: Boolean,
      default: function() {
        return true;
      }
    },
    multipleSub: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    modelType: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  data() {
    return {
      singleShow: true, //单币别
      multiShow: false, //多币别
      typePath: "",
      multDeptReadOnly: false,
      readOnlySingle: false,
      multsubReadOnly: false,
      readOnlysubSingle: false,
      showPicker: false, //科目选择
      multiMode: false, // 科目单选、多选
      subjectFlag: "",
      initSelectPerson: [],
      isAuthRole: ["org"],
      showPersonPicker: false,
      originData: {},
      showDept: false,
      showsubject: false,
      deptSubItem: [],
      deptData: [],
      deptAction: [],
      subjectInfos:[],
      deptment: {}
    };
  },
  created() {
    this.deptment.MulitsubjectIdName = "请选择科目";
    this.deptment.MulitdepartmentName = "请选择部门";
  },
  methods: {
    //多科目返回
    clickBlack() {
      this.showDept = false;
      this.showsubject = false;
    },
    //单选部门
    updatecheckSingle() {
      let vm = this;
      vm.multipleDepart = false;
      vm.single = true;
      vm.deptment.MulitdepartmentName = "";
      vm.deptment.Mulitdepartment = "";
      vm.multDeptReadOnly = true;
      vm.readOnlySingle = false;
      this.$emit("updatecheckSingle", this.single);
    },
    updatecheckMulit() {
      let vm = this;
      vm.single = false;
      vm.multipleDepart = true;
      vm.deptment.departmentName = "";
      vm.deptment.department = ""
      vm.readOnlySingle = true;
      vm.multDeptReadOnly = false;
      this.$emit("updatecheckMulit", this.multipleDepart);
    },

    //多部门数据
    submitDept(params) {
      let vm = this;
      let mockDatas = [];
      Object.keys(params).forEach((key, value) => {
        mockDatas.push({
          key: params[key].departmentId,
          value: params[key].deptName
        });
        vm.deptSubItem = [...mockDatas];
      });
      vm.deptment.department = "";
      vm.deptment.departmentName = "";
      let mockDataId = "";
      let mockDataItem = "";
      let mockDataName = "";
      if (!Z_IsEmpty20(params)) {
        if (params.length > 1) {
          let dateAction = [];
          console.info(params)
          params.forEach(element => {
            let departmentId = element.departmentId + " ";
            let deptName = element.deptName;
            let percentage = element.percentage + " ";
            mockDataId += departmentId;
            mockDataItem = deptName + ":" + percentage;
            mockDataName += mockDataItem;
            dateAction.push({
              departmentId: element.departmentId,
              percentage: element.percentage,
              recordType: "department "
            });
            vm.deptAction = [...dateAction];
          });
          vm.deptment.Mulitdepartment = mockDataId;
          vm.deptment.MulitdepartmentName = mockDataName;
        } else {
          let dateAction = [];
          vm.deptment.Mulitdepartment = params[0].departmentId;
          vm.deptment.MulitdepartmentName =
            params[0].deptName + ":" + params[0].percentage;
          dateAction.push({
            departmentId : params[0].departmentId,
            percentage: params[0].percentage,
            recordType: "department "
          });

          vm.deptAction = [...dateAction];
        }
      }
      vm.deptment.departAction = vm.deptAction;
      vm.showDept = false;
    },
    //单选科目数据
    updatecheckSub() {
      let vm = this;
      vm.multipleSub = false;
      vm.singleSub = true;
      vm.deptment.MulitsubjectIdName = "";
      vm.deptment.MulitsubjectId = "";
      vm.multsubReadOnly = true;
      vm.readOnlysubSingle = false;
      this.$emit("updatecheckSub", this.singleSub);
    },
    //多科目数据
    submitSubject(params) {
      let vm = this;
      vm.deptment.subjectId = "";
      vm.deptment.subjectIdName = "";
      let mockDataId = "";
      let mockDataName = "";
      let mockDataItem = "";
      if (!Z_IsEmpty20(params)) {
        if (params.length > 1) {
          let dateAction = [];
          params.forEach(element => {
            let subjectId = element.deptId + "#" + element.subjectId + " ";
            let deptName = element.deptName;
            let subjectName = element.subjectName;
            let deptProportion = element.deptProportion + " ";
            mockDataId += subjectId;
            mockDataItem = deptName + "," + subjectName + ":" + deptProportion;
            mockDataName += mockDataItem;
            dateAction.push({
              subjectId: element.subjectId,
              percentage: element.deptProportion,
              recordType: "subject"
            });

          });
          vm.deptAction = [...dateAction];
          vm.deptment.MulitsubjectId = mockDataId;
          vm.deptment.MulitsubjectIdName = mockDataName;
        } else {
          let dateAction = [];
          dateAction.push({
            subjectId: params[0].subjectId,
            percentage: params[0].deptProportion,
            recordType: "subject"
          });
          vm.deptAction = [...dateAction];
          vm.deptment.MulitsubjectId = params[0].subjectId;
          vm.deptment.MulitsubjectIdName =
            params[0].deptName +
            "," +
            params[0].subjectName +
            ":" +
            params[0].deptProportion;
        }
      }
      vm.deptment.subjectAction = vm.deptAction;
      vm.showsubject = false;
    },
    updatecheckItem() {
      let vm = this;
      vm.multipleSub = true;
      vm.singleSub = false;
      vm.deptment.subjectIdName = ""
      vm.deptment.subjectId = ""
      vm.readOnlysubSingle = true;
      vm.multsubReadOnly = false;
      this.$emit("updatecheckItem", this.multipleSub);
    },
    //固定资产科目
    onClickassetSubject() {
      if (this.$route.query.flag === "watch") {
        return
      } else {
        this.showPicker = true;
        this.subjectFlag = "assetSubject";
      }

    },
    //累计折旧科目
    onClickdepreciatSubject() {
      if (this.$route.query.flag === "watch") {
        return
      } else {
        this.showPicker = true;
        this.subjectFlag = "depreciatSubject";
      }
    },
    //单个科目
    onClicksingleSub() {
      if (this.singleSub) {
        this.subjectFlag = "singleSub";
        this.multsubReadOnly = true;
        this.readOnlysubSingle = false;
      }
      if (this.multipleSub) {
        this.readOnlysubSingle = true;
        this.multsubReadOnly = false;
      }
      this.showPicker = true;
      this.$emit("clickSub", this.singleSub);
    },
    //多个科目
    onClickmuiltSub() {
      if (this.singleSub) {
        this.multsubReadOnly = true;
        this.readOnlysubSingle = false;
      }
      if (this.multipleSub) {
        console.log(this.showsubject)
        this.readOnlysubSingle = true;
        this.multsubReadOnly = false;
        this.showsubject = true;
        this.deptData = this.deptSubItem;
      }
      this.typePath = this.modelType;
      //    this.$emit("muiltSub", this.multipleSub);
    },
    onPicked(item) {
      if (this.subjectFlag === "assetSubject") {
        this.deptment.fixedAssetsSubjectId = item.fileId;
        this.deptment.fixedAssetsSubjectIdName = item.filename;
      }
      if (this.subjectFlag === "depreciatSubject") {
        this.deptment.depreciationSubjectId = item.fileId;
        this.deptment.depreciationSubjectIdName = item.filename;
      }
      if (this.subjectFlag === "singleSub") {
        this.deptment.subjectIdName = item.filename;
        this.deptment.subjectId = item.fileId;
      }
      this.showPicker = false;
    },
    onPickAbort() {
      this.showPicker = false;
    },
    onClickmultDept() {
      if (this.single) {
        this.multDeptReadOnly = true;
        this.readOnlySingle = false;
      }
      if (this.multipleDepart) {
        this.readOnlySingle = true;
        this.multDeptReadOnly = false;
        this.showDept = true;
      }
      this.typePath = this.modelType;
      // this.$emit("multDept", this.multipleDepart);
    },
    onPickAbortdept() {
      this.showPersonPicker = false;
    },
    onPickDept(list) {
      let vm = this;
      vm.deptment.departmentName = list[0].text;
      vm.deptment.department = list[0].id;
      vm.deptSubItem.push({
        key: list[0].id,
        value: list[0].text
      });
      vm.showPersonPicker = false;
    },
    onClick() {
      let vm = this;
      if (vm.single) {
        vm.showPersonPicker = true;
        vm.multDeptReadOnly = true;
      }
      if (vm.multipleDepart) {
        vm.readOnlySingle = true;
        vm.multDeptReadOnly = false;
      }
      console.log(vm.single)
      vm.$emit("singSub", vm.single);
    }
  }
};
</script>
<style>
.deptAddOther {
  padding-left: 10px;
  height: 100%;
}
.deptAddOther .weui-cell {
  font-family: Arial;
  color: #101010;
  font-size: 16px !important;
}
.deptAddOther .deptment .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 110px;
  color: rgba(255, 128, 0, 1) !important;
}
.deptAddOther .charges .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 80px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>
<style scoped>
.cell-list:after {
  display: block;
  content: "";
  clear: both;
  visibility: hidden;
}
.cell-list {
  zoom: 1;
}
</style>



