import { axios } from '@/utils/request'
export default {
  data () {
    return {
      treeList: {},
      currentNodeId: 0,
      showTree: false,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      queryParam: {},
      data: [],
      getMore: false,
      getListFromMixin: true,
      more: {},
      loadingData: false,
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50']
      }
    }
  },
  methods: {
    loadTree () {
      axios({
        url: this.getTreeApi,
        method: 'get'
      }).then(res => {
        this.treeList = this.treeListFormatter(res.data)
        this.showTree = true
      })
    },
    onTreeSelect (selectedKeys, info) {
      if (selectedKeys && selectedKeys.length > 0) {
        // 设置当前节点
        this.currentNodeId = selectedKeys[0]
        // 准备表格查询参数，进行查询
        this.getList()
      }
    },
    refreshPage () {
      this.loadTree()
      this.getList()
    },
    treeListFormatter (treeList) {
      return treeList
    },
    handleTableChange (pagination) {
      this.queryParam.pageIndex = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.getList()
    },
    getList () {
      this.loadingData = true
      // 过滤掉不存在值的属性
      const tempQueryParam = {}
      if (Object.keys(this.queryParam).length > 0) {
        for (const key in this.queryParam) {
          if (this.queryParam[key]) {
            tempQueryParam[key] = this.queryParam[key]
          }
        }
      }
      console.log('query', tempQueryParam)
      let url
      if (this.getTreeListApiPrefix) {
        url = `${this.getTreeListApiPrefix}/${this.currentNodeId}`
      }
      axios({
        url,
        params: tempQueryParam,
        method: 'get'
      }).then(res => {
        this.data = res.data
        console.log('list', res)
        this.pagination.pageSize = res.page.pageSize
        this.pagination.current = res.page.pageIndex
        this.pagination.total = res.page.totalCount
        this.loadingData = false
      })
    },
    attachMore () {
      axios({
        url: `${this.apiPrefix}/attachMore`,
        method: 'get'
      }).then(res => {
        this.more = res.data
        console.log('more', this.more)
      })
    },
    reset () {
      this.queryParam = {}
      this.getList()
    },
    remove (id) {
      var _this = this
      _this.$confirm({
        title: '删除',
        content: `确定删除该数据吗？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          axios({
            url: `/${_this.name}/${id}`,
            method: 'delete'
          }).then((res) => {
            if (res.code === 0) {
              _this.$notification.success({
                message: '删除成功',
                description: '',
                duration: 2
              })
              _this.loadTree()
              _this.getList()
            } else {
              _this.$notification.error({
                message: '删除失败',
                description: res.msg,
                duration: 2
              })
            }
          }).catch(err => {
            _this.$notification.error({
              message: '删除失败',
              description: err.msg,
              duration: 2
            })
          })
        }
      })
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    onSearchChange (e) {
      const value = e.target.value
      const expandedKeys = this.getExpandedKeys(this.treeList, value)
      if (expandedKeys.length > 0) {
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true
        })
      }
    },
    getExpandedKeys (list, value) {
      const allExpandedKeys = []
      const expandedKeys = list
        .map(item => {
          // 对children进行查找
          if (item.children && item.children.length > 0) {
            const childrenExpandedKeys = this.getExpandedKeys(item.children, value)
            if (childrenExpandedKeys.length > 0) {
              allExpandedKeys.push(...childrenExpandedKeys)
            }
          }
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeList)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      if (expandedKeys.length > 0) {
        allExpandedKeys.push(...expandedKeys)
      }

      return allExpandedKeys
    },
    getParentKey (key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    },
    getInitExpandedKeys (list) {
      const keys = []
      list.forEach(item => {
        if (item.children && item.children.length > 0) {
          keys.push(item.key)
          keys.push(...this.getInitExpandedKeys(item.children))
        }
      })
      return keys
    }
  },
  created () {
    this.loadTree()
  },
  async mounted () {
    if (this.getListFromMixin === true) {
      await this.getList()
    }
    if (this.getMore === true) {
      await this.attachMore()
    }
  }
}
