<template>
  <div class="continer graphicListComp">
    <scroll
      :observeDOM="true"
      ref="scroll" :data="[]"
      :scrollbar="true"
      :pullUpLoad="pullUpLoad"
      @pullingUp="pullingUp"
      :listenScroll="true"
    >

      <div class="info-list" v-show="graphicList.length">
        <div class="info-li" v-for="(item,index) in graphicList" :key="index">
          <div class="article" @click="jumpTo(item,$event)">
            <div class="img-box">
              <div v-if="showEditIcon" class="icons">
                <span style="color: white">&nbsp;{{item.isRelease==="1" ? '使用中': '未使用'}}</span>
                <span>
                                <i v-for="(iconItem,i) in levelOneIcon" :key="i" class="icon iconfont icon_z"
                                   :class="[`icon-${iconItem}`]" @click.stop="clickIcon(iconItem,index,item)">
                                </i>
                            </span>
              </div>
              <img class="thumb-img" :src="item.coverUrl" alt="">
              <div v-if="!item.abstracts || item.childMenuDetailsList.length" class="thumb-title">
                <p>{{item.title}}</p>
              </div>
            </div>
            <!--没有子图文 但有摘要-->
            <div class="abstract" v-if="item.abstracts && !item.childMenuDetailsList.length">
              <p class="ab-title">{{item.title}}</p>
              <p class="ab-abstract">{{item.abstracts}}</p>
            </div>
          </div>
          <!--存在子图文-->
          <div class="sub-list" v-if="item.childMenuDetailsList.length">
            <div class="sub-li" v-for="(subItem,i) in item.childMenuDetailsList" :key="i"
                 @click="jumpTo(subItem,$event)">
              <div v-if="showEditIcon" class="icons">
                <span style="color: white">&nbsp;{{subItem.isRelease==="1" ? '使用中': '未使用'}}</span>
                <span>
                                <i v-for="(iconItem,key) in subMenuIcon" :key="key" class="icon iconfont icon_z"
                                   :class="[`icon-${iconItem}`]" @click.stop="secondaryIcon(iconItem,index,i,subItem)">
                                </i>
                            </span>
              </div>
              <span class="sub-title">{{subItem.title}}</span>
              <span>
                            <img class="sub-img" :src="subItem.coverUrl" alt="">
                        </span>
            </div>
          </div>
          <div class="releaseTime">{{item.dataTime}}</div>
        </div>
      </div>
      <div style="padding: 20px;font-size: 18px;color: darkgrey;text-align: center"
           v-show="!graphicList.length && !showEditIcon">暂时没有发布图文消息
      </div>
    </scroll>
    <div class="dialogs" v-if="showEditIcon">
      <x-dialog class="moveArticle" v-model="copyDialogModal" make-z-index="1000" hide-on-blur>
        <p class="title">复制图文</p>
        <div class="c-name">
          <span>服务号</span>
          <selector class="selector" ref="plainValueRef"
                    :options="companyList" @on-change="companyChange">
          </selector>
        </div>
        <div class="menus" v-if="companyMenuList.length">
          <div class="nav-li" v-for="(items,index) in companyMenuList" :key="index">
            <group v-if="items.childMenuList && items.childMenuList.length">
              <cell :title="items.value" :is-link="items.childMenuList && items.childMenuList.length"
                    :border-intent="false"
                    :arrow-direction="setIsFold[index] ? 'down' : 'left'"
                    @click.native="collapseMenu(index,items.childMenuList)"
              >
              </cell>
              <div class="sub-nav" v-show="setIsFold[index]">
                <checklist :options="items.childMenuList" v-model="selectedMenu" :max="1"></checklist>
              </div>
            </group>
            <group v-if="!items.childMenuList || !items.childMenuList.length">
              <checklist :options="[items]" v-model="selectedMenu" :max="1"></checklist>
            </group>
          </div>
        </div>
        <div class="weui-dialog__ft" style="height: 40px;line-height: 40px;font-size: 16px">
          <a href="javascript:;" @click="cancelCopy" class="weui-dialog__btn weui-dialog__btn_default">取消</a>
          <a href="javascript:;" @click="confirmCopy" style="color: #ff8000" class="weui-dialog__btn">确定</a>
        </div>
      </x-dialog>
    </div>
  </div>
</template>
<script>
  import Scroll from "@/components/scroll/Scroll";
  import {XDialog, Selector, Group, Cell, Checklist, XButton,} from 'vux'

  export default {
    name: "graphic-list-comp",
    components: {
      XDialog, Selector, Group, Cell, Checklist, XButton, Scroll
    },
    props: {
      //是否显示编辑菜单,(由于前后端公用此组件,前端不显示菜单,加此控制器
      showEditIcon: {
        type: Boolean,
        default: function () {
          return false;
        }
      },
      //跳转去向:detail:图文详情阅读页, edit:图文编辑页
      jumpToWhere: {
        type: String,
        default: function () {
          return "detail";
        }
      },
      menuId: {
        type: String,
        default: function () {
          return "";
        }
      },
      companyId: {
        type: String,
        default: function () {
          return "";
        }
      },
      //图文类型
      type: {
        type: String,
        default: ""
      },
      //发布情况: "1":发布, "0":不发布, "":查询全部的
      isRelease: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        levelOneIcon: ["zhiding1", "zhiding-copy", "shangyi1", "xiayi1", "fuzhi", "shanchu1", "tianjia2"],
        subMenuIcon: ["shangyi1", "xiayi1", "shanchu1"],
        graphicList: [],        //图文列表数组
        companyList: [],
        companyMenuList: [],
        setIsFold: [],
        //复制图文参数
        copyDialogModal: false,
        targetCompany: {},
        targetDetailId: "",
        selectedMenu: [],
        //滑动加载参数
        pullUpLoad: {threshold: 10, txt: {more: '加载中...', noMore: ''}},
        pullDownRefresh: {threshold: 50, stop: 50, txt: '加载完成'},
        pageNumber: 0,
        pageSize: 5,
        total: 0,
      }
    },
    created() {
      this.requestData();
    },
    methods: {
      pullingUp() {
        if (this.graphicList.length >= this.total || this._isDestroyed) {
          this.$refs.scroll.forceUpdate();
          return;
        }
        let vm = this;
        setTimeout(() => {
          vm.pageNumber += 1;
          vm.requestData();
        }, 1000)
      },
      pullingDown() {
        if (this._isDestroyed) {
          return;
        }
        let vm = this;
        vm.pageNumber = 0;
        vm.graphicList = [];
        setTimeout(() => {
          vm.requestData();
        }, 1000)
      },
      requestData() {
        let vm = this;
        let url = "/zingbiz/tuwen/tuwenManage/getAllMenuDetailList";
        if (this.menuId) {
          url = "/zingbiz/tuwen/tuwenManage/getMenuDetailsByMenuId"
        }
        let params = {
          menuId: this.menuId,
          noticeType: this.type,
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          isRelease: this.isRelease
        }
        if (this.companyId) {
          params.companyId = this.companyId;
        }
        vm.$http
          .get(url, {params: params})
          .then(res => {
            if (res.data.success) {
              if (res.data.data.length) {
                vm.graphicList = [...vm.graphicList, ...res.data.data];
                // vm.graphicList = res.data.data;
                vm.total = Number(res.data.total);
              }
            }
          })
      },
      //一级图标
      clickIcon(iconType, index, item) {
        let vm = this;
        let saveList = JSON.parse(JSON.stringify(this.graphicList));    //副本数据
        let currentObj = saveList[index];
        switch (iconType) {
          case 'zhiding1':
            if (index <= 0) {
              vm.$vux.toast.text("已位于顶部", "bottom");
              return;
            }
            this.moveTopOrBottom(item, "1")
              .then((res) => {
                if (res.data.success) {
                  saveList.splice(index, 1);
                  saveList.unshift(currentObj);
                  vm.graphicList = saveList;
                  vm.$vux.toast.text("置顶成功", "bottom");
                } else {
                  vm.$vux.toast.text("置顶失败", "bottom");
                }
              });
            break;
          case 'zhiding-copy':
            if (index >= this.total - 1) {
              vm.$vux.toast.text("已位于底部", "bottom");
              return;
            }
            this.moveTopOrBottom(item, "2")
              .then((res) => {
                if (res.data.success) {
                  vm.$vux.toast.text("置底成功", "bottom");
                  vm.$nextTick(() => {
                    vm.pageNumber = 0;
                    vm.graphicList = [];
                    vm.requestData();
                  })
                  // saveList.splice(index, 1);
                  // saveList.push(currentObj);
                  // vm.graphicList = saveList;
                } else {
                  vm.$vux.toast.text("置底失败", "bottom");
                }
              });
            break;
          case 'shangyi1':
            if (index <= 0) {
              vm.$vux.toast.text("已位于顶部", "bottom");
              return;
            }
            this.moveUpOrDown(item, saveList[index - 1])
              .then(res => {
                if (res.data.success) {
                  // saveList[index] = saveList.splice(index - 1,1,saveList[index])[0];  //元素交換位置
                  // vm.graphicList = saveList;
                  vm.$vux.toast.text("设置成功", "bottom");
                  vm.$nextTick(() => {
                    vm.pageNumber = 0;
                    vm.graphicList = [];
                    vm.requestData();
                  })
                } else {
                  vm.$vux.toast.text("设置失败", "bottom");
                }
              });
            break;
          case 'xiayi1':
            if (index >= this.total - 1) {
              vm.$vux.toast.text("已位于底部", "bottom");
              return;
            }
            //当前索引位于数组最后一个,代表跨页,
            let num = null;
            let obj = null;
            if (index === saveList.length - 1) {
              num = this.pageNumber + 1;
            } else {
              obj = saveList[index + 1];
            }
            this.moveUpOrDown(item, obj, num)
              .then((res) => {
                if (res.data.success) {
                  // saveList[index] = saveList.splice(index + 1,1,saveList[index])[0];  //元素交換位置
                  // vm.graphicList = saveList;
                  vm.$vux.toast.text("设置成功", "bottom");
                  vm.$nextTick(() => {
                    vm.pageNumber = 0;
                    vm.graphicList = [];
                    vm.requestData();
                  })

                } else {
                  vm.$vux.toast.text("设置失败", "bottom");
                }
              });
            break;
          case 'fuzhi':
            this.initCompanyData()
              .then(res => {
                if (res.data.success) {
                  vm.companyList = vm.processCompany(res.data.data);
                  vm.copyDialogModal = true;
                  vm.targetDetailId = item.detailsId;
                } else {
                  vm.$vux.toast.text("请求数据失败", "bottom");
                }
              })
            break;
          case 'shanchu1':
            this.$vux.confirm.show({
              title: '提示',
              content: '确定删除吗？',
              onConfirm() {
                vm.delById(item.detailsId)
                  .then(res => {
                    if (res.data.success) {
                      vm.graphicList = vm.graphicList.filter(row => row.detailsId !== item.detailsId);
                      vm.$vux.toast.text("删除成功", "bottom");
                    } else {
                      vm.$vux.toast.text("删除失败", "bottom");
                    }
                  });
              }
            });
            break;
          case 'tianjia2':
            this.addSubNotice(item);
            break;
          default:
        }
      },
      addSubNotice(item) {
        this.$router.push({
          path: "/addGraphic",
          query: {
            parentId: item.detailsId,
            type: "0",
          },
        })
      },
      initCompanyData() {
        let vm = this;
        const promise = new Promise(function (resolve, reject) {
          let url = '/zingbiz/tuwen/tuwenManage/getCompanyWithMenuList';
          vm.$http
            .get(url)
            .then(res => {
              resolve(res);
            }).catch(err => {
            console.log("err", err);
          })
        });
        return promise;
      },
      processCompany(data) {
        let b = data.map(item => {
          let obj = {};
          obj.value = item.companyName;
          obj.key = {
            menuList: item.menuList || [],
            companyId: item.companyId,
          };
          return obj;
        });
        return b;
      },
      moveUpOrDown(item, old, pageNumber) {
        let vm = this;
        const promise = new Promise(function (resolve, reject) {
          let url = '/zingbiz/tuwen/tuwenManage/moveUpOrDown';
          let data = {
            srcInfo: {detailsId: item.detailsId, sortId: item.sortId},
            menuId: vm.menuId,
            noticeType: vm.type,
          };
          if (pageNumber) {
            data.pageNumber = pageNumber;
            data.pageSize = vm.pageSize;
          } else {
            data.tarInfo = {detailsId: old.detailsId, sortId: old.sortId};
          }

          vm.$http
            .post(url, data)
            .then(res => {
              resolve(res);
            })
            .catch(err => {
              console.log("err", err);
            })
        });
        return promise;
      },
      moveTopOrBottom(item, code) {
        let vm = this;
        const promise = new Promise(function (resolve, reject) {
          let url = '/zingbiz/tuwen/tuwenManage/moveTopOrButtom';
          let data = {
            detailsId: item.detailsId,
            code: code,
            menuId: vm.menuId,
            noticeType: vm.type,
          };
          vm.$http
            .get(url, {params: data})
            .then(res => {
              resolve(res);
            }).catch(err => {
            console.log("err", err);
          })
        });
        return promise;
      },
      //复制图文-折叠菜单
      collapseMenu(index, list) {
        this.$set(this.setIsFold, index, !this.setIsFold[index]);
      },
      companyChange(obj) {
        if (!obj.menuList || !obj.companyId) {
          return;
        }
        this.targetCompany = obj;
        let tempArr = [];
        for (let i = 0; i < obj.menuList.length; i++) {
          let item = obj.menuList[i];
          let flag = false;
          let one = {
            key: item.menuId,
            value: item.menuName,
          };
          if (item.childMenuList && item.childMenuList.length) {
            let subArr = [];
            for (let k = 0; k < item.childMenuList.length; k++) {
              let subItem = item.childMenuList[k];
              if (subItem.linkType !== "0") {
                continue;
              } else {
                flag = true;
                subArr.push({
                  key: subItem.menuId,
                  value: subItem.menuName
                })
              }
            }
            one.childMenuList = subArr;
          } else {
            if (item.linkType !== "0") {
              continue;
            } else {
              flag = true;
            }
          }
          if (flag) {         //自身以及子级只要有图文类型,即保留
            tempArr.push(one);
          }
        }
        this.companyMenuList = tempArr;
        // this.companyMenuList = obj.menuList.map((item, index) => {
        //     let obj = {
        //         key:item.menuId,
        //         value:item.menuName,
        //     };
        //     if (item.childMenuList && item.childMenuList.length) {
        //         obj.childMenuList = item.childMenuList.map(each => {
        //             let o = {
        //                 key: each.menuId,
        //                 value: each.menuName
        //             };
        //             return o;
        //         });
        //     } else {
        //         obj.childMenuList = [];
        //     }
        //     return obj
        // });
      },
      cancelCopy() {
        this.selectedMenu = [];
        this.copyDialogModal = false;
      },
      confirmCopy() {
        if (!this.selectedMenu.length) {
          return;
        }
        this.copyDialogModal = false;
        let vm = this;
        this.$vux.confirm.show({
          title: '提示',
          content: '确认要复制该图文消息吗？',
          onConfirm() {
            let url = '/zingbiz/tuwen/tuwenManage/copyTuwenDetails';
            let parmas = {
              detailId: vm.targetDetailId,
              tarCompanyId: vm.targetCompany.companyId,
              tarMenuId: vm.selectedMenu.join(','),
            };
            vm.$http
              .post(url, parmas)
              .then(res => {
                if (res.data.success) {
                  vm.$vux.toast.text("复制成功", "bottom");
                } else {
                  vm.$vux.toast.text("复制失败", "bottom");
                }
              }).catch(err => {
              console.log("err", err);
            })
          }
        })
      },
      delById(id) {
        let vm = this;
        const promise = new Promise(function (resolve, reject) {
          let url = '/zingbiz/tuwen/tuwenManage/delMenuDetails';
          vm.$http
            .get(url, {params: {detailsId: id}})
            .then(res => {
              resolve(res);
            }).catch(error => {
            console.log(error);
          })
        });
        return promise;
      },
      change(key, val) {
        console.log(key, val);
      },
      jumpTo(item, e) {
        if (this.jumpToWhere === "detail") {
          this.$router.push({
            path: "/webEdit/article",
            query: {
              detailsId: item.detailsId,
              companyId: this.companyId,
            },
          })
        } else if (this.jumpToWhere === "edit") {
          this.$router.push({
            path: "/addGraphic",
            query: {
              detailsId: item.detailsId,
              type: item.noticeType,
            },
          })
        }
      },
      secondaryIcon(type, indexs, i, item) {
        let vm = this;
        let subListData = this.graphicList[indexs].childMenuDetailsList;
        switch (type) {
          case 'shangyi1':
            if (i <= 0) {
              vm.$vux.toast.text("已位于顶部", "bottom");
              return;
            }
            this.moveUpOrDown(subListData[i], subListData[i - 1])
              .then(res => {
                if (res.data.success) {
                  subListData[i] = subListData.splice(i - 1, 1, subListData[i])[0];  //元素交換位置
                  vm.graphicList[indexs].childMenuDetailsList = subListData;
                  vm.$vux.toast.text("设置成功", "bottom");
                } else {
                  vm.$vux.toast.text("设置失败", "bottom");
                }
              });
            break;
          case 'xiayi1':
            if (i >= subListData.length - 1) {
              vm.$vux.toast.text("已位于底部", "bottom");
              return;
            }
            this.moveUpOrDown(subListData[i], subListData[i + 1])
              .then(res => {
                if (res.data.success) {
                  subListData[i] = subListData.splice(i + 1, 1, subListData[i])[0];  //元素交換位置
                  vm.graphicList[indexs].childMenuDetailsList = subListData;
                  vm.$vux.toast.text("设置成功", "bottom");
                } else {
                  vm.$vux.toast.text("设置失败", "bottom");
                }
              });
            break;
          case 'shanchu1':
            this.$vux.confirm.show({
              title: '提示',
              content: '确定删除吗？',
              onConfirm() {
                vm.delById(item.detailsId)
                  .then(res => {
                    if (res.data.success) {
                      vm.graphicList[indexs].childMenuDetailsList = vm.graphicList[indexs].childMenuDetailsList.filter(row => row.detailsId !== item.detailsId);
                      vm.$vux.toast.text("删除成功", "bottom");
                    } else {
                      vm.$vux.toast.text("删除失败", "bottom");
                    }
                  });
              }
            });
            break;
          default:
        }
      },
    }
  }
</script>
<style>
  .nav-li .weui-cell_access {
    color: #FFFFFF !important;
    background-color: #ff8000 !important;
  }

  body .weui-cells:after {
    border: none;
  }

  .graphicListComp .scroll-content {
    width: 100%;
  }
</style>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../../assets/stylus/mixin.styl';
  .continer, .info-list {
    height: 100%;
    width: 100%;
    overflow: auto;
    background-color: #eaeaea;
    .info-list {
      .info-li {
        margin: 10px;
        .article {
          .img-box {
            height: 200px;
            position: relative;
            .thumb-img {
              width 100%;
              height 100%;
            }
          }
        }
        .abstract {
          padding: 10px;
          background-color: white;
          .ab-title {
            text-ellipsis(nowrap, ellipsis)
          }
          .ab-abstract {
            font-size: 12px;
            color: grey;
            padding: 5px 0;
            line-height: 20px;

            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3; //文本行数
            overflow: hidden;
          }
        }
        .releaseTime {
          display: flex;
          flex-direction: row-reverse;
          padding: 5px 0;
          color: grey;
          font-size: 12px;
        }
        .sub-list {
          .sub-li {
            height: 70px;
            flex-center(row, space-between, center)
            background-color: white;
            border-top: 1px solid #d8d8d8;
            position: relative;
            .icons {
              bottom: 0;
            }
            .sub-title {
              overflow: hidden;
              line-height: 25px;
              padding: 0 10px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
            }
            .sub-img {
              margin-right: 10px;
              height: 50px;
              width: 50px;
            }
          }
        }
        .icons, .thumb-title {
          position: absolute;
          width 100%;
          padding: 5px;
          color #FFFFFF;
          background-color: rgba(151, 151, 151, 0.5);
          line-height: 25px;
        }
        .icons {
          height 25px;
          flex-center(row, space-between, center)
          .icon_z {
            font-size 20px;
            margin: 0 5px;
          }
        }
        .thumb-title {
          bottom: 0;
        }
        .thumb-title p {
          min-height: 25px;
          max-height: 50px;
          text-ellipsis(normal, ellipsis);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
    .moveArticle {
      .c-name, .nav-li, .title {
        border-bottom 1px solid #e6e6e6
      }
      .title {
        height: 35px;
        line-height: 35px;
        font-size: 16px;
      }
      .selector {
        display: inline-block
      }
      .selector:before {
        border: none;
      }
      .menus, .sub-nav {
        padding: 0 10px;
      }
    }
  }
</style>
