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

export {
  treeListFormatter,
  clearNullChildren
}
