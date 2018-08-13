## ExternalManAdd 外联人添加组件
## props
    - show : Boolean
        控制组件显示与否的控制器

    - title: String
        (可选)默认为:"编辑外联人"

    - append: Boolean
        是否添加dialog到body中

    - form: Object
        编辑外联人回显的数据对象

    - showSelectBtn: Boolean
        是否显示"选择外联人"按钮.
        - 若为true, 则会向外部发送"usePersonSelect"事件通知,告诉外部调用选择外联人组件,
          因此需要页面同时引用 ExternalMan 组件,
          该组件,不直接引用外联人选择组件,避免互相引用,
        - 若为否,则不显示"选择外联人"按钮.


## Events

    - callback(data) : Function
        选中的回调, data是当前添加的最新人员数据,包含id

    - cancel : Function
            取消选择的回调

    - usePersonSelect:Function
            通知外部引用页面,调用选人组件,需要外部页面,同时引用 ExternalMan 选择组件

## Demo

   ``` <external-man-add :append="true" :title="'添加外联人'" :show="addPersonModal" :showSelectBtn="true"
                @cancel="addPersonModal=false" @callback="okAddPerson" @usePersonSelect="usePersonSelect">
       </external-man-add>```
