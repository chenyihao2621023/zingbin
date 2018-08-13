## CheckPanel
##### 在vux-ui组件Panel的基础上拓展了Checklist的选择功能，基础使用参考Panel，拓展的功能如下：

#### extra props
- value: Array

    表单值
    
- max: Number

    最多可选个数，值为1时为单选
    
- min: Number

    最少可选个数
    
- check-disabled: Boolean

    默认值: true
    
    是否进行可选检测，默认情况下当选择个数等于可选个数(max)时，其他项不可选择。该选项主要适用于从多个选项列表中收集值的场景。注意的该选项设为 false 时 max 设置将失效。


- label-position: String
	  
	  默认值: right
	  
	  内容位置，可以设置为 left 或者 right。注意type类型为'3'时此项失效，将恒定为right。
	  
- disabled: String

    是否禁用操作，如果禁用则选择区域消失

## extra Events

- on-change (value)

  值变化时触发，参数为 (value)
  
## Demo

```html
<check-panel class="folder-list" v-model="folderChecklist" :max="1" :label-position="left" @on-change="folderCheckChange"
                 :list="folderList" :type="'1'" @on-img-error="onImgError" @on-click-item="onClickItem"></check-panel>
```
