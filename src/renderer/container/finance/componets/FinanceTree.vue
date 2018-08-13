<template>

    <div class="block">
        <el-tree :default-expand-all="treeState" :data="treeData" node-key="fileId" :default-expanded-keys="treeOpenKey" :auto-expand-parent="true" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <div class="" style="width:100%">
                    <span>{{ node.label }}</span>
                    <span style="float:right" v-if="data.editAuto">
                        <i class="el-icon-edit-outline" type="text" size="mini" @click="editTreeNode(data)"> </i>
                        <i class="el-icon-delete" type="text" size="mini" @click="delTreeNode(node,data)"> </i>
                    </span>
                    <span style="float:right" v-if="data.addAuto">
                        <i class="el-icon-plus" type="text" size="mini" @click="addTreeNode(data)"> </i>
                    </span>
                </div>
            </span>
        </el-tree>
        <!-- Form -->

<el-dialog title="添加" :visible.sync="dialogFormAdd" >
    <div>
        <el-form :inline="true" :model="form" :rules="rules" ref="form">

            <el-col :span="24">
                <el-col :span="15">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" placeholder="名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="15">
                    <el-form-item label="编码" prop="code">
                        <el-input v-model="form.code" placeholder="编码"></el-input>
                    </el-form-item>
                </el-col>

            </el-col>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormAdd = false">取 消</el-button>
            <el-button type="primary" @click="dialogFromSubmit('form')">确 定</el-button>
        </div>
    </div>

</el-dialog>

<el-dialog title="修改" :visible.sync="dialogFormEdit">
  <el-form :inline="true" :model="form" :rules="rules" ref="form">
                <el-col :span="24">
                                <el-col :span="15">
                                    <el-form-item label="名称" prop="name">
                                        <el-input v-model="form.name" placeholder="名称"></el-input>
                                    </el-form-item>
                                </el-col>
                </el-col>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormEdit = false">取 消</el-button>
    <el-button type="primary" @click="dialogFromEdit('form')">确 定</el-button>
  </div>
</el-dialog>


    </div>
</template>

<script>


/**@description 财务树组件
 * @author sis.nonacosa
 *  :treeData="testTreeData" 初始化树的数据 : addAuto：添加权限 editAuto:编辑权限  delAuto:删除权限
 *  @handleNodeClick="handleNodeClick" 点击节点回调函数
 *  @editCallback="editCallback" 删除回调函数 | 服务端返回success后调用 $refs.xxx.edit()实现vue树的更新
 *  @addCallback="addCallback" 添加回调函数 | 服务端返回success后调用 $refs.xxx.add()实现vue树的更新
 *  @delCallback="delCallback"  删除回调函数 |  服务端返回success后调用 $refs.xxx.del()实现vue树的更新
 *  在回调函数内实现与服务端的交互，组件不实现，因为所有增删改查服务端接口不是固定的
 *  若服务端返回error $.message()在自己页面实现即可
 *
 */

    export default {
        props: {

            treeData: {
                type: Array,
                default: function () {
                    return []
                }
            },
            treeState:{
                type: Boolean,
                default: false
            },
            treeOpenKey:{
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                oldData: {},
                dialogFormAdd: false,
                dialogFormEdit: false,
                form: {
                    name:'',
                    code:''
                },
                rules: {
                    name: [
                        { required: true, message: '请填写名称', trigger: 'blur' },
                    ],
                    code: [
                        { required: true, message: '请填写编码', trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            add() {
                let oldData = this.oldData
                let newData = this.form
                const newChild = {
                    fileId: newData.code || Math.random() * 1000,
                    text: newData.name || 'test',
                    editAuto: true,
                    children: []
                };
                if (!oldData.children) {
                    this.$set(oldData, 'children', []);
                }
                oldData.children.push(newChild);
                this.dialogFormAdd = false
                    this.$message({
                        showClose: true,
                        message: '添加成功',
                        type: 'success'
                    });
            },
            edit() {
                const newChild = {
                    label: this.form.name || 'test',
                    children: []
                };
                console.log(this.oldData)
                if (this.oldData.text) {
                    console.log("nihao")
                    this.$set(this.oldData,"text",newChild.label)
                }
                this.dialogFormEdit = false
                    this.$message({
                        showClose: true,
                        message: '修改成功',
                        type: 'success'
                    });
            },
            delTreeNode(node,data) {
                event.stopPropagation()
                this.oldData = data
                this.oldNode = node
                 this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$emit('delCallback',data)
                    })
            },
            addTreeNode(data) {
                if (data.recordType === 'measureUnit') {
                    this.$emit('addCallback')
                } else {
                    this.dialogFormAdd = true
                    this.oldData = data
                }
            },
            editTreeNode(data) {
                this.form.name = data.text
                if (data.recordType === 'measureUnit') {
                    this.$emit('editCallback',data)
                    this.form.name = ''
                } else {
                    this.dialogFormEdit = true
                    this.oldData = data
                }


            },
            delete() {
                let node = this.oldNode
                let data = this.oldData
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
                this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
            },
            handleNodeClick(data, indeterminate) { // callback function

                this.$emit('handleNodeClick', { data:data, indeterminate:indeterminate })
            },
            dialogFromSubmit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$emit('addCallback',this.form)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            dialogFromEdit(form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.$emit('editCallback', this.form)
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            renderContent(h, {
                node,
                data,
                store
            }) {
                return (
                    <span class="custom-tree-node">
                        <span>{node.label}</span>
                        <span>
                        <el-button size="mini" type="text" on-click={ () => this.add(data) }>Append</el-button>
                        <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
                        </span>
                    </span>);
                }
            }
        };

</script>

<style scoped>
    .custom-tree-node {
        padding: 5px;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        padding-right: 8px;
    }

    .el-tree {
        padding-left: 10px;
        padding-right: 10px;
    }

    .dd-handle {
        display: block;
        height: 20px;
        margin: 5px 0;
        padding: 0 10px;
        color: #333;
        text-decoration: none;
        font-weight: bold;
        border: 1px solid #ccc;
        background: #fafafa;
        background: -webkit-linear-gradient(top, #fafafa 0%, #eee 100%);
        background: -moz-linear-gradient(top, #fafafa 0%, #eee 100%);
        background: linear-gradient(top, #fafafa 0%, #eee 100%);
        -webkit-border-radius: 3px;
        border-radius: 3px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        font-size: x-small;
        line-height: 22px;
    }

</style>
