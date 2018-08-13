<template>
  <div id="otherSettingList" class="otherSettingList">
    <zing-head class="other-setting-head" :isShowQuery="true" :title="'添加其他应用'">
            <span slot="header-right" class="head-jiahao">
               <i class="iconfont icon-gengduo" @click="openEdit('add')"></i>
            </span>
    </zing-head>
    <div class="other-setting-content">
      <!--<scroll ref="scroll" :data="items" :scrollbar="true" :startY="0">-->
        <div v-if="getDataInfo && getDataInfo.length > 0">
          <GridCard v-for="(data, index) in getDataInfo" :key="index">
            <div slot="cardLeft" class="left">
              <!--<avatar shape="square" :src="data.headImg"></avatar>-->
              <avatar shape="square" size="large" :style="{backgroundColor: '#F5EB2B'}" :icon="data.iconUrl"></avatar>
              <div class="left-wrapper">
                <p class="left-wrapper-title">{{data.menuName}}</p>
              </div>
            </div>
            <div slot="cardRight" class="right">
              <div class="tag-wrapper">
                <!--<tag color="#40aefb">复职</tag>-->
                <x-button mini :style="{backgroundColor: '#40aefb'}" @click.native="openEdit('edit',data)">编辑</x-button>
                <x-button mini :style="{backgroundColor: '#ff8000'}" @click.native="openDialog(data)">删除</x-button>
              </div>
            </div>
          </GridCard>
        </div>
        <div v-else class="prompt" :style="{ height: screenHeight + 'px'}">暂无其他应用</div>
      <!--</scroll>-->
    </div>
    <div v-transfer-dom>
      <popup v-model="addOtherSettingModal" position="right" style="width: 100%;">
        <popup-header :left-text="'取消'" :right-text="'确定'" :title="'新建其他应用'" :show-bottom-border="false"
                      @on-click-left="addOtherSettingModal = false" @on-click-right="confirmSubmit"></popup-header>
        <group gutter="0">
          <x-input v-model="formData.menuName" placeholder="请输入应用名称">
            <span slot="label">应用名称<span class="span_title">*</span></span>
          </x-input>
          <selector v-model="formData.linkPrefix" title="链接前缀 <span style='color: #D81E06;'>*</span>"
                    :options="linkPrefixList">
          </selector>
          <x-input v-model="formData.link" placeholder="请输入应用链接">
            <span slot="label">应用链接<span class="span_title">*</span></span>
          </x-input>
          <x-input v-model="formData.sortId" placeholder="请输入显示顺序">
            <span slot="label">显示顺序<span class="span_title">*</span></span>
          </x-input>
          <cell value-align="right" title="应用图标" v-model="formData.iconUrl">
            <div class="yyIcon">
              <i :class="['iconfont', `icon-${formData.iconUrl}`]" @click="selectIocn()"
                 :style="{ 'background-color': zykIconBgColor}"></i>
            </div>
          </cell>
          <!--<x-input title="显示顺序" mask="999999999" type="number" placeholder="只允许输入数字"
                   v-model="editTarget.clazzSort" @on-change="changeNum"></x-input>
          <x-switch v-model="editTarget.isDiscount" title="是否可优惠"></x-switch>-->
        </group>
        <!-- 选择图标组件 -->
        <iconPicker :icon-picker-show="dialogIcon" :iconData="['benbanzushengchandingdanguanli', 'canting', 'jiudian', 'shangpu', 'caigou-tianchong', 'xiaoshougendanguanli', 'salesinvoice',
                    'shenpi1', 'tuihuo', '02', 'shichang', 'renzhengziliao', 'baocun-tianchong', 'baobiao-selected', 'renwu', 'xiaolaba', 'caiwu', 'fabubiaoshu', 'cardb', 'weibiaoti4']"
                    :bg-color="'#18c34c'" :mask-z-index="8000" :dialog-z-index="10000"
                    @cancel="iconPickerCancel" @close="iconPickerClose" @confirm="iconPickerConfirm"/>
      </popup>
    </div>
  </div>

</template>


<script>
  import {Cell, PopupHeader, Popup, XButton, XInput, Selector, Group, TransferDomDirective as TransferDom} from 'vux'
  import ZingHead from "@/components/zingHead/ZingHead";
  import Scroll from "@/components/scroll/Scroll";
  import GridCard from "@/components/gridcard/GridCard";
  import Avatar from "@/components/avatar/Avatar";
  import Tag from "@/components/tag/Tag";
  import iconPicker from "components/iconpicker/IconPicker";

  export default {
    name: "otherSettingList",
    components: {
      iconPicker,
      Cell,
      PopupHeader,
      Popup,
      XButton,
      XInput,
      Selector,
      Group,
      Scroll,
      GridCard,
      Avatar,
      Tag,
      ZingHead
    },
    directives: {
      //自定义标签属性
      TransferDom
    },
    data() {
      return {
        screenHeight: "0px",
        addOtherSettingModal: false,
        getDataInfo: [
          {
            menuName: "张三",
            iconUrl: "tianjia1",
          }
        ],
        items: [],
        formData: {
          linkPrefix: 'http://',
          iconUrl: "tianjia1",
        },
        linkPrefixList: ['http://', 'https://'],

        menuId: "",
        type: "",
        dialogIcon: false,
        zykIconBgColor: "rgb(24, 195, 76)",
      }
    },
    //钩子加载完触发
    created() {
      this.getData();
      this.screenHeight = document.documentElement.clientHeight - 50;
    },
    methods: {
      getData() {
        console.log("getData .......");
        let self = this;
        let url = "/ZingMH/ZDesk/company/companyLink/getAllCompanyLink.action";
        let params = {};
        self.$http.post(url, params).then(res => {
          console.log(res);
          if (res.data.success === true) {
            let resData = res.data.data.data;
            self.getDataInfo = resData
            console.log(resData);
            /*self.getDataInfo = resData.map(item => {
                item.headImg = "/checkJpg/" + item.cardUrl.substr(0,2) + "/" + item.cardUrl + item.companyId + "Bind.jpg";
                return item
            })*/
          }
        });
      },
      openDialog(data) {
        console.log("openDialog...........");
        let that = this;
        this.menuId = data.menuId;
        this.$vux.confirm.show({
          title: '提示',
          content: '确定要删除此应用吗？',
          onShow() {
            console.log('plugin show')
          },
          onHide() {
            console.log('plugin hide')
          },
          onCancel() {
            console.log('plugin cancel')
          },
          onConfirm() {
            console.log('plugin confirm')
            that.deleteLink();
          }
        })
      },
      selectIocn() {
        this.dialogIcon = true;
      },
      iconPickerConfirm(data) {
        this.dialogIcon = false;
        this.formData.iconUrl = data;
        this.zykIconBgColor = "#18c34c";
      },
      iconPickerClose() {
        this.dialogIcon = false;
      },
      iconPickerCancel() {
        this.dialogIcon = false;
      },
      onPullingDown() {
        // 模拟更新数据
        console.log("pulling down and load data");
        setTimeout(() => {
          if (this._isDestroyed) {
            return;
          }
          if (Math.random() > 0.5) {
            // 如果有新数据
            this.$refs.scroll.forceUpdate();
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate();
          }
        }, 2000);
      },
      onPullingUp() {
        // 更新数据
        console.log("pulling up and load data");
        setTimeout(() => {
          if (this._isDestroyed) {
            return;
          }
          if (Math.random() > 0.5) {
            // 如果有新数据
            this.$refs.scroll.forceUpdate();
          } else {
            // 如果没有新数据
            this.$refs.scroll.forceUpdate();
          }
        }, 1500);
      },
      openEdit(type, data) {
        this.type = type;
        if (type === 'edit') {
          console.log('edit');
          this.menuId = data.menuId;
          this.formData = data;
          if (data.menuUrl.indexOf("https://") >= 0) {
            this.formData.linkPrefix = "https://";
            this.formData.link = data.menuUrl.substring(data.menuUrl.indexOf("http://") + 8, data.menuUrl.length);
          } else if (data.menuUrl.indexOf("http://") >= 0) {
            this.formData.link = data.menuUrl.substring(data.menuUrl.indexOf("http://") + 7, data.menuUrl.length);
            this.formData.linkPrefix = "http://";
          }
        } else {
          this.formData = {
            linkPrefix: 'http://',
            iconUrl: "tianjia1",
          }
        }
        console.log(data);
        this.addOtherSettingModal = true;
      },
      deleteLink() {
        let url = '/ZingMH/ZDesk/company/companyLink/delCompanyLink.action';
        let params = {};
        let that = this;
        params.menuId = this.menuId;
        console.log(params);
        this.$http.get(url, { params }).then(res => {
          console.log(res);
          if (res.data.retcode === 0) {
            this.$vux.toast.show({
              text: "删除成功",
              type: 'text',
              position: 'default',
              onHide() {
                that.getData();
              }
            })
          }
        })
      },
      confirmSubmit() {
        console.log("confirmSubmit........");
        let that = this;
        if (typeof this.formData.menuName !== "string" || this.formData.menuName === "") {
          that.$vux.toast.text("应用名称不能为空", "top");
          return;
        } else if (this.chkstrlen(this.formData.menuName) > 8) {
          that.$vux.toast.text("应用名称过长", "top");
          return;
        }
        if (typeof this.formData.linkPrefix !== "string" || this.formData.linkPrefix === "") {
          that.$vux.toast.text("链接前缀不能为空", "top");
          return;
        }
        if (typeof this.formData.link !== "string" || this.formData.link === "") {
          that.$vux.toast.text("应用链接不能为空", "top");
          return;
        }
        if (typeof this.formData.sortId !== "string" || this.formData.sortId === "") {
          that.$vux.toast.text("应用名称不能为空", "top");
          return;
        }
        if (typeof this.formData.iconUrl !== "string" || this.formData.iconUrl === "") {
          that.$vux.toast.text("应用名称不能为空", "top");
          return;
        }

        let url = '';
        let params = {};
        params.menuName = this.formData.menuName;
        params.menuUrl = this.formData.linkPrefix + this.formData.link;
        params.sortId = this.formData.sortId;
        params.iconUrl = this.formData.iconUrl;

        if (this.type === 'edit') {
          url = '/ZingMH/ZDesk/company/companyLink/editCompanyLink.action';
          params.menuId = this.menuId;
          console.log(params);
          this.$http.get(url, { params }).then(res => {
            console.log(res);
            if (res.data.retcode === 0) {
              that.$vux.toast.show({
                text: "修改成功",
                type: 'text',
                position: 'default',
                onHide() {
                  that.getData();
                  that.addOtherSettingModal = false;
                }
              })
            }
          })
        } else {
          url = '/ZingMH/ZDesk/company/companyLink/addCompanyLink.action';
          console.log(params);
          this.$http.get(url, { params }).then(res => {
            console.log(res);
            if (res.data.retcode === 0) {
              that.$vux.toast.show({
                text: "添加成功",
                type: 'text',
                position: 'default',
                onHide() {
                  that.getData();
                  that.addOtherSettingModal = false;
                }
              })

            }
          })
        }

      },
      chkstrlen(str) {
        let strlen = 0;
        for (let i = 0; i < str.length; i++) {
          if (str.charCodeAt(i) > 255) {
            strlen += 2;
          } else {
            strlen++;
          }
        }
        return strlen;
      },
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .otherSettingList {
    .content-div {
      .left {
        .iconfont {
          font-size: 42px;
        }
      }
    }
  }
  /*.weui-btn_default {
    color: #fff;
  }*/
  .otherSettingList
    display flex
    flex-direction column
    width 100%
    height 100%
    .other-setting-head
      flex-shrink 0
    .other-setting-content
      flex-grow 1
      overflow-y auto
</style>
<style scoped>
  .icon-gengduo {
    margin-right: 14px;
    font-size: 25px;
  }

  .left-wrapper-title {
    margin-bottom: 0px;
  }

  .weui-btn + .weui-btn {
    margin-top: 0px;
  }

  .weui-btn {
    color: #fff;
  }

  .content-div {
    height: 100%;
    /*background: #fbf9fe;*/
  }

  .left-wrapper-title {
    width: 160px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .yyIcon .iconfont {
    font-size: 42px;
    color: #fff;
  }

  .span_title {
    color: #D81E06;
  }

  .prompt {
    background: #fbf9fe;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: #ff8000;
  }
</style>
