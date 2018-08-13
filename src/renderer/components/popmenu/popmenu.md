## iconpicker props
- show: boolean
    
    menu开关
    可选项: `false`（默认）,  `true`

- menuData: Array<object>

    menu列表
    如:
    ```js
    [{
      icon: 'fenxiang',
      text: '分享到英商'
    }]
    ```
- titleMenu: Array<object>

    title menu列表
    如:
    ```js
    [{
      icon: 'fenxiang',
      text: '分享到英商'
    },{
      icon: 'excel',
      text: '分享到微信'
    }]  // （默认）重新定义可覆盖
    ```
- contentMenu: Array<object>

    content menu列表
    如:
    ```js
    [{
      icon: 'shoucang1',
      text: '收藏'
    },{
      icon: 'qunliao',
      text: '发起群聊'
    },{
      icon: 'jiaren',
      text: '添加好友'
    },{
      icon: 'iconfontzhizuobiaozhun49',
      text: '邀请好友'
    }] // （默认）重新定义可覆盖
    ```  



## iconpicker Events

- on-hide()

  关闭menu菜单触发的回调

- cancel()

  点击取消按钮触发的回调

- click-menu-item(val: string)

  点击menu菜单项触发的回调，接收参数为menu的text
  
## iconpicker Demo

```html 
<PopMenu 
  :show="show14" 
  @on-hide="hideMenu" 
  :menuData="popMenuData" 
  @cancel="hideMenu" 
  @click-menu-item="handleMenuItem"
  />
```