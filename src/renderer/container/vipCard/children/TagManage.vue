<template>
    <el-container>
        <el-main>
            <el-row :gutter="20">
                <el-col :span="2">&nbsp;</el-col>
                <el-col :span="20">
                    <div>
                        <el-button type="primary" @click="dialogFormVisible = true;form.labelName=''">添加标签</el-button>
                        <br>
                        <el-col :span="24" style="padding:10px">
                            <div style="padding:10px;">手动标签</div>
                            <hr>
                            <el-row :gutter="30">

                                <el-col :span="6" v-for="(tag,index) in tagArray" :key="index">
                                    <div class="manual-tag">
                                        <div class="manual-tag-top" style="position: relative;" >
                                            <div class="tag-button-top"  @click="tagEdit(tag)"><i class="el-icon-edit" style="font-size: 20px;margin-left: 10px;margin-top: 3px"></i></div>
                                            <div class="tag-button-bottom" @click="tagDelete(tag,index)"><i class="el-icon-delete" style="font-size: 20px;margin-left: 10px;margin-top: 3px" ></i></div>
                                            <div style="position: relative;top: 15px;left: 15px;width:65%;word-break: break-all"> {{tag.labelName}}</div>
                                        </div>
                                        <div class="text-center" style="height:30px">人数:{{tag.labeNumber}}人</div>
                                    </div>

                                </el-col>


                            </el-row>
                            <br>
                            <div style="padding:10px;">条件标签</div>
                            <hr>
                            <br>
                        </el-col>
                        </div>
                </el-col>
                <el-col :span="2"></el-col>
            </el-row>
        </el-main>



        <el-dialog title="修改标签" :visible.sync="dialogEditFormVisible">
        <el-form :model="form">
            <el-form-item label="标签名称" >
                 <el-col :span="12">
                    <el-input v-model="currentTag.labelName"  auto-complete="off"></el-input>
                 </el-col>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogEditFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="edit">确 定</el-button>
        </div>
        </el-dialog>

        <el-dialog title="添加标签" :visible.sync="dialogFormVisible">
        <el-form :model="form">
            <el-form-item label="标签名称" >
                 <el-col :span="12">
                    <el-input v-model="form.labelName"  auto-complete="off"></el-input>
                 </el-col>
            </el-form-item>
            <el-form-item label="标签类型" >
                <el-col :span="12">
                     <el-radio-group>
                        <el-switch v-model="form.tagType"  active-text="根据交易自动打标签" inactive-text="手动打标签"> </el-switch>
                    </el-radio-group>
                </el-col>
            </el-form-item>
            <el-form-item label="说明：" v-show="form.tagType">
                     <!-- <el-radio-group  >
                        <el-radio label="满足一个条件即可"></el-radio>
                        <el-radio label="所勾选想必须全部满足"></el-radio>
                     </el-radio-group> -->
                     逐渐研发中，目前仅支持手动标签
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </div>
        </el-dialog>

    </el-container>
</template>
<script>
    export default {
        data() {
            return {
                tagArray: [],
                currentTag: {},
                dialogFormVisible: false,
                dialogEditFormVisible: false,
                form: {
                    labelName: '',
                    tagType: false,// 目前仅支持手动标签
                },
                formLabelWidth: '120px'
            }
        },
        created() {
            this.init();
        },
        methods: {
            init(){
                let url = '/zingbiz/member/memberService/loadMemberlabelbylabelId'
                this.$http.post(url, {}).then(res => {
                    console.log(res)
                    if (res.data.success) {
                        this.tagArray = res.data.data.data
                    } else {
                        this.$message({ type: "error", message: "加载数据失败，请重试" });
                    }
                });
            },
            tagEdit(tag){
                this.dialogEditFormVisible = true
                this.currentTag = tag
            },
            edit(){
                let data = this.currentTag
                if (data.labelName.trim().length > 25) {
                    this.$message({type: "warning", message: "标签名称过长，最多可输入25个字符"});
                    return false
                }
                data.labelName = data.labelName.trim()
                let url = '/zingbiz/member/memberService/updateLabel'
                        this.$http.post(url, data).then(res => {
                            console.log(res)
                            if (res.data.success) {
                                this.tagArray = res.data.data.data
                            } else {
                                this.$message({ type: "error", message: "加载数据失败，请重试" });
                            }
                        });
                        this.dialogEditFormVisible = false

            },
            tagDelete(tag,index){
                this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    let url = '/zingbiz/member/memberService/delMemberLabel'
                        this.$http.post(url, tag).then(res => {
                            if (res.data.success) {
                                this.$message({ type: "success", message: "删除标签成功" });
                                this.tagArray.splice(index,1)
                            } else {
                                this.$message({ type: "error", message: "删除失败，请重试" });
                            }
                        });
                }).catch(() => {

                });


            },
            submit(){
                let that = this
                let url = '/zingbiz/member/memberService/addMemberLabel'
                if (this.form.labelName.trim().length > 25) {
                    this.$message({type: "warning", message: "标签名称过长，最多可输入25个字符"});
                    return false
                }
                this.$vux.loading.show({
                    text: ''
                })
                this.form.labelName = this.form.labelName.trim()
                this.$http.post(url, this.form).then(res => {
                    if (res.data.success) {
                        setTimeout(function(){
                            that.$message({ type: "success", message: "添加标签成功" });
                            that.init()
                            that.$vux.loading.hide()
                        },500)
                    } else {
                        that.$message({ type: "error", message: "添加失败，请重试" });
                        that.$vux.loading.hide()
                    }
                });
                that.dialogFormVisible = false
            }
        },
    }

</script>
<style scoped>
    .text-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .manual-tag {
        background-color: #fff;
        height: 130px;
        border: 1px solid rgb(161, 167, 165);
        margin-top: 10px
    }
    .manual-tag-top {
        background-color:rgb(73, 241, 199);
        height:100px
    }

    .tag-button-top {
        position:absolute;
         right: 10px;
         top: 15px;
         width: 40px;
         height: 40px;
    }

    .tag-button-bottom {
        position:absolute;
         right: 10px;
         top: 50px;
         width: 40px;
         height: 40px;
    }

</style>
