import { dibootApi } from '@/utils/request'
import moment from 'moment'
import { downloadFileFromPath } from '@/utils/fileUtil'

export default {
  data () {
    return {
      // 请求接口基础路径
      baseApi: '/',
      // 当前组件显示状态
      visible: false,
      // 当前详情框详情数据
      model: {},
      // 标题
      title: '',
      // loading状态
      spinning: false
    }
  },
  methods: {
    moment,
    /**
     * 打开详细页
     * @param id
     * @returns {Promise<void>}
     */
    async open (id) {
      const res = await dibootApi.get(`${this.baseApi}/${id}`)
      if (res.code === 0) {
        this.model = res.data
        this.title = '详情'
        this.visible = true
        this.afterOpen(id)
      } else {
        this.$notification.error({
          message: '获取详情信息失败',
          description: res.msg
        })
      }
    },
    /**
     * 下载文件
     * @param path
     */
    async downloadFile (path) {
      await downloadFileFromPath(path)
    },
    /**
     * 关闭详情
     */
    close () {
      this.visible = false
      this.model = {}
      this.afterClose()
    },
    /****
     * 打开详情之后的操作
     * @param id
     */
    afterOpen (id) {

    },
    afterClose () {

    }
  },
  props: {
    width: {
      type: Number,
      default: () => {
        return 720
      }
    }
  }
}
