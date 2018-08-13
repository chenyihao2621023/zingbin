<template>
  <div class="type-manage">
    <zing-head :title="headTitle">
      <div slot="header-right">
        <div class="header-right">
          <span class="header-jiahao">
            <dropdown style="margin-top: -9px" :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
              <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                <i class="iconfont icon-gengduo"></i>
              </a>
            </dropdown>
          </span>
        </div>
      </div>
    </zing-head>
    <div class="prompt"  style="position: absolute;left: 150px;" v-show="prompt">未添加分类</div>
    <div class="scroll-list-wrap">
      <scroll ref="scroll" :data="items" :scrollbar="true" :pullDownRefresh="{threshold: 90,stop: 40}" :pullUpLoad="{threshold: 0,txt: {more: 'more', noMore: 'noMore'}}" :startY="0" @pullingDown="onPullingDown" @pullingUp="onPullingUp">
        <GridCard v-for="(item ,index) in items" :key="index">
          <div slot="cardLeft" class="left">
            <div class="left-wrapper">
              <p class="left-wrapper-title">{{ item.tags }} </p>
            </div>
          </div>
          <div slot="cardRight" class="right">
            <i class="iconfont icon-gengduo" @click="gotoUpdateDelPage(item)"></i>
          </div>
        </GridCard>

      </scroll>
    </div>
      <form-dialog
          ref="dialog"
          v-model="showFormDialog"
          :title="titleDialog"
          :showForm="true"
          :formAttrs="editingList"
          @on-confirm="onConfirm"
      >
      </form-dialog>
  </div>
</template>
<!--@on-cancel="onCancel"-->

<!--@on-show="onShow"-->
<!--@on-hide="onHide"-->
<script>
import { Selector, Search, Group, XDialog } from "vux";
import Scroll from "@/components/scroll/Scroll";
import GridCard from "@/components/gridcard/GridCard";
import Avatar from "@/components/avatar/Avatar";
import FormDialog from "@/components/formdialog/FormDialog";
import Tag from "@/components/tag/Tag";
import ZingHead from "@/components/zingHead/ZingHead";
import Dropdown from "@/components/dropdown/Dropdown";
const initList = [
  {
    title: "分类名称",
    type: "text",
    placeholder: "输入分类名称",
    name: "name"
  },
  {
    title: "显示顺序",
    type: "text",
    placeholder: "输入显示顺序",
    name: "order"
  }
];
import Qs from "qs";
export default {
  name: "classmain",
  components: {
    Scroll,
    GridCard,
    Avatar,
    Tag,
    ZingHead,
    Selector,
    FormDialog,
    Search,
    Group,
    Dropdown,
    XDialog
  },
  data() {
    return {
      headTitle: "分类管理",
      prompt: false,
      rowId: "",
      item: "",
      classType: "",
      className: "",
      titleDialog: "新建分类",
      classSort: "",
      datas: [{ content: "新建分类", url: "/addClass" }],
      items: [],
      showDialog: false,
      itemtypeData: {},
      formType: "add",
      showFormDialog: false,
      addNewTypeTimer: null,
      editingList: initList
      // classValidateForm: { invoice: false },
      // rules: {
      //       cl_Name: [
      //           { required: true, message: "请输入分类名称", trigger: "blur" },
      //           { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
      //       ],
      //       cl_Sort: [
      //           { required: true, message: "请输入分类顺序", trigger: "blur" },
      //           {
      //               min: 1,
      //               max: 3,
      //               message: "只允许输入1~999的整数！",
      //               trigger: "blur"
      //           }
      //       ]
      //   }
    };
  },
  created() {
    console.log("classType==" + this.$route.query.classType);
    let title = this.$route.query.headTitle;
    if (typeof title === "string" && title.length > 0) {
      this.headTitle = title;
    }
    this.initLoad();
  },
  methods: {
    gotoUpdateDelPage(item) {
      let _this = this;
      this.$vux.actionsheet.show({
        menus: ["编辑", "删除"],
        onMenuClick(text, key) {
          switch (key) {
            case 0:
              _this.localForm(item);
              break;
            default:
              _this.onDelete(item);
          }
          this.show = false;
        }
      });
      //显示三个点弹框
      this.showDialog = true;
      this.itemtypeData = item;
    },
    initLoad() {
      this.showDialog = false;
      if (this.$route.query.classType != undefined) {
        this.classType = this.$route.query.classType;
        let url = "/zingbiz/common/serviceModule/getAllServiceTypeByCardUrl";
        let params = {
          tagType: this.classType,
          pageNumber: 1,
          pageSize: 2000
        };
        let companyId = this.$route.query.companyId;
        let isCompanyId = this.$route.query.isCompanyId;
        if (typeof isCompanyId === "string" && isCompanyId.length > 0) {
          params.isCompanyId = isCompanyId;
        }
        if (typeof companyId === "string" && companyId.length > 0) {
          params.companyId = companyId;
        }
        this.$http.post(url, params).then(response => {
          if (response.data.success === true) {
            this.items = response.data.data.data;
            if (this.items.length === 0) {
              this.prompt = true;
            }
          } else {
          }
        });
      }
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
    handleMenu(data) {
      this.formType = "add";
      this.itemtypeData = {};
      this.showFormDialog = true;
      this.titleDialog = "新建分类";
      // if (data.url)
      //   this.$router.push({
      //     path: data.url,
      //     query: {
      //       router: "add",
      //       classType: this.classType
      //     }
    },
    //   });
    onDelete(item) {
      let _this = this;

      this.$vux.confirm.show({
        title: "提示",
        content: "确定删除该分类吗?",
        onCancel() {
          _this.$vux.confirm.hide();
        },
        onConfirm() {
          let url = "/zingbiz/common/serviceModule/delNewType";
          let params = {
            rowId: _this.itemtypeData.rowId,
            tagType: _this.classType
          };

          _this.$http.post(url, params).then(
            res => {
              let text = "删除成功!";
              let type = "success";
              let wh = "8em";
              if (res.data.retcode === 0) {
                _this.initLoad();
              } else {
                text = res.data.msg;
                type = "warn";
                wh = "10em";
              }
              _this.bottomToast(text, type, wh);
            },
            err => {
              console.log(err);
              _this.bottomToast("删除失败", "warn", "8em");
            }
          );
        }
      });
    },
    localForm() {
      this.formType = "edit";
      this.titleDialog = "编辑分类";
      this.$nextTick(() => {
        this.$refs.dialog.setFormValues([
          this.itemtypeData.tags,
          this.itemtypeData.sordId
        ]);
        this.showFormDialog = true;
      });
      // this.$router.push({
      //   path: "/addClass",
      //   query: {
      //     router: "edit",
      //     name: this.itemtypeData.tags,
      //     sort: this.itemtypeData.sordId,
      //     rowId: this.itemtypeData.rowId,
      //     classType: this.classType
      //   }
      // });
    },
    verification(cl_Name, cl_Sort) {
      let message;
      if (!cl_Name) {
        message = "请输入名称";
      } else if (!cl_Sort) {
        message = "请输入顺序";
      } else if (cl_Name.length >= 20) {
        message = "名称长度在1到20个字符";
      } else if (
        isNaN(cl_Sort) ||
        (Number(cl_Sort) < 0 || Number(cl_Sort) > 999)
      ) {
        message = "顺序只允许输入1~999的整数！";
      } else {
        message = false;
      }
      return message;
    },
    bottomToast(msg, type, wh) {
      let _this = this;
      if (!msg) return;
      let tp = type ? type : "success";
      let width = wh ? wh : "8em";
      this.$vux.toast.show({
        text: msg,
        type: tp,
        position: "middle",
        width,
        onHide() {
          _this.bottomToast("");
        }
      });
    },
    onConfirm(formData) {
      let self = this;
      let cl_Name = formData[0] || this.itemtypeData.tags;
      let cl_Sort = formData[1] || this.itemtypeData.sordId;

      let message = self.verification(cl_Name, cl_Sort);
      if (message) {
        self.bottomToast(message, "warn", "12em");
        self.$nextTick(() => {
          this.$refs.dialog.setFormValues([cl_Name, cl_Sort]);
          this.showFormDialog = true;
        });
        return;
      }

      let params = {
        tags: cl_Name,
        sordId: cl_Sort,
        tagType: self.classType
      };
      let url = "/zingbiz/common/serviceModule/addNewType";
      if (self.formType === "add") {
        self.$http
          .post(url, params)
          .then(function(response) {
            if (response.data.success === true) {
              self.bottomToast("新建分类成功", "success");
              self.initLoad();
            } else {
              self.bottomToast("新建分类失败", "warn");
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else if (self.formType === "edit") {
        params.rowId = self.itemtypeData.rowId;
        url = "/zingbiz/common/serviceModule/updateNewType";
        self.$http.post(url, params).then(function(response) {
          if (response.data.success === true) {
            self.bottomToast("修改成功", "success");
            self.initLoad();
          } else {
            self.bottomToast("修改失败", "warn");
          }
        });
      }
    }
  }
};
</script>
<style>
.type-manage .weui-dialog__btn_primary {
  color: #ff8000 !important;
}
.weui-toast.weui-toast_forbidden {
  color: #e5e5e5;
}
.weui-toast_forbidden .weui-icon_toast.weui-icon-success-no-circle:before {
  color: #e5e5e5;
}
.type-manage .weui-dialog__ft:after {
  border: none;
}
.type-manage .weui-cell:before {
  left: 0 !important;
}
.weui-cells:before {
  border: none !important;
}
.weui-dialog__hd {
  border-bottom: 1px solid #ece9e9 !important;
}
.weui-dialog__bd div {
  line-height: 40px !important;
  color: #000 !important;
}
</style>
<style lang="stylus" rel="stylesheet/stylus">
@import '../../../assets/stylus/variable.styl';
@import '../../../assets/stylus/mixin.styl';

.left-wrapper-title {
  margin-top: 3px;
}

.type-manage {
  height: 100%;

  .prompt {
    text-align: center;
    color: #ff8000;
    margin-top: 20px;
    font-size: 18px;
  }

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
          margin-bottom: 6px;
          cursor: pointer;
        }

        &-desc {
          width: 160px;
          color: #ddd;
          cursor: pointer;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
      }
    }

    .right {
      flex: 1;
      text-align: right;
      margin-right: -5px;

      .tag-wrapper {
        margin-top: 10px;

        &.tag+.tag {
          margin-left: 10px;
        }
      }
    }

    .classifi-left {
      &-name {
        margin-bottom: 10px;
      }

      &-tag-wrapper {
        &.tag+.tag {
          margin-left: 10px;
        }
      }
    }

    .classifi-right {
      align-self: flex-start;
    }

    .edit {
      min-height: 40px;
      line-height: 40px;
    }

    .grid-card {
      min-height: 50px;
    }
  }
}
</style>
