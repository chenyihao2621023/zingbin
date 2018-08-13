<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
    :render-header="testRender3"
    >
    <el-table-column
      fixed
      prop="date"
      label="日期"
      width="150"
      :render-header="testRender"
      >
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="120"
      :render-header="testRender2"
      >
    </el-table-column>
    <el-table-column
      prop="province"
      label="省份"
      width="120"
      :render-header="testRender3"
      >
    </el-table-column>
    <el-table-column
      prop="city"
      label="市区"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      width="300">
    </el-table-column>
    <el-table-column
      prop="zip"
      label="邮编"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    methods: {
      handleClick(row) {
        console.log(row);
      },
      testRender(h){
        return h('el-tooltip', {
        attrs: {
          effect: 'dark',
          content: 'Top Left 提示文字',
          placement: 'top-center'
        }
      }, [h('el-button', ['提示'])])
      },
      testRender2(h){
        return h('el-input', {
        attrs: {
          placeholder: '自定义内容',
          
        }
      })
      },
      testRender3(h){
        return h('el-progress', {
        attrs: {
          textInside: 'true',
          strokeWidth: '18',
          percentage: '100',
          status: 'success',
        }
      })
      }
    },
    render: {
      
      

    },

    data() {
      return {
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-02',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-04',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }, {
          date: '2016-05-01',
          name: '王小虎',
          province: '上海',
          city: '普陀区',
          address: '上海市普陀区金沙江路 1518 弄',
          zip: 200333
        }]
      }
    }
  }
</script>