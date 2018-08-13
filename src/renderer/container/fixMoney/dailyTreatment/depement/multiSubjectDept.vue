<!-- 多科目 - 设置科目 -->
<template>
    <div style="height:100%">
        <popup v-model="showPopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%" class="inner">
            <ZingHead :title="title" :isComeBack="false" @doSome="doSome()">
                <div slot="header-right">
                    <span class="header-jiahao">
                        <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
                            <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                                <i class="iconfont icon-gengduo"></i>
                            </a>
                        </dropdown>
                    </span>
                </div>
            </ZingHead>
            <div style="height:100%;">
                <div class="table-deptment" style="overflow-y:scroll;">
                    <x-table :cell-bordered="false" :content-bordered="false" style="font-size:14px;" v-model="typePath">
                        <thead>
                            <tr>
                                <th>部门</th>
                                <th>科目</th>
                                <th>核算项目</th>
                                <th>分配比例（%）</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-if="subjectData.length > 0">
                            <tr v-for="(item,index) in subjectData" :key="index">
                                <td>{{item.deptName}}</td>
                                <td>{{item.subjectName}}</td>
                                <td>{{item.project}}</td>
                                <td>{{item.deptProportion}}</td>
                                <td>
                                    <span @click="selItem(item,index)" style="color:#ea7e26;font-size：12px;"> 详细 ></span>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="4">
                                    <span style="color:#ea7e26;font-size：12px;"> 没有科目部门分配</span>
                                </td>
                            </tr>
                        </tbody>
                    </x-table>
                </div>
                <flexbox :gutter="0" class="main-footer">
                    <flexbox-item>
                        <x-button style="background-color:#40affc;" type="primary" @click.native="deleteItem">清空</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button style="background-color:rgb(255, 128, 0, 1);" type="primary" @click.native="submit">确定</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
        </popup>
        <popup v-model="showUpdatePopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%" class="inner">
            <ZingHead :title="UpdateTitle" :isComeBack="false" @doSome="closepopup()">
            </ZingHead>
            <div class="deptment" :data="deptment">
                <group label-width="8em" label-margin-right="2em" class="deptment-list">
                    <selector title="部门名称" :options="departmentList" v-model="deptment.department" class="deptmentName" placeholder="" @on-change="onChange"></selector>
                    <!-- <x-input title="部门名称" v-model="deptment.name" class="deptmentName" :readonly="TabreadOnly" placeholder="请选择使用部门" @on-focus="onClickDept"></x-input> -->
                    <x-input title="科目id" v-model="deptment.subjectId" style="display:none"></x-input>
                    <x-input title="科目" v-model="deptment.subjectName" class="subjectName" :readonly="TabreadOnly" placeholder="请选择科目" @click.native="onClickSubject" disabled></x-input>
                    <x-input title="分配比例(%)" placeholder="请输入分配比例" class="proportion" v-model="deptment.proportion" :is-type="validateProportion">
                    </x-input>
                </group>
                <flexbox :gutter="0" class="main-footer">
                    <flexbox-item>
                        <x-button style="background-color:#40affc;" type="primary" @click.native="deleteSubject">取消</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="submitSubject">确定</x-button>
                    </flexbox-item>
                </flexbox>
                <!--<confirm v-model="isShow" :title="'提示'" @on-cancel="onCancel" @on-confirm="onConfirm" class="palce-comfirm">-->
                    <!--<p style="text-align:center;padding-top:15px;">确定删除吗？</p>-->
                <!--</confirm>-->
            </div>
        </popup>
        <!-- <org-member-picker :initialSelected="initSelectPerson" :multiple="false" :showTab="isAuthRole" :showPicker="showPersonPicker" @picked="onPickDept" @abort="onPickAbortdept"></org-member-picker> -->
        <subject-picker :showPicker="showPicker" :multipleMode="false" :parentSubjectSelectable="true" :showDesc="false" @picked="onPicked" @abort="onPickAbort"></subject-picker>
    </div>
</template>
<script>
import {
  XTable,
  Flexbox,
  FlexboxItem,
  XButton,
  Group,
  XInput,
  Selector,
  Cell,
  Popup
} from "vux";
import Dropdown from "@/components/dropdown/Dropdown";
import ZingHead from "components/zingHead/ZingHead.vue";
import SubjectPicker from "components/subjectpicker/SubjectPicker.vue";
// import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
import { Z_IsEmpty20 } from "@/utils/fn";
export default {
  components: {
    XTable,
    Dropdown,
    ZingHead,
    Flexbox,
    FlexboxItem,
    XButton,
    Group,
    XInput,
    Popup,
    Selector,
    Cell,
    SubjectPicker
  },
  props: {
    showPopup: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    departmentList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    typePath: {
      type: String,
      default: function() {
        return "";
      }
    }
  },
  data() {
    return {
      title: "折旧费用分配情况",
      showUpdatePopup: false,
      UpdateTitle: "",
      deptment: {},
      showPicker: false,
      initSelectPerson: [],
      isAuthRole: ["org"],
      showPersonPicker: false,
      changeItem: "",
      validateProportion: function(value) {
        return {
          valid: /^[1-9]\d*$/.test(value),
          msg: "请输入1-100"
        };
      },
      subjectData: [],
      updateItem: {},
      datas: [
        {
          content: "新建"
        }
      ],
      //部门比例
      departProportion:[],
      deleteIndex:""
    };
  },
  methods: {
    // 取消按钮
    deleteSubject() {
      this.showUpdatePopup = false
      this.isShow = true;
    },
    //提示框取消按钮事件
    onCancel() {
      console.log("on cancel");
    },
    //提示框确认事件
    onConfirm(msg) {
      console.log("on confirm");
      //   let msg = true
      if (msg) {
        alert(msg);
      }
    },
    close() {
      this.showPopup = false;
      this.showUpdatePopup = false;
    },
    closepopup() {
      this.showPopup = true;
      this.showUpdatePopup = false;
    },
    onChange(val) {
      this.changeItem = val;
    },
    // 数组指定参数删除
    findIndexOf(ary, val) {
      for (let i = 0; i < ary.length; i++) {
        if (ary[i].departmentId === val) {
          return i;
        } else {
          return -1;
        }
      }
    },
    //保存事件
    submitSubject() {
      this.departProportion = []
      let departSum = 0
      let subjectIdSum = []
      let sum = 0;
      let departItem = "";
      let flag = ""
      let temporary = this.subjectData.concat() //临时数组
      temporary.splice(this.deleteIndex, 1);
      if (Z_IsEmpty20(this.deptment.department)) {
        this.$vux.toast.text("请选择使用部门");
        return;
      }
      if (Z_IsEmpty20(this.deptment.subjectName)) {
        this.$vux.toast.text("请选择科目");
        return;
      }
      if (Z_IsEmpty20(this.deptment.proportion)) {
        this.$vux.toast.text("请输入分配比例");
        return;
      }

      this.departmentList.forEach(item => {
        departSum = 0
        subjectIdSum = []
        if (item.key === this.changeItem) {
          departItem = item.value;
        }
        if (this.UpdateTitle === "编辑") {
          temporary.forEach((val,index) => {
            if (item.value === val.deptName) {
              departSum += parseFloat(val.deptProportion)
              subjectIdSum.push(val.subjectId)
            }
          })
        } else {
          this.subjectData.forEach((val,index) => {
            if (item.value === val.deptName) {
              departSum += parseFloat(val.deptProportion)
              subjectIdSum.push(val.subjectId)
            }
          })
        }

        this.departProportion.push({
          deptName:item.value,
          proportionSum:departSum,
          subjectIdSum:subjectIdSum
        })
      });
      console.log(this.departProportion)
      if (this.subjectData.length === 0) {
        sum = parseFloat(this.deptment.proportion)
      } else {
        sum = parseFloat(this.departProportion.find(val => {
          return val.deptName === departItem
        }).proportionSum ) + parseFloat(this.deptment.proportion)
        flag = this.departProportion.find(val => { return val.deptName === departItem })
          .subjectIdSum.find(item => { return item === this.deptment.subjectId })
      }
      if (sum > 100) {
        this.$vux.toast.text("同部门比例不可超过100%");
        return;
      }
      if (!Z_IsEmpty20(flag)) {
        this.$vux.toast.text("同部门不可添加相同科目");
        return;
      }
      if (this.UpdateTitle === "编辑") {
        this.subjectData.splice(this.deleteIndex, 1);
      }
      this.subjectData.push({
        deptName: departItem,
        deptId: this.changeItem,
        subjectName: this.deptment.subjectName,
        project: this.deptment.project,
        deptProportion: this.deptment.proportion,
        subjectId: this.deptment.subjectId
      });
      this.departProportion.forEach(val => {
        if (val.deptName === departItem) {
          val.proportionSum += parseFloat(this.deptment.proportion)
          val.subjectIdSum.push(this.deptment.subjectId)
        }
      })
      this.showUpdatePopup = false;
    },
    onClickSubject() {
      this.showPicker = true;
    },
    onPicked(item) {
      this.deptment.subjectId = item.modleId;
      this.deptment.subjectName = item.text;
      this.showPicker = false;
    },
    onPickAbort() {
      this.showPicker = false;
    },
    //header 返回事件
    doSome() {
      this.$emit("comeback");
    },
    //添加图标点击事件
    handleMenu() {
      this.showUpdatePopup = true;
      this.UpdateTitle = "新建";
    },
    selItem(item,index) {
      this.deleteIndex = index
      this.deptment.department = item.deptId
      this.changeItem = item.deptId
      this.deptment.subjectName = item.subjectName
      this.deptment.project = item.project
      this.deptment.proportion = item.deptProportion
       this.deptment.subjectId = item.subjectId
      this.updateItem = item;
      this.showUpdatePopup = true;
      this.UpdateTitle = "编辑";
    },
    submit() {
      let flag1 = false
      let flag2 = false
      this.departProportion.forEach(val => {
        if (parseInt(val.proportionSum) === 0) {
          flag1 = true
        } else if (parseInt(val.proportionSum) !== 100) {
          flag2 = true
        }
      })
      if (flag1) {
        this.$vux.toast.text("每个部门均要分摊");
        return
      }
      if (flag2) {
        this.$vux.toast.text("部门折旧费用和必须为100.00%");
        return
      }
      this.$emit("submitdepart", this.subjectData);
    },
    deleteItem() {
      let vm = this;
      vm.$vux.confirm.show({
        title: "提示",
        content: "确定删除？",
        onConfirm() {
          //    localStorage.removeItem('subjectData')
          vm.subjectData = [];
        }
      });
    }
  }
};
</script>
<style>
.deptment .deptmentName .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 75px;
  color: rgba(255, 128, 0, 1) !important;
}
.deptment .subjectName .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 50px;
  color: rgba(255, 128, 0, 1) !important;
}
.deptment .proportion .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 105px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>
<style scoped>
.table-deptment {
  height: calc(100% - 94px);
}
.deptment .initFrom-title {
  height: 40px;
  line-height: 40px;
  background-color: white;
  font-size: 18px;
  text-align: center;
}
.interspace {
  margin-left: 0px !important;
  text-align: center;
  padding: 5px 0;
  height: 40px;
}
.interspace:last-child {
  border-left: 1px solid #f5f5f5;
  color: #ff8000;
}
.deptment .weui-cells {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
}
.deptment .initFrom-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px !important;
}
.deptment {
  height: 100%;
}
.deptment-list {
  height: calc(100%-100px);
}
.deptment .weui-cell {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
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
