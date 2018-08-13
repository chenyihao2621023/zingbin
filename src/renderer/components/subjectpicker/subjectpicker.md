## subjectpicker props
- showPicker: boolean

    选择组件显示状态
    可选项: `false`（默认）,  `true`
    
- multipleMode: boolean
    
    是否多选
    可选项: `false`（默认）,  `true`
    
- parentSubjectSelectable: boolean
    
    是否可选父级科目
    可选项: `false`（默认）,  `true`
    
- showDesc: boolean
    
    是否内容显示为业务描述
    可选项: `false`（默认）,  `true`

## subjectpicker Events

- picked(item: Object || items: Array)

  选中科目的回调, item或items为科目原始数据，多选模式下返回的是数组

- abort
  取消选择的回调
  
## subjectpicker Methods

 使用方法: 
 
```html 
    <subject-picker ref="subPicker" ...></subject-picker>
```

```js
    this.$refs.subPicker.xxx()
```
 
- doLoadNav(tid: string)
    
    跳转到tid对应的目录下
    ```js
        this.$refs.subPicker.doLoadNav('tid001')
    ```

## subjectpicker Demo

```html
<subject-picker :showPicker="showPicker" :multipleMode="true" :parentSubjectSelectable="true" :showDesc="false" @picked="onPicked" @abort="onPickAbort"></subject-picker>
```

demo效果见 [subjectpicker demo](http://localhost:8080/#/demo/subjectpicker)
