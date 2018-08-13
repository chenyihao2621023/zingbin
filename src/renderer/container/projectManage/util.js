import Axios from "axios";

//detailActivity深拷贝
// 1 创建一个用来判断数据类型的函数
export function getObjClass(obj) {
  let result = Object.prototype.toString.call(obj).slice(8, -1)
  if (result === 'Undefined') {
    return 'Undefined'
  } else if (result === 'Null') {
    return 'Null'
  } else {
    return result
  }
}
export async function cardUrlToRealName(cardUrlArr) {
  let url = "/zingbiz/auth/user/getCardUserMapByCardUrlList"
  // let url = "/zingbiz/auth/org/getOrgRoleUser"
    var resObj = {}
    let promise = new Promise((resolve,reject)=>{
        Axios.post(url, { cardUrl: cardUrlArr })
         .then(res => {
           resolve(res.data.data)
        })
         .catch(err => {
           reject(err);
        })
    })
    resObj = await promise
    return resObj
}
// 2 创建一个深度遍历对象/数组的函数
export function deepClone(obj) {
  let objClass = getObjClass(obj)
  let result
  if (objClass === 'Object') {
    result = {}
  } else if (objClass === 'Array') {
    result = []
  } else {
    return obj       // 如果是其他数据类型就直接返回 不进行复制
  }

  // 3 遍历目标对象
  for (let key in obj) {
    let value = obj[key]
    if (getObjClass(value) === 'Object') {
      result[key] = deepClone(value)
    } else if (getObjClass(value) === 'Array') {
      result[key] = deepClone(value)
    } else {
      result[key] = obj[key]
    }
  }
  return result
}
