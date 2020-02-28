/***
 * 将不标准的树结构数据转化为组件能够使用的标准结构
 * @param treeList
 * @param valueField
 * @param titleField
 * @param toString
 * @returns {[]|undefined}
 */
const treeListFormatter = function (treeList, valueField, titleField, toString) {
  if (treeList === undefined || treeList.length === 0) {
    return undefined
  }

  const formatterList = []
  treeList.forEach(item => {
    let formatterItem = {}
    if (toString) {
      formatterItem = {
        key: `${item[valueField]}`,
        value: `${item[valueField]}`,
        title: item[titleField]
      }
    } else {
      formatterItem = {
        key: item[valueField],
        value: item[valueField],
        title: item[titleField]
      }
    }
    if (item.children !== undefined && item.children.length > 0) {
      formatterItem.children = treeListFormatter(item.children, valueField, titleField, toString)
    }
    formatterList.push(formatterItem)
  })

  return formatterList
}

/***
 * 清除空的children，赋值为undefined
 * @param treeList
 */
const clearNullChildren = function (treeList) {
  if (treeList === undefined || treeList.length === 0) {
    return undefined
  }
  treeList.forEach(item => {
    item.children = clearNullChildren(item.children)
  })
  return treeList
}

/***
 * 树型列表转普通列表
 * @param treeList
 * @returns {[]|*[]}
 */
const treeList2list = function (treeList) {
  if (treeList === undefined || treeList.length === 0) {
    return []
  }
  const allList = []
  treeList.forEach(item => {
    if (item.children !== undefined && item.children.length > 0) {
      allList.push(...treeList2list(item.children))
      delete item.children
    }
  })
  allList.push(...treeList)
  return allList
}

/***
 * 路由配置格式化
 * @param routers
 * @returns {[]|undefined}
 */
const routersFormatter = function (routers) {
  if (routers === undefined || routers.length === 0) {
    return undefined
  }

  const formatterList = []
  routers.forEach(item => {
    if (item.meta) {
      const code = item.meta.permission && item.meta.permission.length > 0 ? item.meta.permission[0] : item.name
      const formatterItem = {
        key: code,
        value: code,
        title: `${item.meta.title}`
      }
      if (item.children !== undefined && item.children.length > 0) {
        formatterItem.children = routersFormatter(item.children)
      }
      formatterList.push(formatterItem)
    }
  })
  return formatterList
}

const apiListFormatter = function (apiList) {
  if (apiList === undefined || apiList.length === 0) {
    return undefined
  }

  console.log('apiListFormatter', apiList)

  const formatterList = []
  apiList.forEach(item => {
    let children
    if (item.children) {
      children = item.children.map(child => {
        return {
          key: child.value,
          value: child.value,
          title: `[${item.classTitle}-${child.apiName}][${child.apiMethod}](${child.apiUri})`
        }
      })
    }
    formatterList.push({
      key: item.classTitle,
      value: '',
      title: item.classTitle,
      children,
      disabled: true
    })
  })
  return formatterList
}

export {
  treeListFormatter,
  clearNullChildren,
  treeList2list,
  routersFormatter,
  apiListFormatter
}
