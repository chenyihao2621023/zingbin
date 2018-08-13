## scroll props

- observeDOM: boolean
  
    监听scroll组件内部dom高度，高度改变时，自动刷新scroll组件，默认 `false`

- scrollbar: boolean
  
    是否显示滚动条, 可选值 `false`(默认) , `true`

- pullDownRefresh：Object

    下拉刷新选项
    ```js
    :pullDownRefresh="{
          threshold: 90,  // 下拉距离触发阀值，用于决定刷新时机
          stop: 40        // 触发时回弹的停留距离
    }"
    ```
    
- pullUpLoad: Object
    
    上拉加载选项

    ```js
        :pullUpLoad="{
          threshold: 0,  // 上拉距离触发阀值， 用于决定加载时机
          txt: {
            more: '加载更多',  // 底部显示
            noMore: '没有更多数据' // 无更多数据时显示
              
          }
        }"
    ```
    渲染结果为
    ```html
        <i class="iconfont icon-zhuanrengong"></i>
    ```
- startY: number
 
    纵轴方向初始化位置

- startX: number
 
    横轴方向初始化位置

## scroll Events

- pullingDown

  下拉刷新触发的回调
 
 - pullingUp

  上拉加载触发的回调
  
## scroll Methods

 使用方法: 
 
```html 
    <scroll
        ref="scrollName"
        >
        <ul></ul>
    </scroll>
    
```

```js
 this.$refs.scrollName.xxx()
```
 
- refresh
    
    刷新scroll(一般在数据改变时调用)

- scrollTo(x: number, y: number, time: number, easing: string)
    - {Number} x 横轴距离（单位 px）
    - {Number} y 纵轴距离（单位 px）
    - {Number} time 滚动动画执行的时长（单位 ms）
    - {Object} easing 缓动函数，一般不建议修改，如果想修改，参考源码中的 ease.js 里的写法

    
       
