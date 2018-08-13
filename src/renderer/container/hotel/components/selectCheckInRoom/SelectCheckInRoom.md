## SelectCheckInRoom 在店房间选择组件
## 注:-------------目前只有单选----------------
## props
    - tags :Array
       已选房间数组,数组元素是房间对象,[{}]

    - show : Boolean
        控制组件显示与否的boolean控制器

## Events

    - callback(array)
        选中的回调, 参数数组[{},{}]

    - cancel
      取消选择的回调

## Demo

   <select-check-in-room :show="show"
        :tags="roomList" @cancel="show=false" @callback="getRoomInfo">
   </select-check-in-room>
