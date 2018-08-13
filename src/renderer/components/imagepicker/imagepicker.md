## imagepicker props

- files: Array<Object>

    图片文件数组,元素为对象,包含属性 `url`（必选), 可能还有`id`, `orientation`(旋转), 以及业务需要的其它属性
    
- selectable: boolean 

    是否显示添加按钮, 可选值: `true`(默认),  `false`
    
- multiple： boolean

    是否支持多选， 可选值: `false`(默认),  `true`
    
- removable： boolean

    是否可删除， 可选值: `true`(默认),  `false`
- imageNum: number

    一行图片总共显示几个， 推荐偶数, 默认(4)
## imagepicker Events

- onchange(files: Object, operationType: string, index: number)
 
	`files` 值发生变化触发的回调函数, `operationType` 操作类型有添加，移除，如果是移除操作，则第三个参数代表的是移除图片的索引


- onAddImageClick

    点击添加按钮时触发的回调

- onImageClick(index: number, files: Object)
    
    点击图片触发的回调

## demo

```html 
  <image-picker 
    :flies = "flies"
    :companyId = "公司id"
    selectable
    multiple
    @change="fliesChange"
  />
```
