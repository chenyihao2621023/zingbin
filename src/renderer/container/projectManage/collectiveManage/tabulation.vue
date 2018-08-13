<template>
    <div class="tabulationWrap">
            <el-select v-model="value8" filterable placeholder="查找">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
    </div>
</template>
<script>
  export default{
      components: {
      },
      data() {
          return {
              value8: '',
              labels:[],
          }
       },
      computed:{
          options() {
              var arr = []
              var labels = this.labels
              for (var i=0; i < labels.length;i++){
                  var label = {}
                  label.label = labels[i].title
                  label.value = i
                  arr.push(label)
              }
              return arr
          }

      },
      mounted(){
          this._getUserInfo()
      },
      methods:{
          _getUserInfo(){
              let url = "/ZingMH/ZDesk/board/mater/loadBoardByUser.action"
              let params = {
                  tag:"trello",
                  pageNumber:1,
                  pageSize:10
              }
              this.$http.get(url,{params:params})
                  .then(res => {
                   this.labels = res.data.data[0].data
                      console.log(this.labela)
                      })
                  .catch(err => {
                      this.$message({ message: "失败！", type: "error" });
                  })
          }
      },

  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
    .el-select>.el-input
      margin 30px
    .el-select-dropdown__item
       border-bottom 1px solid rgba(7, 51, 75, 0.65)
       border-radius 5px
       height 40px
       line-height 40px
       background-color rgba(51, 169, 199, 0.36)
       margin-bottom 2px
</style>
