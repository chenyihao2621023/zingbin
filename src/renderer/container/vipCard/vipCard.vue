<template>
  <div>
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-active="deful" open="setting"  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse"   :router="true"  >
          <el-submenu index="setting" >
            <template slot="title" >
              <i class="el-icon-setting"></i>
              <span slot="title">会员卡设置</span>
            </template>
              <el-menu-item index="cardManage">会员卡管理</el-menu-item>
              <el-menu-item index="hierarchy">等级设置</el-menu-item>
              <el-menu-item index="customer">客户管理</el-menu-item>
              <el-menu-item index="tagManage">标签管理</el-menu-item>
              <el-menu-item index="exchange">交易明细</el-menu-item>
              <el-menu-item index="addMember">注册新会员</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

  <el-container>

     <router-view/>

  </el-container>

</el-container>
  </div>
</template>


<script>

export default {
  data() {
    return {
      list: [],
      deful:"cardManage",
      isCollapse: false

    };
  },
  created() {

  },
    beforeRouteEnter (to, from, next) {
        next(vm => {
            let paths = to.path.split("/")
            vm.deful = paths[(paths.length-1)]
        })
    },
  methods: {
     handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
  }
};
</script>


<style >

 .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
  height:800;
}

/* col */
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

/* 左侧菜单高 todo:自适应 */
.el-menu.el-menu-vertical-demo{
  height:800px;
}
</style>
