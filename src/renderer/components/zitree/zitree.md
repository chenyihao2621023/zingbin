## tree props
- props: Object

    数据字段
    ```js
    defaultProps: {
        title: "title",          // 节点字段， 默认为"title"
        children: "children",    // 子节点字段, 默认为"children"
        src: "src",              // 头像字段, 默认为"src"
        auth: "auth"             // 认证字段, 默认为"auth"
   },
    ```

- data: Array<Object>

    树组件数据源

- checkable: boolean

    是否显示复选框
    可选项: `false`（默认）,  `true`

- show-line: boolean

    是否显示连接线
    可选项: `false`（默认）,  `true`

- multiple: boolean

    是否支持多选
    可选项: `false`（默认）,  `true`

- pc: boolean

    重置初始样式，不显示头像等
    可选项: `false`（默认）,  `true`

- draggable: boolean

    是否支持拖动
    可选项: `false`（默认）,  `true`

- defaultExpandAll: boolean

    是否全部展开
    可选项: `false`（默认）,  `true`

- editBtn：boolean

    是否显示编辑按钮
    可选项: `false`（默认）,  `true`

- deleteBtn：boolean

    是否显示删除按钮
    可选项: `false`（默认）,  `true`

- addBtn：boolean

    是否显示添加按钮
    可选项: `false`（默认）,  `true`

- chatBtn：boolean

    是否显示聊天按钮
    可选项: `false`（默认）,  `true`

- explorerBtn：boolean

    是否显示文件柜按钮
    可选项: `false`（默认）,  `true`

- moreBtn：boolean

    是否显示更多(三个点)按钮
    可选项: `false`（默认）,  `true`

## tree Events

- select(data: Object)

  点击节点出发的回调

- check(data: Array)

  点击复选框触发的回调

- delete(data: Object)

  点击删除按钮触发的回调

- edit(data: Object)

  点击编辑按钮触发的回调触发的回调

- add(data: Object)

  点击添加按钮触发的回调

- chat(data: Object)

  点击聊天按钮触发的回调

- explorer(data: Object)

  点击文件柜按钮触发的回调

 - click-menu(data: Object)

   点击更多(三个点)按钮触发的回调

## tree Methods

 使用方法:

```html
    <zi-tree
        ref="treelName"
    >
        <ul></ul>
    </zi-tree>

```

```js
 this.$refs.treelName.xxx()
```

- editNode(clue: string, data: Object)

    编辑当前节点内容
    ```js
        this.$refs.treelName.editNode(item.origin.clue, { title: '123' })
    ```

- deleteNode(clue: string)

    删除该节点
    ```js
        this.$refs.treelName.delNode(item.origin.clue)
    ```

- addNode(clue: string, data: Object)

    给当前节点添加子节点
    ```js
        this.$refs.treelName.addNode(item.origin.clue,{title: 'addNode'})
    ```

- getCheckedNodes()

    获取被勾选的节点
    ```js
        this.$refs.treelName.getCheckedNodes()
    ```
- getNoCheckedNodes()

    获取未被勾选的节点
    ```js
        this.$refs.treelName.getNoCheckedNodes()
    ```
- getNodeById(key: String, value: Number | String)

    通过键名查找节点
    ```js
        this.$refs.treelName.getNodeById('id', 200)
    ```
- getHalfCheckedNodes()

    获取被半选的节点
    ```js
        this.$refs.treelName.getHalfCheckedNodes()
    ```
- getSelectedNodes()

    获取被选中的节点
    ```js
        this.$refs.treelName.getSelectedNodes()
    ```

## tree Demo

```html
 <zi-tree
    ref="roleTree"
    :props="defaultProps"
    @delete="deleteNode"
    @edit="editNode"
    @add="addNode"
    @check="checkFn"
    @select="select"
    @click-menu="clickMenu"
    :data="treeData"
    :menuData="menuData"
    checkable
    defaultExpandAll
    moreBtn
    editBtn
    deleteBtn
    addBtn
    show-line
    />
```

```js
data() {
    return {
        defaultProps: {
            title: "leaf",
            children: "children2",
            src: "url",
            auth: "yanzheng"
        },
        treeData: [
        {
        leaf: "客服部",

        children2: [
            {
            leaf: "客服1部",
            children2: [
                {
                leaf: "陈亦好",
                url: "http://img0.imgtn.bdimg.com/it/u=12867320,655225767&fm=214&gp=0.jpg",
                yanzheng: true
                }
            ]
            }
        ]
        },
        {
        leaf: "研发部",
        children2: [
            {
            leaf: "庄文达",
            checked: true
            },
            {
            leaf: "阎现军",
            edit: true,
            src: "http://img0.imgtn.bdimg.com/it/u=12867320,655225767&fm=214&gp=0.jpg"
            },
            {
            leaf: "刘广峰"
            },
            {
            leaf: "李扬",
            children2: [
            {
                leaf: "阿黄",
                checked: true

            },
            {
                leaf: "阿花"
            },
            {
                leaf: "阿红"
            },
            ]
            },
        ]
        }
        ],
        menuData: [
            {content: '新建'},
            {content: '删除', disabled: true},
            {content: '更改'},
            {content: '发起会话'}
        ]
    }

}
```
