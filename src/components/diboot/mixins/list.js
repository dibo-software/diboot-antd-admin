import merge from 'lodash.merge'
import { axios } from '@/utils/request'
export default {
  data () {
    return {
      baseApi: '/',
      customQueryParam: {},
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
    handleTableChange (pagination) {
      this.queryParam.pageIndex = pagination.current
      this.queryParam.pageSize = pagination.pageSize
      this.getList()
    },
    getList () {
      this.loadingData = true
      // 过滤掉不存在值的属性
      const tempQueryParam = {}
      // 合并自定义查询参数
      merge(tempQueryParam, this.customQueryParam)
      // 合并搜索参数
      merge(tempQueryParam, this.queryParam)
      console.log('query', tempQueryParam)
      axios({
        url: `${this.baseApi}/list`,
        params: tempQueryParam,
        method: 'get'
      }).then(res => {
        this.data = res.data
        this.afterLoadList(this.data)
        this.pagination.pageSize = res.page.pageSize
        this.pagination.current = res.page.pageIndex
        this.pagination.total = res.page.totalCount
        this.loadingData = false
      }).catch(e => {
        this.loadingData = false
      })
    },
    attachMore () {
      axios({
        url: `${this.baseApi}/attachMore`,
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
            url: `${_this.baseApi}/${id}`,
            method: 'delete'
          }).then((res) => {
            _this.$notification.success({
              message: '删除成功',
              description: '',
              duration: 2
            })
            _this.getList()
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
