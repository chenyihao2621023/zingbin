<template>
    <el-container>
        <el-aside style="width: 200px">
            <finance-tree :treeData="testTreeData" @handleNodeClick="handleNodeClick" @editCallback="editCallback" @addCallback="addCallback" @delCallback="delCallback" ref="tree"></finance-tree>
        </el-aside>
        <el-container>
            <el-main>
                <el-header class="padding">
                    会计期间设置
                    <el-select v-model="value" placeholder="请选择" style="width: 100px;" @change="changeSelect">
                        <el-option
                                v-for="item in periodSet"
                                :key="item.text"
                                :label="item.text"
                                :value="item.text">
                        </el-option>
                    </el-select>
                </el-header>
                <el-table :data="periodList" border v-loading="showLoading" max-height="500"
                          style="width: 100%" @current-change="selListItem" highlight-current-row>
                    <el-table-column prop="period" label="会计期间"></el-table-column>
                    <el-table-column prop="startDate" label="开始日期"></el-table-column>
                </el-table>
                <el-pagination background @current-change="currentPage" :page-size="pageSize"
                               layout="total, prev, pager, next" :total="total" style="float:right"></el-pagination>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import FinanceTree from '../componets/FinanceTree.vue'
    export default {
        components: {
            FinanceTree,
        },
        data() {
            return {
                periodSet: [],
                value: '',
                periodList: [],
                testTreeData: [],
                showLoading: true,
                currentRow: null,
                pageSize: 20,
                total: 0,
                pageNumber: 2,
            }
        },
        computed: {},
        created() {
            //this.init();
            this.initTree();
        },
        methods: {
            init(data) {
                this.periodList = []
                let length = 12;
                for (let i = 1; i <= length; i++) {
                    let month = data + '-' + i + '-1';
                    this.periodList.push( { "period":i,"startDate":month } )
                }
                this.total = length
            },
            initTree () {
                let tree = [];
                let zero = {
                    "id": "000",
                    "parentId": "0000",
                    "text": "会计期间",
                    "leaf": "",
                    "companyId": "company41860418100001",
                    "recordType": "measureUnit",
                    "checkable": "false",
                    "default": "",
                    "fileId": "000"
                };
                tree.push(zero);
                let time = new Date();
                let year = time.getFullYear();
                for (let i = 2010; i <= year; i++) {
                    let date_i = {
                        "id": "001",
                        "parentId": "000",
                        "text": i,
                        "leaf": "",
                        "companyId": "company41860418100001",
                        "recordType": "measureUnit",
                        "isdel": "",
                        "checkable": "false",
                        "fileId": "001"
                    };
                    this.showLoading = false;
                    this.periodSet.push(date_i)
                    tree.push(date_i);
                }
                this.arrayToTreeJsonFuc('parentId', 'fileId', 'children',tree)
            },
            //会计区间设置
            changeSelect(val) {
                this.init(val)
            },
            handleNodeClick(data) { // 点击树节点回调
                if (data.indeterminate.level !== 1) {
                    this.value = data.data.text
                    this.init(data.data.text)
                }
                // this.init()
            },
            editCallback(data) { // 此处调用服务端各个模块update接口
                setTimeout(() => {
                    this.$refs.tree.edit()  //服务端返回success 调用edit
                }, 500)
            },
            addCallback(data) { // 此处调用服务端各个模块update接口
                console.log(data)
                setTimeout(() => {
                    this.$refs.tree.add()  //服务端返回success 调用edit
                }, 500)
            },
            delCallback(data) { // 此处调用服务端各个模块update接口
                console.log(data)
                setTimeout(() => {
                    this.$refs.tree.delete()  //服务端返回success 调用edit
                }, 500)
            },
            selListItem(val) {
                this.currentRow = val;
            },
            currentPage(val) {
                console.log(val);
                this.pageNumber = val;
                this.showLoading = true;
                this.initData();
            },
            arrayToTreeJsonFuc(prIndex, index, home, db) {
                let allPrIndexData = {}; // 所有集合+上级索引, key = prIndex / value = [db[n],db[x].........]
                let tree = []; // 树
                for (let i = 0; i < db.length; i++) { // 第一次生成数据
                    //db[i].label = db[i].text;
                    let t = db[i]; // 一个数据单位
                    let prValue = db[i][prIndex];
                    if (prValue === '0000') { // 我是顶级节点
                        tree.push(t);
                    } else {
                        let ts = allPrIndexData[prValue]; // 上级的孩子们
                        if (ts == null) {
                            ts = [];
                            allPrIndexData[prValue] = ts; // 上级没孩子 给孩子创建临时居所
                        }
                        ts.push(t);// 孩子会和
                    }
                }
                for (let i = 0; i < db.length; i++) { // 第二次组装数据
                    let t = db[i]; // 一个数据单位
                    let value = db[i][index]; // index （key）
                    let ts = allPrIndexData[value]; // 我的孩子
                    if (ts != null) {
                        t[home] = ts; //回家
                    }
                }
                this.testTreeData = tree;
            }
        }
    }
</script>
<style scoped lang="stylus">
    .padding {
        padding: 10px;
    }

    .showNum {
        display: flex;
        justify-content: space-between;
    }
</style>
