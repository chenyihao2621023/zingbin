<!-- 多部门 - 设置部门 -->
<template>
    <div style="height:100%;">
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
                                <th>部门名称</th>
                                <th>分配比例（%）</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody v-if="depementData.length>0">
                            <tr v-for="(item,index) in depementData" :key="index">
                                <td>{{item.deptName}}</td>
                                <td>{{item.percentage}}</td>
                                <td>
                                    <span @click="selItem(item)" style="color:#ea7e26;font-size：12px;"> 详细 ></span>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="3">
                                    <span style="color:#ea7e26;font-size：12px;"> 请设置部门及分配比例</span>
                                </td>
                            </tr>
                        </tbody>
                    </x-table>
                </div>
                <flexbox :gutter="0" class="main-footer">
                    <flexbox-item>
                        <x-button style="background-color: #40affc;" type="primary" @click.native="deleteItem">清空</x-button>
                    </flexbox-item>
                    <flexbox-item>
                        <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="submitdepart">确定</x-button>
                    </flexbox-item>
                </flexbox>
            </div>
        </popup>
        <org-member-picker :initialSelected="initSelectPerson" :multiple="false" :showTab="isAuthRole" :showPicker="showPersonPicker" @picked="onPickDept" @abort="onPickAbortdept"></org-member-picker>
        <!-- <subject-picker :showPicker="showPicker" :multipleMode="multiMode" :parentSubjectSelectable="true" :showDesc="false" @picked="onPicked" @abort="onPickAbort"></subject-picker> -->
        <!-- <modifyDept :showPopup="showModify" @updateDept="updateDept"></modifyDept> -->
        <popup position="right" v-model="popup" :popup-style="{top: 20 + '%',width:80 + '%',margin: 10 + '%', height: 180+'px','overflow-y': 'auto'}">
            <div class="deptments">
                <div class="initFrom-title">{{departTitle}}</div>
                <group>
                    <x-input title="部门ID" v-model="deptment.departmentId" style="display:none"></x-input>
                    <x-input title="部门名称" v-model="deptment.name" :readonly="TabreadOnly" class="deptmentName" placeholder="请选择使用部门" @click.native="onClickDept" disabled></x-input>
                    <x-input title="分配比例(%)" placeholder="请输入分配比例" class="proportion" :readonly="TabreadOnly" v-model="deptment.percentage" :is-type="validateProportion">
                    </x-input>
                    <flexbox class="inner">
                        <flexbox-item class="interspace" @click.native="cancle()">
                            取消
                        </flexbox-item>
                        <flexbox-item class="interspace" @click.native="submit()">
                            确认
                        </flexbox-item>
                    </flexbox>
                </group>
            </div>
        </popup>
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
  Popup,
  Cell
} from "vux";
import OrgMemberPicker from "components/orgmemberpicker/OrgMemberPicker";
import Dropdown from "@/components/dropdown/Dropdown";
import ZingHead from "components/zingHead/ZingHead.vue";
// import { Z_IsEmpty20 } from "@/utils/fn";
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
    Cell,
    OrgMemberPicker
  },
  props: {
    showPopup: {
      type: Boolean,
      default: function() {
        return false;
      }
    },
    typePath: {
      type: String,
      default: function() {
        return "";
      }
    },
  },
  data() {
    return {
      title: "部门分配情况",
      initSelectPerson: [],
      isAuthRole: ["org"],
      showPersonPicker: false,// 科目单选、多选
      showModify: false,
      depementData: [],
      TabreadOnly:false,
      datas: [
        {
          content: "新建"
        }
      ],
      deptment: {},
      updateItem: {},
      popup: false,
      validateProportion: function(value) {
        return {
          valid: /^[1-9]\d*$/.test(value),
          msg: "请输入1-100数字"
        };
      }
    };
  },
  created() {
     let vm = this;
    vm.paramtemp = vm.$route.query;
    this.getDeptUse()
    // let detaDatas = localStorage.getItem("department")
    // if (!Z_IsEmpty20(detaDatas)) {
    //     this.depementData = JSON.parse(detaDatas)
    // } else {
    //     this.depementData = []
    // }
  },
  methods: {
    //header 返回事件
    doSome() {
      this.$emit("comeback");
    },
    submitdepart() {
        let vm = this
        let sum  = 0
        vm.depementData.forEach(item => {
             sum += parseFloat(item.percentage);
        })
        if (sum < 100) {
            vm.$vux.toast.text("各部分分配比例之和必须为100.00%");
            return
        } else {
            this.$emit("submitDept", this.depementData);
        }
    },
    //添加图标点击事件
    handleMenu() {
      let vm = this
      let sum = 0;
      vm.depementData.forEach(element => {
        sum += parseFloat(element.percentage);
      });
      if (sum >= 100) {
        vm.$vux.toast.text("分配比例超过百分比，无法添加新的部门");
      } else {
        vm.popup = true;
        vm.departTitle = "新建";
      }
    },
    selItem(item) {
      let vm = this;
      vm.popup = true;
      vm.departTitle = "编辑";
      vm.updateItem = item
      vm.deptment.departmentId = item.departmentId
      vm.deptment.name = item.deptName;
      vm.deptment.percentage = item.percentage;
    },
    cancle() {
      this.popup = false;
    },
    deleteItem() {
      let vm = this
      vm.$vux.confirm.show({
        title: "提示",
        content: "确定清空？",
        onConfirm() {
            vm.depementData = []
        }
      });
    },
    onClickDept() {
         this.showPersonPicker = true;
    },
   onPickAbortDept() {
      this.showPersonPicker = false;
    },
    onPickAbortdept() {
      this.showPersonPicker = false;
    },
    onPickDept(list) {
      let vm = this;
      vm.deptment.name = list[0].text;
      vm.deptment.departmentId = list[0].id
      vm.showPersonPicker = false;
    },
    //获取部门分配使用数据
    getDeptUse() {
        let vm = this
      let url = "/zingbiz/fixedAssets/departmentAllocation/select?id=" + vm.paramtemp.originId;
      vm.$http.get(url).then(res => {
        if (res.data.success) {
          vm.depementData = res.data.data;
        }
      });
    },
    // 数组指定参数删除
    findIndexOf(ary,val) {
        for (let i = 0; i < ary.length; i++) {
                if (ary[i].departmentId === val) {
                    return i;
                } else {
                    return -1;
                }
        }
    },
    // 添加部门分配情况数据
    submit() {
        let sum = 0
        let flag = false
        let temporary = this.depementData.concat()
        let deptIndex = this.findIndexOf(temporary,this.updateItem.departmentId)
        temporary.splice(deptIndex,1,);
        if (this.departTitle === '编辑') {
          temporary.forEach(element => {
            sum += parseFloat(element.percentage);
            if (this.deptment.departmentId === element.departmentId) {
              this.$vux.toast.text("部门名称重复");
              flag = true
            }
          });
        } else {
          this.depementData.forEach(element => {
            sum += parseFloat(element.percentage);
            if (this.deptment.departmentId === element.departmentId) {
              this.$vux.toast.text("部门名称重复");
              flag = true
            }
          });
        }
        if (flag) {
          return
        }
        sum += parseFloat(this.deptment.percentage)
        if ( sum > 100) {
            this.$vux.toast.text("分配比例超过百分比，无法添加新的部门");
            return
        } else {
          if (this.departTitle === '编辑') {
            let deptIndex = this.findIndexOf(this.depementData,this.updateItem.departmentId)
            this.depementData.splice(deptIndex,1,);
          }
            this.depementData.push({
                departmentId: this.deptment.departmentId,
                deptName:this.deptment.name,
                percentage : this.deptment.percentage
            })
        }
        this.popup = false
    }
  }
};
</script>
<style>
.deptments .deptmentName .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 80px;
  color: rgba(255, 128, 0, 1) !important;
}
.deptments .proportion .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 110px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>

<style scoped>
.table-deptment {
  height: calc(100% - 94px);
}
.deptments .initFrom-title {
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
.deptments .weui-cells {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px !important;
}
.deptments .initFrom-title {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px !important;
}
</style>



