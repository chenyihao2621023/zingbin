/**
 * Created by trto1987 on 2018/2/6.
 */

import { deepCopy, sortBy, objExtend } from '../../utils/fn'



/** 新
 * 处理树数据
 * @param data 数据来源"getOrgRoleUser.action"
 * @param type params.type
 * @param fn   userInfoutils的回调函数
 * @param filterData 过滤的参数{orgList:[],roleList:[],cardUrlList:[]}
 *
 * @return treeData 根据条件返回有: orgs,roles,users,orgUserDatas,roleUserDatas,
 *       其他返回内容有: 人数:roleRenCount,orgRenCount,companyId,cardUrl
 */
function procTreeDataNew (data, type, fn, filterData) {

  let treeData = {}
  let rData = data.data

  /**过滤数据---开始*/
  if (filterData) {
    //todo 待确定1 递归筛选
    if (filterData.hasOwnProperty('orgList')) {
      let filterOrgList = []
      rData.orgList.forEach(data => {
        if (filterData.orgList.indexOf(data.id) !== -1) {
          let copyData = deepCopy(data)
          copyData.children = null
          filterOrgList.push(copyData)
        }
        if (data.children) {
          filterOrg(data.children, filterOrgList, filterData.orgList)
        }
      })
      rData.orgList = filterOrgList
    }

    //todo 待确定2
    // if(_.has(filterData,"orgList")){
    //    let filterOrgList = [];
    //    _.each(rData.orgList,function(data){
    //        if(filterData.orgList.indexOf(data.id) != -1){
    //            filterOrgList.push(data);
    //        }
    //    });
    //    rData.orgList = filterOrgList;
    // }

    if (filterData.hasOwnProperty('roleList')) {
      let filterRoleList = []
      rData.roleList.forEach(data => {
        if (filterData.roleList.indexOf(data.roleInfoId) !== -1) {
          filterRoleList.push(data)
        }
      })
      rData.roleList = filterRoleList
    }

    if (filterData.hasOwnProperty("cardUrlList")) {
      let filterCardUrlList = []
      rData.userCompanysList.forEach(data => {
        if (filterData.cardUrlList.indexOf(data.cardUrl) !== -1) {
          filterCardUrlList.push(data)
        }
      })
      rData.userCompanysList = filterCardUrlList
    }
  }
  /**过滤数据---结束*/

  //仅组织数据
  if (type === 'org' || type === 'all') {
    treeData.orgs = deepCopy(rData.orgList)
  }

  //角色数据----转换数据格式为{idV:{id:idV,name:nameV}}
  if (type === 'role' || type === 'all') {
    treeData.roles = convertDataNew(rData.roleList, 'roleInfoId', 'roleInfoName')
  }

  // user、orgAndUser、roleAndUser、all 数据处理
  if (type === 'user' || type === 'orgAndUser' || type === 'roleAndUser' || type === 'all') {
    let userData = procUserDataNew(rData)
    if (type === 'user' || type === 'all') {
      treeData.users = userData
    }

    /**1.根据组织整理部门下的人员，封装进users:[{},{}] */
    if (type === 'orgAndUser' || type === 'all') {
      rData.orgList.forEach(row => {
        if (!row.hasOwnProperty('users')) {
          row.users = []
        }

        if (row.hasOwnProperty('userList')) {
          let userList = row.userList.split(' ')
          userList.forEach(user => {
            let cardUrl = user.split("#")[1]

            if (Array.isArray(row.users) && userData.hasOwnProperty(cardUrl)) {
              row.users.push(userData[cardUrl])
            }
          })
        }

        //处理子部门
        if (row.children && Array.isArray(row.children) && row.children.length > 0) {
          orgDataAndUsers(row.children, userData)
        }
      })

      treeData.orgUserDatas = rData.orgList;
      treeData.orgRenCount = Object.keys(userData).length //users集合数据的个数

      //统计人数---需要递归统计----也可在递归处理人员时做统计
      //treeData.orgRenCount = getRenCountNew(treeData.orgUserDatas);
    }

    //2.根据角色整理该角色下的人员，封装进users:[{},{}]
    if (type === 'roleAndUser' || type === 'all') {
      let convertRole = convertDataNew(rData.roleList, 'roleInfoId', 'roleInfoName')
      rData.userCompanysList.forEach(row => {
        if (row.hasOwnProperty('roleCode') && row.hasOwnProperty('cardUrl') && convertRole.hasOwnProperty(row["roleCode"])) {
          let roleCode = row["roleCode"]
          if (!convertRole[roleCode].hasOwnProperty('users')) {
            convertRole[roleCode].users = []
          }

          let cardUrl = row['cardUrl']
          if (Array.isArray(convertRole[roleCode].users) && userData.hasOwnProperty(cardUrl)) {
            convertRole[roleCode].users.push(userData[cardUrl])
          }
        }
      })

      //排序
      Object.keys(convertRole).forEach(k => {
        let data = convertRole[k]
        data.users = sortBy(data.users, 'name')
      })

      treeData.roleUserDatas = convertRole
      treeData.roleRenCount = getRoleUserCount(treeData.roleUserDatas)
    }

    if (rData.hasOwnProperty('companyId')) {
      treeData.companyId = rData.companyId
    } else {
      treeData.companyId = ''
    }

    if (rData.hasOwnProperty('cardUrl')) {
      treeData.cardUrl = rData.cardUrl
    } else {
      treeData.cardUrl = ''
    }
  }

  if (typeof fn === 'function') {
    fn(treeData)
  } else {
    console.error('procTreeData fn is not function (fn typeof ' + typeof fn + ')')
  }
}

function filterOrg (children, filterOrgList, orgList) {

  children.forEach(data => {
    if (orgList.indexOf(data.id) !== -1) {
      let copyData = deepCopy(data)
      copyData.children = null
      filterOrgList.push(copyData)
    }
    if (data.children) {
      filterOrg(data.children, filterOrgList, orgList)
    }
  })
}

/**
 *  组织部门下的人员整理---
 * @param children 下属子部门数组
 * @param userData  处理后的人员数据集
 * */
function orgDataAndUsers(children, userData) {
  children.forEach(row => {
    if (!row.hasOwnProperty('users')) {
      row.users = []
    }

    if (row.hasOwnProperty('userList')) {
      let userList = row.userList.split(' ')
      userList.forEach(user => {
        let cardUrl = user.split("#")[1]
        if (Array.isArray(row.users) && userData.hasOwnProperty(cardUrl)) {
          row.users.push(userData[cardUrl])
        }
      })
    }

    //处理子部门
    if (row.children && Array.isArray(row.children) && row.children.length > 0) {
      orgDataAndUsers(row.children, userData)
    }
  })
}

/**
 * 处理方法：转换数据格式为{idV:{id:idV,name:nameV}}
 * */
function convertDataNew(data, kKey, vKey) {
  let retData = {}
  let sData = sortBy(data, vKey)
  sData.forEach(row => {
    retData[row[kKey]] = { id:row[kKey], text:row[vKey] }
  })
  return retData
}

/**处理组织数据，以cardUrl为键，部门为值：
 * {
 *   cardUrl:{orgId:"业务部"，orgId:"技术部"}，
 *   cardUrl:{orgId:"业务部"，orgId:"客服部"}
 * }
 */
function covertUserAndOrgs(children, orgCardUrl) {
  children.forEach(row => {
    let orgObj = {}
    orgObj[row.id] = row.text
    if (row.hasOwnProperty('userList')) {
      let userList = row.userList.split(' ')
      userList.forEach(user => {
        if (user && user.length > 0) {
          let cardUrl = user.split("#")[1]
          if (cardUrl) {
            if (!orgCardUrl.hasOwnProperty(cardUrl)) {
              orgCardUrl[cardUrl] = deepCopy(orgObj)
            } else {
              objExtend(orgCardUrl[cardUrl], orgObj)
            }
          }
        }
      })
    }

    if (row.hasOwnProperty('children') && Array.isArray(row.children)) {
      covertUserAndOrgs(row.children, orgCardUrl)
    }
  })
}

/**
 * 处理所有用户数据
 * @params data mhUserlet.data
 * 返回值：retData 人员数据的大集合，含HR,card,user,orj,role,商号,绑定等数据
 * 格  式：{cardUrl:{数据集k:v},cardUrl:{数据集k:v},...}
 */
function procUserDataNew(data) {
  let orgList = data.orgList
  // let roleList = data.roleList
  let userCompanysList = data.userCompanysList
  // let chatWorkFlowBingdingList = data.chatWorkFlowBingdingList
  let hrList = data.hrList
  // let cardUserList = data.cardUserList
  let serverMap = {}

  let retData = {}
  //储存用户和上级的领导数据   格式{“cardUrl”：“领导人的名字”}
  let userOrgLeaderData = {}

  if (data.hasOwnProperty('serverMap') &&
    Object.keys(data.serverMap).length > 0 && data.serverMap.hasOwnProperty('companyName')) {
    serverMap.companyName = data.serverMap.companyName
  } else {
    serverMap.companyName = ''
  }

  let convertRole = convertDataNew(data.roleList, 'roleInfoId', 'roleInfoName')

  /**处理org中userList字段
   * 根据cardUrl整理数据----{cardUrl:{orgId:"客服部"，orgId:"管理员"},....}
   */
  let orgCardUrl = {}
  orgList.forEach(row => {
    let orgObj = {}
    orgObj[row.id] = row.text

    if (row.hasOwnProperty('userList')) {
      let userList = row.userList.split(' ')
      userList.forEach(user => {
        if (user && user.length > 0) {
          let cardUrl = user.split("#")[1]
          if (cardUrl) {
            if (!orgCardUrl.hasOwnProperty(cardUrl)) {
              orgCardUrl[cardUrl] = deepCopy(orgObj)
            } else {
              objExtend(orgCardUrl[cardUrl], orgObj)
            }

            //处理用户和部门领导数据
            if (row.hasOwnProperty('orgLeader')) {
              hrList.forEach(hrRow => {
                if (hrRow.cardUrl === row.orgLeader.split("#")[0]) {
                  let orgLeader = hrRow.userName
                  if (userOrgLeaderData.hasOwnProperty(cardUrl)) {
                    userOrgLeaderData[cardUrl] = orgLeader
                  } else {
                    if (userOrgLeaderData[cardUrl].indexOf(orgLeader) === -1) {
                      userOrgLeaderData[cardUrl] = userOrgLeaderData[cardUrl] + ',' + orgLeader
                    }
                  }
                }
              })
            }
          }
        }
      })
    }

    if (row.hasOwnProperty('children') && Array.isArray(row.children)) {
      covertUserAndOrgs(row.children, orgCardUrl)
    }
  })

  /*//处理绑定数据
  //根据cardUrl整理数据----{cardUrl:{绑定数据},cardUrl:{},....}
  let chatBindData = {}
  chatWorkFlowBingdingList.forEach(row => {
    chatBindData[row.cardUrl] = row
  })*/

  /**处理名片数据--------和上面一样啊！！*/
    // let cardUserData = {};
    // _.each(chatWorkFlowBingdingList,function(row){
    //     cardUserData[row.cardUrl] = row;
    // });

    //处理人事档案数据
  let hrData = {}
  hrList.forEach(row => {
    if (userOrgLeaderData) {
      row.orgLeader = userOrgLeaderData[row.cardUrl]
    }
    hrData[row.cardUrl] = row
  })

  /**拼装用户数据----根据cardurl整合其他类型数据{k:cardUrl,v:{各种数据}}*/
  userCompanysList.forEach(row => {
    let user = {}
    let cardUrl = row['cardUrl']
    let roleCode = row['roleCode']
    user.id = cardUrl
    objExtend(user, row)

    //拼装角色数据
    if (convertRole.hasOwnProperty(roleCode)) {
      user.roleName = convertRole[roleCode].text //角色名称 roleInfoName
    } else {
      user.roleName = ''
    }

    //拼装组织数据
    let orgCode = ''
    let orgName = ''
    Object.keys(orgCardUrl[cardUrl]).forEach(id => {
      let name = orgCardUrl[cardUrl][id]

      if (name) {
        orgCode += id + ', '
        orgName += name + ', '
      }
    })

    user.orgCode = orgCode.substr(0, orgCode.length - 1)
    user.orgName = orgName.substr(0, orgName.length - 1)

    /*//拼装绑定数据
    if (chatBindData.hasOwnProperty(cardUrl)) {
      objExtend(user, chatBindData[cardUrl])
    }*/

    //拼装人事档案数据
    if (hrData.hasOwnProperty(cardUrl)) {
      objExtend(user, hrData[cardUrl])
    }

    //拼装商号名称
    user.companyName = serverMap.companyName
    if (user.hasOwnProperty('userName')) {
      user.name = user.userName
    } else {
      user.name = user.RealName
    }

    //
    if ((user.roleName && user.roleName.length > 0 && user.orgName && user.orgName.length > 0) || !data.isFilterData) {
      retData[cardUrl] = user
    }
  })

  return retData
}

/**
 * 统计人数--用于角色下人员统计，类似组织机构等存在子级的数据类型，需要递归统计
 */
function getRoleUserCount (data) {
  let cardUrlCountMap = {}
  Object.keys(data).forEach(k => {
    let row = data[k]
    if (row.hasOwnProperty('users')) {
      row.users.forEach(user => {
        let cardUrl = user.cardUrl

        if (cardUrlCountMap.hasOwnProperty(cardUrl)) {
          cardUrlCountMap[cardUrl] += 1
        } else {
          cardUrlCountMap[cardUrl] = 1
        }
      })
    }
  })

  return Object.keys(cardUrlCountMap).length
}

/**==新==
 * 参数:
 * jsonData  数据来源"/ZingMH/MENHUWX/MHHelper/getOrgRoleUser.action"
 * 1.类型和过滤
 *  type  可选参数 org、role、user、orgAndUser、roleAndUser、all
 *  orgList   过滤组织 如：orgId1,orgId1,...
 *  roleList  过滤角色 如：roleId1,roleId2,...
 *  cardUrlList  过滤用户 如：cardUrl1,cardUrl2,...
 * 2.返回数据: treeDate：
 *  orgs:  纯多级组织数据：orgId为键k:{数据为值v}----{"id":{id:"",name:"",children:[子部门数据]},...}
 *  roles: 纯角色数据：roleId为键k:{数据为值v} ---{"id":{id:"",name:""},.....}
 *  users: 纯人员数据：cardUrl为键k:{数据为值v} {"cardUrl":{id:"",name:"",...},...}
 *  orgAndUser: 根据部门整合该部门下人员数据 : 比 orgs 多了一个 users:[{人员1},{人员2}] 数据内容
 *  roleAndUser: 根据角色整合该角色下人员数据 ： 比 roles多了一个 users:[{人员1},{人员2}] 数据内容
 *  all：为 org、role、user、orgAndUser 和 roleAndUser 的数据组合
 * 使用 jsonData 要过滤数据 需在 ajax 的 params 传入 orgList、roleList、cardUrlList
 */
export function getOrgRoleUser (params, fn, jsonData) {
  // let jsonData = $.extend(true,{},jsonTmp) // 处理副本数据
  let type = ""
  if (params !== null) {
    if (params.type) {
      type = params.type
    } else {
      console.error('getOrgRoleUserNew Execption error type no define')
      return
    }
  }

  /**过滤的参数*/
  let filterData = {}
  if (params.hasOwnProperty('orgList')) {
    filterData.orgList = params.orgList
  }
  if (params.hasOwnProperty('roleList')) {
    filterData.roleList = params.roleList
  }
  if (params.hasOwnProperty('cardUrlList')) {
    filterData.cardUrlList = params.cardUrlList
  }

  /**----人员数据处理-----*/
  if (jsonData) {
    let jsonDa = deepCopy(jsonData)
    procTreeDataNew(jsonDa, type, fn, filterData)
  } else {
    // todo req
    // let url = USER_ROU +"/MENHUWX/MHHelper/getOrgRoleUser.action"
    // ajaxFunction(url,params, true, function(data) {
    //   procTreeDataNew(data,type,fn,filterData);
    // })
  }
}
