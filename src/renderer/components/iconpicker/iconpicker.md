## iconpicker props
- icon-picker-show: boolean
    
    图标选择组件的开关
    可选项: `false`（默认）,  `true`

- multiple: boolean
    
    是否支持多选
    可选项: `false`（默认）,  `true`

- iconData: Array<string>

    icon名称数组
    如:
    ```js
    ['iconfuzhi', 'shezhi', 'qiandao', 'locationfill', 'location', 'camera', 'pic', 'addressbook', 'friend', 'present', 'roundadd', 'redpacket']
    ```
    
- bg-color: string
    
    默认为`#ccc`

    icon图标背景色

- mask-z-index: number

    默认为`1000`
    
    遮罩层的zIndex
    
- dialog-z-index: number
    
    默认为`5000`

    dialog的zIndex


## iconpicker Events

- confirm(name: string | Array)

  点击确定触发的回调, `multiple` 为 `false` 时参数为点击的icon名称， 为 `true`时参数为icon名称数组

- cancel()

  点击取消触发的回调

- close()

  点击关闭按钮触发的回调
  
## iconpicker Demo

```html 
<icon-picker 
    :icon-picker-show="dialogIcon"
    multiple
    :iconData="['iconfuzhi', 'shezhi', 'qiandao', 'locationfill', 'location', 'camera', 'pic', 'addressbook', 'friend', 'present', 'roundadd', 'redpacket']" 
    bg-color="#ed393c"
    :mask-z-index="8000"
    :dialog-z-index="10000"
    @cancel="cancel" @close="cancel" @confirm="cancel"/>
```