import { dibootApi } from '@/utils/request'
import { list2childrenMap, treeList2list } from '@/utils/treeDataUtil'
import _ from 'lodash'

export default {
  data () {
    return {
      baseApi: '/',
      treeListApi: '',
      sortApi: '',
      visible: false,
      spinning: false,
      treeList: [],
      formatter: {
        value: 'id',
        title: 'name'
      }
    }
  },
  methods: {
    async open () {
      this.visible = true
      this.spinning = true
      // 获取系统中所有的treeList
      try {
        const treeListApi = this.treeListApi ? this.treeListApi : `${this.baseApi}/list`
        const res = await dibootApi.get(treeListApi)
        this.spinning = false
        if (res.code === 0) {
          this.afterOpen()
          this.treeList = this.treeListFormatter(this.treeListFilter(res.data), this.formatter.value, this.formatter.title)
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        this.spinning = false
        console.log('获取树结构异常', e)
      }
    },
    // 对排序列表进行过滤处理
    treeListFilter (list) {
      return list
    },
    submitSortList (list) {
      const sortApi = this.sortApi ? this.sortApi : `${this.baseApi}/sortList`
      dibootApi.post(sortApi, list).then(res => {
        if (res.code === 0) {
          this.$message.success('排序成功')
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.$message.error('排序失败')
      })
    },
    onDrop (info) {
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.treeList]
      // Find dragObject
      let dragObj
      if (!info.dropToGap ||
        ((info.node.children || []).length > 0 && // Has children
          info.node.expanded && // Is expanded
          dropPosition === 1)) {
        this.levelChangeWarning()
        return false
      } else {
        // 检查拖拽的地方是否是同一层级
        const dragItem = this.dataList.find(item => {
          return item.value === dragKey
        })
        const dropItem = this.dataList.find(item => {
          return item.value === dropKey
        })
        if (dragItem == null || dropItem == null) {
          this.levelChangeWarning()
          return false
        } else if (dragItem.parentId !== dropItem.parentId) {
          this.levelChangeWarning()
          return false
        }

        loop(data, dragKey, (item, index, arr) => {
          arr.splice(index, 1)
          dragObj = item
        })
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
        // 到后端同步数据
        this.submitSortList(ar)
      }
      this.treeList = data
    },
    treeListFormatter (treeList, valueField, titleField) {
      if (treeList == null || treeList.length === 0) {
        return undefined
      }
      const formatterList = []
      treeList.forEach(item => {
        const formatterItem = {
          parentId: item.parentId == null ? '' : `${item.parentId}`,
          id: item.id == null ? '' : `${item.id}`,
          sortId: item.sortId == null ? '' : `${item.sortId}`,
          key: item[valueField] == null ? '' : `${item[valueField]}`,
          value: item[valueField] == null ? '' : `${item[valueField]}`,
          title: item[titleField] == null ? '' : `${item[titleField]}`
        }
        if (item.children != null && item.children.length > 0) {
          formatterItem.children = this.treeListFormatter(item.children, valueField, titleField)
        }
        formatterList.push(formatterItem)
      })

      return formatterList
    },
    levelChangeWarning () {
      this.$message.warning('如果需要更改层级关系，请使用更新功能进行更改！')
    },
    close () {
      this.visible = false
      this.treeList = []
      this.$emit('complete')
      this.afterClose()
    },
    afterOpen () {

    },
    afterClose () {

    }
  },
  computed: {
    dataList: function () {
      if (!this.treeList || this.treeList.length === 0) {
        return []
      }
      return treeList2list(_.cloneDeep(this.treeList))
    },
    childrenMap: function () {
      return list2childrenMap(this.dataList)
    }
  }
}
