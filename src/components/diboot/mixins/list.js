import merge from 'lodash.merge'
import { dibootApi } from '@/utils/request'
export default {
  data () {
    return {
      baseApi: '/',
      // 自定义参数（不被查询表单重置和改变的参数）
      customQueryParam: {},
      // 与查询条件绑定的参数（会被查询表单重置和改变的参数）
      queryParam: {},
      // 列表数据
      data: [],
      // 关联相关的更多数据
      more: {},
      // 是否从mixin中自动获取初始的列表数据
      getListFromMixin: true,
      // 是否从mixin中自动获取关联数据
      getMore: false,
      // 标记加载状态
      loadingData: false,
      // 分页数据
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50', '100']
      }
    }
  },
  methods: {
    handleTableChange (pagination) {
      this.queryParam.pageIndex = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.getList()
    },
    postList () {
      return new Promise((resolve, reject) => {
        this.loadingData = true
        // 过滤掉不存在值的属性
        const tempQueryParam = {}
        // 合并自定义查询参数
        merge(tempQueryParam, this.customQueryParam)
        // 合并搜索参数
        merge(tempQueryParam, this.queryParam)
        // 使用post方式请求列表数据（多用于复杂参数通过json对象进行传输到后端进行筛选）
        dibootApi.post(
          this.listApi ? this.listApi : `${this.baseApi}/list`,
          tempQueryParam
        )
          .then(res => {
            this.loadingData = false
            this.data = res.data
            this.afterLoadList(this.data)
            this.pagination.pageSize = res.page.pageSize
            this.pagination.current = res.page.pageIndex
            this.pagination.total = res.page.totalCount
            // eslint-disable-next-line no-undef
            resolve(this.data)
          })
          .catch(() => {
            this.loadingData = false
            // eslint-disable-next-line prefer-promise-reject-errors
            reject()
          })
      })
    },
    getList () {
      return new Promise((resolve, reject) => {
        this.loadingData = true
        // 过滤掉不存在值的属性
        const tempQueryParam = {}
        // 合并自定义查询参数
        merge(tempQueryParam, this.customQueryParam)
        // 合并搜索参数
        merge(tempQueryParam, this.queryParam)
        dibootApi.get(
          this.listApi ? this.listApi : `${this.baseApi}/list`,
          tempQueryParam
        ).then(res => {
          this.loadingData = false
          this.data = res.data
          this.afterLoadList(this.data)
          this.pagination.pageSize = res.page.pageSize
          this.pagination.current = res.page.pageIndex
          this.pagination.total = res.page.totalCount
          resolve(this.data)
        }).catch(() => {
          this.loadingData = false
          // eslint-disable-next-line prefer-promise-reject-errors
          reject()
        })
      })
    },
    async attachMore () {
      const res = await dibootApi.get(`${this.baseApi}/attachMore`)
      this.more = res.data
    },
    reset () {
      this.queryParam = {}
      this.getList()
    },
    remove (id) {
      return new Promise((resolve, reject) => {
        var _this = this
        _this.$confirm({
          title: '删除',
          content: `确定删除该数据吗？`,
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            dibootApi.delete(`${_this.baseApi}/${id}`).then(async (res) => {
              if (res.code === 0) {
                _this.$notification.success({
                  message: '删除成功',
                  description: '',
                  duration: 2
                })
                await _this.getList()
                resolve(res.data)
              } else {
                _this.$notification.error({
                  message: '删除失败',
                  description: res.msg,
                  duration: 2
                })
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(res.msg)
              }
            }).catch(err => {
              _this.$notification.error({
                message: '删除失败',
                description: err.msg,
                duration: 2
              })
              reject(err.msg)
            })
          }
        })
      })
    },
    /**
     * 导出数据
     * @param res
     */
    downloadFile (res) {
      const blob = new Blob([res.data])
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a')
        elink.download = res.filename
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      } else { // IE10+下载
        navigator.msSaveBlob(blob, res.filename)
      }
    },
    afterLoadList (list) {

    }
  },
  async mounted () {
    console.log('mounted', this.getListFromMixin)
    if (this.getListFromMixin === true) {
      await this.getList()
    }
    if (this.getMore === true) {
      await this.attachMore()
    }
  }
}
