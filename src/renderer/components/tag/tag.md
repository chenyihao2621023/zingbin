## tag props
- size: string

    设置标签的的大小，可选值`large`  , `small`   , `default(默认)`

- color：string

    自定义组件颜色，不建议使用element-ui的tag组件
    
- closable: boolean
    
    是否显示标签关闭按钮

## tag Events

- close(event) 

  点击关闭按钮出发的回调

## demo

  ```html
    <tag color="#20a0ff" 
      size="large"
      closable 
      @close="handleClose" 
    >
      我
    </tag>
  ```
