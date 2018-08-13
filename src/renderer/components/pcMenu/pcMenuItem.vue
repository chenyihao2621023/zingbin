<template>
  <div class="pc-menu-item">
    <template v-if="item.isShow" v-for="(item,index) in routes">
        <div v-if="!item.children">
          <el-menu-item :index="item.name" @click="gotoPage(item)" :key="index">
            <i v-if="item.icon" :class="item.icon"></i>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
        </div>

        <div v-else>
          <el-submenu :index="item.name" :key="index">
            <template slot="title">
              <i v-if="item.icon" :class="item.icon"></i>
              <span slot="title">{{item.title}}</span>
            </template>
            <template v-if="child.isShow" v-for="(child,cindex) in item.children">
              <pc-menu-item class="nest-menu" v-if="child.children && child.children.length>0"
                            :routes="[child]" :key="cindex"></pc-menu-item>
              <el-menu-item v-else :index="child.name" :key="cindex" @click="gotoPage(child)">
                <i v-if="child.icon" :class="child.icon"></i>
                <span slot="title">{{child.title}}</span>
              </el-menu-item>
            </template>
          </el-submenu>
        </div>
    </template>
  </div>
</template>

<script>


export default {
    name: 'pcMenuItem',
    props: {
        routes: {
            type: Array
        },
        resObj:{}
    },
    data() {
        return {}
    },
    computed: {},
    watch: {
        routes() {
            this.routes.forEach(menu => {//必须在item中监听menu的变化，在父模板中不起作用
                if(menu.name === "6") {
                    if (this.resObj["orderManagePower"]) {
                        this.$set(menu, "isShow", true); //父类权限
                        menu.children.forEach(child => {//子类权限
                            if(child.name === "deskList"){
                                if (this.resObj["orderAndBillPower"]) {
                                    this.$set(child, "isShow", true);
                                }
                            }else if(child.name === "dinnerManage"){
                                if (this.resObj["foodManagePower"]) {
                                    this.$set(child, "isShow", true);
                                }
                            }else if(child.name === "printerManager"){
                                if (this.resObj["printerManagePower"]) {
                                    this.$set(child, "isShow", true);
                                }
                            }else if(child.name === "tagManager"){
                                if (this.resObj["labelSettingPower"]) {
                                    this.$set(child, "isShow", true);
                                }
                            }else if(child.name === "deskManager"){
                                if (this.resObj["tableManagePower"]) {
                                    this.$set(child, "isShow", true);
                                }
                            }else if(child.name === "dinnerClazz"){
                                if (this.resObj["classifyManagePower"]) {
                                    this.$set(child, "isShow", true);
                                }
                            }
                        })
                    }
                }
                if(menu.name === "7") {
                    if ( this.resObj["hotelManagePower"]) {
                        this.$set(menu, "isShow", true);
                    }
                }
            })
        }
    },
    created() {},
    methods: {
        gotoPage(item) {
            if (item.url.indexOf("SRender?jsLoader") >= 0) {
                location.href = item.url
            } else if (item.url === "TISHI") {
                this.$vux.alert.show({
                    title: '提示',
                    content: '维护中...',
                })
            } else {
                this.$router.push({ path: item.url });
            }
            this.$emit("leftMenuShow",item.url)
        },
    }
}
</script>
