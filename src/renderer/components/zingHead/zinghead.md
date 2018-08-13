## zinghead props
- isComeBack:Boolean  点击返回
  默认：true  不想用传false

- ：title:title  点击返回
    title：string
    默认没有值

- : cancelText:cancelText
    cancelText: string
    默认: 返回
- ：showClose：Boolean 关闭按钮(显示隐藏)
    默认 true
## zinghead event
   v-on:doSome="doSome"
   页面自定义方法

## zinghead Demo
```html

 <ZingHead :title="title" :cancelText="取消" :isComeBack="isComeBack" v-on:doSome="doSome">
      <div slot="header-right">
          <span class="header-search" @click="search">
              <i class="iconfont icon-fangdajing"></i>
          </span>
          <span class="header-jiahao">
             <dropdown :data="datas" trigger="click" placement="bottomRight" @item-click="handleMenu">
              <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
                <i class="iconfont icon-jiahao1"></i>
              </a>
            </dropdown>
          </span>
      </div>
 </ZingHead>
```
