## avatar props
- size: string
  
    设置头像的大小，可选值`large`  , `small`   , `default(默认)`
- shape：string

    设置头像的形状， 可选值 `circle(默认)`,  `square`
    
- icon: string
    
    设置头像的内容为icon类型

    ```jsx
        <avatar shape="square" icon="zhuanrengong"></avatar>
    ```
    渲染结果为
    ```html
        <i class="iconfont icon-zhuanrengong"></i>
    ```
- src: string
 
    设置头像内容为图片
    
    ```jsx
        <avatar :src="require('../assets/img/tou.png')"></avatar>
    ```

## demo

  ```html
    <avatar shape="square" :style="{backgroundColor: '#EA3C40'}" icon="zhuanrengong" size="large"></avatar>
  ```
