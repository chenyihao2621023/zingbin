### ZingVue中一些的规范

### 提示规范  vux中ConfirmPlugin,ToastPlugin
### 参考例子：[例子](http://localhost/#/addGoods..)  
   * 未上传图片的提示 
     ```this.$vux.toast.show({text:"请上传图片!",type:"warn"})```
   * 底部提示
   	 ```this.$vux.toast.text("物品名称不能为空!", 'bottom')```
   * 成功提示
   	 ```this.$vux.toast.show({text:"保存成功！",type:"success",onHide () {}})```
   * 失败提示
   	 ```this.$vux.toast.show({text:"操作异常！",type:"cancel",onHide () {}})```
   * 取消，确定提示框
   	 ```this.$vux.confirm.show({title: '你确定要删除吗?',onCancel () {},onConfirm () {}})```
