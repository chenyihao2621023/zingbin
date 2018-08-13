<template>
    <el-container>
        <el-main class="flex-column">
            <div class="padding">
                <a id="downlink"></a>
                <span>日期：{{dateTime}}</span>
                <el-button type="primary" size="mini" @click="downloadExl(tableData)">导出</el-button>
            </div>
            <div class="table">
                <el-table id="tableExcel" style="width: 100%;" height="100%" :data="tableData" border v-loading="showLoading" :span-method="objectSpanMethod">
                    <el-table-column prop="roomNo" label="房间号" width="100"></el-table-column>
                    <el-table-column prop="contactsName" label="姓名" width="100"></el-table-column>
                    <el-table-column prop="gender" label="性别" width="60"></el-table-column>
                    <el-table-column prop="idCard" label="身份证号码" width="170"></el-table-column>
                    <el-table-column prop="telPhone" label="手机号" width="170"></el-table-column>
                    <el-table-column prop="remark" label="前台备注"></el-table-column>
                </el-table>
            </div>
            <div class="flex-right">
                <el-select v-model="value" placeholder="请选择显示条目" @change="selPageSize" size="mini">
                    <el-option v-for="item in pageSizes" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <el-pagination background layout="prev, pager, next" @current-change="pageChange"
                               :page-size="pageSize" :total="total">
                </el-pagination>
            </div>
        </el-main>
        <div>
            <el-dialog title="提示" :visible.sync="errorDialog" size="tiny">
                <span>{{errorMsg}}</span>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="errorDialog=false">确认</el-button>
                </span>
            </el-dialog>
        </div>
    </el-container>
</template>

<script>
    import { dateFormat } from '../../../utils/date';
    import XLSX from 'xlsx'
    const wopts = { bookType: 'xlsx', bookSST: true, type: 'binary' };

    export default {
        components: {},
        data() {
            return {
                showLoading:true,
                dateTime:null,

                pageNumber: 1,
                pageSize: 30,
                pageSizes: [
                    { value: 30, label: '每页显示30条' },
                    { value: 50, label: '每页显示50条' },
                    { value: 100, label: '每页显示100条' },
                ],
                value: 30,
                total: 0,
                tableData:[],
                fullscreenLoading: false, // 加载中
                outFile: '',  // 导出文件el
                errorDialog: false, // 错误信息弹窗
                errorMsg: '', // 错误信息内容
                orderRoomObj:{},
                ObjKey:{},
                mergeLen:[]
            }
        },
        created() {
            this.Time = setInterval(() => {
                this.showTime()
            }, 1000);
            this.initData();
        },
        mounted () {
            this.outFile = document.getElementById('downlink')
            this.showTime();
        },
        beforeDestroy() {
            clearInterval(this.Time);
        },
        methods: {
            showTime() {
                this.dateTime = dateFormat(new Date())
            },
            initData() {
                let url = "/zingbiz/hotel/hotelNew/getInRoomHotelGuestList";
                let queryParams = {
                    pageNumber:this.pageNumber,
                    pageSize:this.pageSize
                };
                this.$httpSilent
                    .get(url,{ params:queryParams })
                    .then((res) => {
                        if (res.data.success) {
                            this.showLoading = false;
                            this.tableData = res.data.data;
                            this.ObjKey = this.getCount(res.data.data);
                        }
                    })
                    .catch(() => {
                        this.showLoading = false;
                        this.$message({ type: "error", message: "列表数据加载失败，请刷新重试" });
                    })
            },
            //分页
            pageChange(val) {
                this.pageNumber = val;
                this.showLoading = true;
                this.loadList();
            },
            //分页条目选择
            selPageSize(val) {
                this.pageSize = val;
                this.showLoading = true;
                this.tableData = [];
                this.loadList();
            },

            getCount(arr) {
                arr.map((item,index) => {
                    let k = item.orderRoomId;
                    if (this.orderRoomObj[k]) {
                        this.orderRoomObj[k].push(item)
                    } else {
                        this.orderRoomObj[k] = [item]
                        this.$set(this.orderRoomObj[k],"index",index)
                    }
                });
                return this.orderRoomObj
            },

            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if ((columnIndex === 0) || (columnIndex === 5)) {
                    let Len = this.ObjKey[row.orderRoomId];
                    this.mergeLen = Len;
                    if (rowIndex === Len["index"]) {
                        return { rowspan: Len.length, colspan: 1 };
                    }
                    else {
                        return { rowspan: 0, colspan: 0 };
                    }
                }
            },

            saveAs(obj, fileName) {
                let tmpa = document.createElement("a");
                tmpa.download = fileName || "下载";
                tmpa.href = URL.createObjectURL(obj);
                tmpa.click();
                setTimeout(function () {
                    URL.revokeObjectURL(obj);
                }, 100);
            },

            downloadExl(data, type) {
                let wb = { SheetNames: ['Sheet1'], Sheets: {}, Props: {}};
                data = XLSX.utils.table_to_sheet(tableExcel,{ raw:true });
                data["!cols"] = [{ width:10 },{ width:10 },{ width:6 },{ width:20 },{ width:20 },{ width:30 }];
                wb.Sheets['Sheet1'] = data;
                this.saveAs(new Blob([this.s2ab(XLSX.write(wb, wopts))], { type: "application/octet-stream" }), "在住宾客列表" + '.' + (wopts.bookType === "biff2" ? "xls" : wopts.bookType));
            },

            s2ab(s) {
                if (typeof ArrayBuffer !== 'undefined') {
                    let buf = new ArrayBuffer(s.length);
                    let view = new Uint8Array(buf);
                    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                } else {
                    let buf = new Array(s.length);
                    for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
            }
        }
    }
</script>
<style scoped lang="stylus">
    .table{
        height :100%
    }
    .padding {
        padding: 0 0 10px 0;
    }
</style>
