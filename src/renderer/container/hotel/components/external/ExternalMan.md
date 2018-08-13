## ExternalMan 外联人选择组件
## props
    - show : Boolean
        控制组件显示与否的boolean控制器

    - tags :Array
       已选人员数组,数组元素为人员对象:[{},{}]]

    - disabledMan: Array
       不可选择的人员数组,数组元素为外联人contactsId,[id,id]]

    - multiline: Boolean
        是否多选

    - title: String
        (可选)默认为:"选择外联人"

## Events

    - callback(list) : Function
        选中的回调, list类型是Arrey数组

    - cancel : Function
      取消选择的回调

## Demo

   ```<external-man :tags="transmitData" :disabledMan="disabledMan" :show="selectManModal" @cancel="selectManModal=false"
                            :multiline="isMultiple" @callback="getExternalMan">
      </external-man>```
