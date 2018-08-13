## gridcard slot 

- cardLeft
  卡片左边部分

- cardRight 
  卡片右边部分

##demo

```html 
<GridCard>
  <div slot="cardLeft" class="left">
    <avatar shape="square" :style="{backgroundColor: '#EA3C40'}" icon="zhuanrengong" size="large"></avatar>
    <div class="left-wrapper">
      <p class="left-wrapper-title">固定资产库</p>
      <div class="left-wrapper-desc">固定资产库固定资产库</div>
    </div>
  </div>
  <div slot="cardRight" class="right">
    <i class="iconfont icon-gengduo"></i>
    <div class="tag-wrapper">
      <tag color="#20a0ff" closable>我</tag>
      <tag type="success">固定资产</tag>
    </div>
    
  </div>
</GridCard>
```