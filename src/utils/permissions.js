export function actionToObject (json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    console.log('err', e.message)
  }
  return []
}

/***
 * 将后端的permissionList转为permissions
 * @param permissionList
 */
export function permissionListToPermissions (permissionList) {
  if (!permissionList || permissionList.length === 0) {
    return permissionList
  }

  const permissions = []
  const actionListMap = {}
  permissionList.forEach(per => {
    // 将不重复code的permission添加到permissions中
    const duplicatePermissions = permissions.filter(p => {
      return p.code === per.code
    })
    if (duplicatePermissions.length === 0) {
      permissions.push(per)
    }
    // 整理actionList到code的map中
    let actionList = actionListMap[per.code]
    if (actionList === undefined) {
      actionList = []
      actionListMap[per.code] = actionList
    }
    if (per.operationCode) {
      actionList.push({
        action: per.operationCode,
        describe: per.operationName,
        defaultCheck: false
      })
    }
  })

  // 对于每个不重复的permission设置actionList
  permissions.map(per => {
    per.actionList = actionListMap[per.code]
  })

  return permissions
}
