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

export {
  treeListFormatter
}
