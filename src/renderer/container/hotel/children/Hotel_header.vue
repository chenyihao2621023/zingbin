<!-- 酒店管理：头部组件 -->
<!-- props:  :select="true":开启下拉  :search="true":开启右侧搜索  placeholder:搜索placeholder自定义值-->
<!-- @dropdownItemClick 右侧下拉点击回调(dropDown 点击的 item 的值) -->
<!-- title="xxxx"： 在左侧为header添加标题  -->

<template>
  <div> 
    <span class="headerTitle" v-show="title !== ''">{{title}}</span>
    <el-select v-model="selectValue" placeholder="请选择" @change="selectChange" v-show="select">
      <el-option    v-for="item in _hotelList" :key="item" :value="item" >
        {{item}}
      </el-option>
    </el-select>

    <el-input v-show="search" size="small" style="width:180px;float:right" :placeholder="searchPlaceholder" v-model="inputValue"
      @change="change" v-on:keyup.enter="searchEvent">
      <i v-on:click="searchEvent" slot="suffix" class="el-icon-search el-icon-date"></i>
    </el-input>

    <el-dropdown trigger="click" style="float:right;margin-right:120px" v-show="plus" @command="dropdownItemClick">
      <span class="el-dropdown-link" >
        <el-button type="primary"  >更多操作</el-button>
        <!-- <i class="el-icon-plus" style="font-size: 25px; font-weight: 700"></i> -->
      </span>
      <el-dropdown-menu slot="dropdown">
        <span v-for="sv in selectList" v-bind:key="sv">
          <el-dropdown-item :command="sv">{{sv}}</el-dropdown-item>
        </span>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>


<script>
  import {
    mapState,
    mapMutations,
    mapActions
  } from 'vuex'
  import _ from "lodash";
  export default {
    created() {
      // console.log('roomList'+roomList);
      
    },
    props: {
      select: {
        type: Boolean,
        default: false
      },
      search: {
        type: Boolean,
        default: false
      },
      searchPlaceholder: {
        type: String,
        default: '搜索房间'
      },
      selectList: {
        type: Array,
        default() {
          return []
        }
      },
      roomList: {
        type: Array,
        default: null
      },
      plus: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        selectValue : '全部楼栋',
        inputValue : ''
      }
    },
    methods: {
      ...mapActions({ //触发异步操作
        searchHotelAcion: 'searchHotelAcion'

      }),
      
      change(value) {
        if (this.value) {
          this.inputValue = value;

        }
      },
      searchEvent() {
        console.log('search key : ' + this.inputValue)
        this.searchHotelAcion({params:{hotelRoom:this.inputValue,pageNumber:'1',pageSize:'100'}})
      },
      selectChange(value) {
        console.log('selectChange key : ' + value)
        this.searchHotelAcion({params:{hotelBlock:value,pageNumber:'1',pageSize:'100'}})
      },
      dropdownItemClick(itemName) {
        console.log('this.$emit')
        this.$emit('dropdownClickEvent', itemName)
      }
    },
    computed: {
    ...mapState({
      _hotelList: state => {
        let uniqBlock = []
        uniqBlock.push('全部楼栋')
        _.each(state.hotel.hotelList,function(v){ uniqBlock.push(v.hotelBlock) })

        return _.uniq(uniqBlock)
      }
    }),
    }
  };
</script>

<style scoped>
  .headerTitle {
    font-size: 17px
  }
</style>