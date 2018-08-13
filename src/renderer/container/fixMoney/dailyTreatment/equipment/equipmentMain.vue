<!-- 附属设备清单 -->
<template>
    <div style="height:100%">
          <popup v-model="showPopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%" class="inner">
                <ZingHead :title="title" :isComeBack="false" @doSome="toBack()">
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
                <div class="innerdeptment">
                    <div class="table-deptment" style="overflow-y:scroll;">
                        <x-table :cell-bordered="false" :content-bordered="false" style="font-size:14px;">
                            <thead>
                                <tr>
                                    <th>设备编号</th>
                                    <th>设备名称</th>
                                    <th>数量</th>
                                    <th>金额</th>
                                    <th width="12%"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,index) in equipmentData" :key="index">
                                    <td>{{item.equipmentNumber}}</td>
                                    <td>{{item.name}}</td>
                                    <td>{{item.count}}</td>
                                    <td>{{item.money}}</td>
                                    <td>
                                        <span @click="selItem(item)" style="color:#ea7e26;font-size：12px;"> 详细 ></span>
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
                                <x-button style="background-color: # rgb(255, 128, 0, 1);" type="primary" @click.native="submit">确定</x-button>
                            </flexbox-item>
                    </flexbox>
                </div>
          </popup>
          <popup v-model="showUpdatePopup" position="right" :popup-style="{'overflow': 'hidden'}" height="100%" width="100%" class="inner">
               <ZingHead :title="equipmentTitle" :isComeBack="false" @doSome=" doBack()">
                </ZingHead>
                <div class="equipment" :data="equipment">
                    <group label-width="8em" label-margin-right="2em" class="equipment-list">
                        <x-input title="设备编号" v-model="equipment.equipmentNumber" class="equipmentCode" placeholder="请输入设备编号（数字）" :readonly="TabreadOnly" @on-blur="valaidEquipCode"></x-input>
                        <x-input title="设备名称" v-model="equipment.name" class="equipmentCode" placeholder="请输入设备名称" :readonly="TabreadOnly"></x-input>
                        <datetime v-model="equipment.registerDate" @on-change="changeData" title="登记日期" ></datetime>
                        <x-input title="规格型号" v-model="equipment.specificationModel" placeholder="请输入规格型号" ></x-input>
                        <x-input title="计量单位" v-model="equipment.measurementUnit" placeholder="请输入计量单位" ></x-input>
                        <x-input title="数量" placeholder="0" class="equipmentName" v-model="equipment.count" :is-type="validateCount">
                        </x-input>
                        <x-input title="金额" v-model="equipment.money" class="equipmentName" placeholder="0.00" @on-blur="onBlurValid" ></x-input>
                        <x-input title="存放地点" v-model="equipment.placeStorageId" style="display:none"></x-input>
                        <x-input title="存放地点" v-model="equipment.placeStorage" class="subjectName" placeholder="请选择存放地点" @click.native="onClickstorgy" disabled></x-input>
                        <x-input title="备注" placeholder="请输入备注" class="remark" v-model="equipment.remark" >
                        </x-input>
                    </group>
                    <flexbox :gutter="0" class="main-footer">
                        <flexbox-item v-if="cancleType">
                            <x-button style="background-color: #40affc;" type="primary" @click.native="cancel">取消</x-button>
                        </flexbox-item>
                        <flexbox-item v-else>
                            <x-button style="background-color:  #40affc;" type="primary" @click.native="deleteEquip">删除</x-button>
                        </flexbox-item>
                        <flexbox-item>
                            <x-button style="background-color: rgb(255, 128, 0, 1);" type="primary" @click.native="submitEquip">确定</x-button>
                        </flexbox-item>
                    </flexbox>
                    <confirm v-model="isShow" :title="'提示'" @on-cancel="onCancel" @on-confirm="onConfirm" class="palce-comfirm">
                        <p style="text-align:center;padding-top:15px;">确定删除吗？</p>
                    </confirm>
                </div>
          </popup>
        <popupStorage :showPopup="storagePopup" @backClick="clickBack" @checkItem="checkStorage"></popupStorage>
    </div>
</template>
<script>
import {
    XTable,
    Flexbox,
    FlexboxItem,
    XButton,
    Group, XInput, Confirm, Popup, Datetime
    } from "vux";
import Scroll from "@/components/scroll/Scroll";
import Tree from "@/container/fixMoney/template/Tree";
import { Z_IsEmpty20 } from "@/utils/fn";
import Dropdown from "@/components/dropdown/Dropdown";
import popupStorage from "../selectorPopup/popupStorage";
import ZingHead from "components/zingHead/ZingHead.vue";
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
    Confirm,
    Popup,
    Datetime,
    Tree,
    Scroll,
    popupStorage
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
            equipmentTitle: "",
            equipment: {},
            TabreadOnly: false,
            storagePopup: false, //存放地点
            deleteItemIcon: true,
            cancleType: false,
            title: '附属设备清单',
            showUpdatePopup: false,
            equipmentData: [],
            updateItem:{},
            datas: [
                {
                content: "新建"
                }
            ],
            routerType: "",
            validateCount: function(value) {
                return {
                valid: /^[1-9]\d*$/.test(value),
                msg: "请输入数字"
                };
             }
        }
    },
    created() {
        let vm = this
        vm.routerType = vm.$route.query.flag
        let originId = vm.$route.query.originId
        vm.getEquipment(originId)
    },
    methods: {
        //header 返回事件
        toBack() {
           this.$emit("comeback");
        },
        //添加图标点击事件
        handleMenu() {
            let vm = this
            vm.showUpdatePopup = true
            vm.equipmentTitle = "新建"
            vm.TabreadOnly = false;
            vm.cancleType = true;
            vm.equipment = {}
        },
        selItem(item) {
          console.log(item)
            let vm = this
            vm.updateItem = item
            vm.showUpdatePopup = true
            vm.equipmentTitle = "编辑"
            vm.TabreadOnly = true;
            vm.equipment = {
                //设备名称
                name:item.name,
                // 金额
                money:item.money,
                // 设备编号
                equipmentNumber:item.equipmentNumber,
                // 登记日期
                registerDate:item.registerDate,
                // 规格型号
                specificationModel:item.specificationModel,
                // 计量单位
                measurementUnit:item.measurementUnit,
                remark:item.remark,
                // 存放地点
                placeStorageId:item.placeStorageId,
                placeStorage:item.placeStorage,
                count:item.count
            }
        },
        doBack() {
            this.showUpdatePopup = false
        },
        //查询附属设备
        getEquipment(id) {
            let vm = this
            let url = "/zingbiz/fixedAssets/accessoryEquipment/select?id=" + id
            vm.$http.get(url).then(res => {
                if (res.data.success) {
                    vm.equipmentData = res.data.data;
                }
             });
        },
        // 存放地点popup显示
        onClickstorgy() {
            this.storagePopup = true;
        },
         //关闭资产类别Popup框
        clickBack() {
            let vm = this;
            vm.storagePopup = false;
        },
        //制保留2位小数，如：2，会在2后面补上00.即2.00
        toDecimal(x) {
            let f = parseFloat(x);
            if (isNaN(f)) {
                return 0.00;
            }
            let fn = Math.round(x * 100) / 100;
            let s = fn.toString();
            let rs = s.indexOf(".");
            if (rs < 0) {
                rs = s.length;
                s += ".";
            }
            while (s.length <= rs + 2) {
                s += "0";
            }
            return s;
        },
        onBlurValid(val) {
            let vm = this;
            vm.equipment.money = vm.toDecimal(val);
        },
         // 存放地点
        checkStorage(item) {
            let vm = this;
            vm.storagePopup = false;
            vm.equipment.placeStorage = item.name;
            vm.equipment.placeStorageId = item.code;
        },
        //验证资产编码不能重复
        valaidEquipCode() {
            let vm = this
            vm.equipmentData.forEach(element => {
                if (vm.equipment.equipmentNumber === element.equipmentNumber) {
                    vm.$vux.toast.text("设备编号不能重复");
                    return;
                }
            });
        },
        //新增提交事件
        submitEquip() {
            let vm = this;
            if (Z_IsEmpty20(vm.equipment.equipmentNumber)) {
                vm.$vux.toast.text("请输入设备编号");
                return;
            }
            if (Z_IsEmpty20(vm.equipment.name)) {
                vm.$vux.toast.text("请输入设备名称");
                return;
            }
                if (Z_IsEmpty20(vm.equipment.registerDate)) {
                    vm.$vux.toast.text("请选择登记日期");
                return;
            }
            if (Z_IsEmpty20(vm.equipment.count)) {
                vm.$vux.toast.text("请输入数量");
                return;
            }
            if (Z_IsEmpty20(vm.equipment.money)) {
                vm.$vux.toast.text("请输入金额");
                return;
            }
            if (vm.equipmentTitle === '编辑') {
                let equipmentIndex = vm.findIndexOf(vm.equipmentData,vm.updateItem.equipmentNumber)
                vm.equipmentData.splice(equipmentIndex,1,);
            }
            vm.equipmentData.push({
                //设备名称
                name:vm.equipment.name,
                // 金额
                money:vm.equipment.money,
                // 设备编号
                equipmentNumber:vm.equipment.equipmentNumber,
                // 登记日期
                registerDate:vm.equipment.registerDate,
                // 规格型号
                specificationModel:vm.equipment.specificationModel,
                // 计量单位
                measurementUnit:vm.equipment.measurementUnit,
                remark:vm.equipment.remark,
                // 存放地点
                placeStorageId:vm.equipment.placeStorageId,
                placeStorage:vm.equipment.placeStorage,
                count:vm.equipment.count
            })
             vm.showUpdatePopup = false
        },
        cancel() {
            let vm = this
            vm.showUpdatePopup = false
        },
        deleteItem() {
            let vm = this
            vm.$vux.confirm.show({
            title: "提示",
            content: "确定删除？",
            onConfirm() {
                vm.equipmentData = []
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
        deleteEquip() {
            let vm = this
            vm.showUpdatePopup = false

        },
        submit() {
            let vm = this
            vm.$emit("submitEquipment",vm.equipmentData)
        }
    }
};
</script>
<style scoped>
  .innerdeptment{
    height: calc(100% - 50px);
  }
.table-deptment {
  height: calc(100% - 44px);
}
.equipment{
    height: calc(100% - 50px);
}
.equipment-list{
    height: calc(100% - 44px);
}
</style>
<style>
.equipment .equipmentCode .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 80px;
  color: rgba(255, 128, 0, 1) !important;
}
.equipment .equipmentName .weui-cell__hd:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 50px;
  color: rgba(255, 128, 0, 1) !important;
}
.equipment .vux-datetime p:before {
  content: "*";
  display: inline-block;
  position: absolute;
  left: 80px;
  color: rgba(255, 128, 0, 1) !important;
}
</style>



