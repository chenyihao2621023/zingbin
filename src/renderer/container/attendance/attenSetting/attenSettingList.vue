<template>
  <div class="attenSettingList">
    <ZingHead title="考勤组设置">
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
    <div class="scroll-list-wrap" v-if="attenSettingList && attenSettingList.length > 0">
        <scroll ref="scroll"
          :data="attenSettingList"
          :scrollbar="true"
          :startY="0"
          >
          <div class="weui-cell" v-for="(item ,index) in attenSettingList">
              <div class="weui-form-preview__bd">
                <div class="weui-form-preview__item">
                      <label class="weui-form-preview__label">{{item.groupName}}</label> 
                      <span class="weui-form-preview__value">
                            <i class="icon iconfont icon-shanchu1" style="font-size: 20px;" @click="delBtn(item.rowId)"></i>
                      </span>
                </div>
                <div class="weui-form-preview__item" style="text-align: left;">
                     <span v-if="item.orgList">
                          <i class="icon iconfont icon-lianxiren1"></i>
                          成员:{{item.userNum}}人,{{item.orgList}}个参与部门:{{item.orgOneName}}...
                      </span>
                     <span v-else>
                          <i class="icon iconfont icon-lianxiren1"></i>
                          成员:{{item.userNum}}人
                     </span>
                </div>
                <div class="weui-form-preview__item" style="text-align: left;" v-if="item.groupType == '1' || item.groupType == '2'">
                      <span  v-if="item.groupType == '1'">
                            <i class="icon iconfont icon-ICon-"></i>
                            固定班制:{{item.attenDateName}}
                      </span>
                      <span  v-if="item.groupType == '2'">
                            <i class="icon iconfont icon-ICon-"></i>
                            排班制:{{item.attenDateName}}
                      </span>
                </div>
                <x-button v-if="item.groupType == '1' || item.groupType == '2'" sort="right" mini type="primary btn-common" @click.native="showDateBtn(item)">编辑班次</x-button>
                <x-button v-if="item.groupType == '2'" sort="right" mini type="primary btn-common" @click.native="editShiftBtn(item)">编辑排版</x-button>
                <x-button sort="right" mini type="primary btn-save" @click.native="editBtn(item.rowId)">编辑考勤</x-button>
              </div>
          </div>
        </scroll>
    </div>
    <div v-else>
          <p class="noData">暂无考勤组信息</p>
    </div>
    <!-- 选时间组件 -->
    <attenDate-Tem
            :showAttenDatePicker="showAttenDatePicker"
            :multipleMode="multipleMode"
            :selDateIDs = "selDateIDs"
            @goAttenSetting=onHome
            @selDateClicked=onSelDateClicked>
    </attenDate-Tem>
    <!-- 弹出框组件 -->
    <div v-transfer-dom>
         <confirm v-model="confirmShow"
             ref="confirm1"
             title="选择规则生效时间"
             content="立即生效：今日考勤结果将按新规则重算"
             confirm-text="立即生效"
             cancel-text="明日生效"
             @on-cancel="onCancel"
             @on-confirm="onConfirm">
         </confirm>
    </div>
  </div>
</template>

<script>
import {XButton,TransferDom,Confirm} from 'vux'
import Scroll from "@/components/scroll/Scroll"
import ZingHead from "@/components/zingHead/ZingHead"
import Dropdown from "@/components/dropdown/Dropdown";
import AttenDateTem from "./attenDateTem";


export default {
  name: "attenSettingList",
  directives: {
      TransferDom
  },
  components: {
    XButton,Confirm,
    Scroll,ZingHead,Dropdown,AttenDateTem
  },
  data() {
    return {
      datas: [{ content: "新增考勤组", url: "attenSetting" }],
      attenSettingList:[],

      showAttenDatePicker:false,//选时间组件是否显示标识
      multipleMode:false,//控制按钮 true-多选 false-单选
      selDateIDs:"",//选中时间的id
      curItem:{},

      //弹出框
      confirmShow:false,
      idstr:""

    }
  },
  created() {
      this.getAttenSettingList()//获取考勤配置列表
  },
  methods: {
      handleMenu (data) { //下拉菜单
          if (data.url) {
              this.$router.push({
                  path: data.url,
              });
          }
      },
      getAttenSettingList(){
          let url = '/zingbiz/attendance/attendancesetting/getAttendanceSettingByCompanyId'
          this.$http.post(url,{}).then(res => {
                  let retData = res.data.data
                  retData.forEach(item => {
                      if(item.groupName.length > 15){
                          item.groupName = item.groupName.substring(0,15) + "..."
                      }
                      if(item.attenDateName && item.attenDateName.length > 15){
                          item.attenDateName = item.attenDateName.substring(0,15) + "..."
                      }
                  })
                  this.attenSettingList = retData
              })
      },
      editBtn(rowId) {
          this.$router.push({
            path:'attenSetting',
            query:{rowId:rowId}
          });
      },
      delBtn(rowId) {
          let _this = this
          this.$vux.confirm.show({
                        title:'提示' ,
                        content:'你确定要删除吗?',
                        onCancel () {},
                        onConfirm() {
                            _this.delAttenSet(rowId)
                        }
          })
      },
      delAttenSet(rowId){
          let url = '/zingbiz/attendance/attendancesetting/delAttendanceSetting'
          let params = {
              rowId:rowId
          }
          this.$http.post(url,params).then(res => {
                this.attenSettingList = this.attenSettingList.filter(item => {
                    return rowId !== item.rowId
                })
                this.$vux.toast.show({text:"删除成功！",type:"success"})
          })
      },
      showDateBtn(item){
            this.curItem = item
            this.showAttenDatePicker =  true
            if(item.groupType && item.groupType== "1"){
                  this.selDateIDs = item.attenDateId
                  this.multipleMode = false
            }
            if(item.groupType && item.groupType== "2"){
                  this.selDateIDs = item.attenDateId
                  this.multipleMode = true
            }
      },
      onHome() {
            this.showAttenDatePicker =  false
            this.selDateIDs = ''
            this.getAttenSettingList()
      },
      onSelDateClicked(idstr,valStr){
          if(!this.curItem || !this.curItem.attenDateId){
               return
          }
          this.idstr = idstr;
          this.confirmShow = true
      },
      onCancel(){
         let  _this = this
         let params = {}
         params.nextAttenDateId = this.idstr
         params.nextStatus = "true"
         params.rowId = this.curItem.rowId
         let  url = "/zingbiz/attendance/attendancesetting/updateAttenDateIdImme"
         this.$http.post(url,params).then(res => {
              this.$vux.toast.show({text:"修改成功！",type:"success",onHide () {
                     _this.showAttenDatePicker =  false
                     _this.getAttenSettingList()
              }})
         })
      },
      onConfirm(){
         let oldAttenDateId = ""
         if(this.curItem.groupType == '1'){//固定
            if(this.idstr != this.curItem.attenDateId){
                oldAttenDateId = this.curItem.attenDateId
            }
         }
         let  _this = this
         let params = {}
         params.attenDateId = this.idstr
         params.attenStatus = "true"
         params.nextStatus = "false"
         params.rowId = this.curItem.rowId
         params.oldAttenDateId = oldAttenDateId
         let  url = "/zingbiz/attendance/attendancesetting/updateAttenDateIdImme"
         this.$http.post(url,params).then(res => {
              this.$vux.toast.show({text:"修改成功！",type:"success",onHide () {
                     _this.showAttenDatePicker =  false
                     _this.getAttenSettingList()
              }})
         })
      },
      editShiftBtn(data){
          let url = "/zingbiz/attendance/attenPunch/getShiftCardUrl"
          let params = {
              userStr:data.attenUser,
              orgStr:data.attenOrg,
              roleStr:data.attenRole,
          }
          this.$http.post(url,params).then(res => {
              if(res.data.data){
                  let retData = res.data.data
                  if(retData.length <= 0){
                       this.$vux.toast.text("没有可查看的排班人员!", 'conter')
                       return
                  }
                  let attenUser = ""
                  retData.forEach(cardUrl　=>{
                      attenUser += " "+cardUrl　
                  })
                  attenUser = attenUser.substring(1,attenUser.length)
                  this.$router.push({
                        path:'arrangeCalendar',
                        query:{
                              attenUser:attenUser,
                              rowId:data.rowId,
                              attenDateId:data.attenDateId
                        }
                  })
              }else{
                  this.$vux.toast.text("排班人员获取失败!", 'conter')
              }

          })
      }
  }
};
</script>
<style>
    @keyframes vux-dialog-out {
      0% {
        transform: unset !important ;
        opacity: 1;
      }
      100% {
        transform: unset !important ;
        opacity: 0;
      }
    }
    @keyframes vux-dialog-in {
      0% {
        transform: unset !important ;
        opacity: 0;
      }
      100% {
        transform: unset !important ;
        opacity: 1;
      }
    }
</style>
<style lang="stylus"  scoped>
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';
    .vux-x-dialog-absolute .weui-dialog {
        animation:unset !important ;
    }
    .vux-dialog-leave-active {
        animation:unset !important ;
    }
    
    .attenSettingList {
      height calc(100% - 50px);
      .scroll-list-wrap {
        position: relative;
        height: 100%;
        border-radius: 4px;
        transform: rotate(0deg); // fix 子元素超出边框圆角部分不隐藏的问题
        overflow: hidden;

        .left {
          flex: 1;
          flex-center(row, start, center);

          &-wrapper {
            margin-left: 10px;
            flex: 1;

            &-title {
              font-size: $font-size-base + 2px;
              margin-bottom: 0px;
              cursor: pointer;
            }
          }
        }

        .right {
          flex: 1;
          text-align: right;
        }
      }
    }
    .noData{
        text-align: center;
        font-size: 16px;
        color: #ff8000;
        margin-top: 15px;
    }
   
    .grid-card {
        padding: 15px 13px;
    }
    
    .weui-form-preview__bd {
        padding: 10px 15px;
        font-size: .9em;
        text-align: right;
        color: #999999;
        line-height: 2;
        width: 100%;
        padding: 0;
        font-size: 16px;
    }
    .weui-form-preview__label {
      float: left;
      margin-right: 1em;
      min-width: 3em;
      color: #606266;
      text-align: justify;
      text-align-last: justify;
      font-weight: bold;
      
    }
    .weui-form-preview__value {
      display: block;
      overflow: hidden;
      word-break: normal;
      word-wrap: break-word;
    }
</style>