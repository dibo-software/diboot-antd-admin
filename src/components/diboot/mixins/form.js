import { dibootApi } from '@/utils/request'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      // 主键字段名
      primaryKey: 'id',
      // 请求接口基础路径
      baseApi: '/',
      // 新建接口
      createApi: '',
      // 更新接口
      updateApiPrefix: '',
      // label 默认布局样式
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      // form控件默认布局样式
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // 存放数据
      model: {},
      // 标题
      title: '',
      // 关联相关的更多数据
      more: {},
      // 获取关联数据列表的配置列表
      attachMoreList: [],
      // 是否使mixin在当前业务的attachMore接口中自动获取关联数据
      getMore: false,
      // 当前组件状态对象
      state: {
        visible: false,
        confirmSubmit: false
      },
      // 当前form是否包含上传
      isUpload: false,
      /**
       * 所有文件的集合都放置与fileWrapper对象中，提交的时候会自动遍历
       * 格式如下：
       * fileWrapper: {
       *  singleImageList: [],
       *  multiImageList: [],
       *  singleFileList: [],
       *  multiFileList: []
       * }
       */
      fileWrapper: {},
      /**
       * uuid集合
       */
      fileUuidList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    moment,
    async open (id) {
      if (id === undefined) {
        // 没有id数据则认为是新建
        this.model = {}
        this.title = '新建'
        this.state.visible = true
        this.afterOpen()
      } else {
        // 否则作为更新处理
        const res = await dibootApi.get(`${this.baseApi}/${id}`)
        if (res.code === 0) {
          this.model = res.data
          this.title = '更新'
          this.state.visible = true
          this.afterOpen(id)
        } else {
          this.$notification.error({
            message: '获取详情失败',
            description: res.msg
          })
        }
      }
      await this.attachMore()
    },
    /**
     * 关闭表单
     */
    close () {
      this.state.visible = false
      this.model = {}
      this.__defaultFileWrapperKeys__()
      this.form.resetFields()
      this.afterClose()
    },
    /***
     * 提交前的验证流程
     * @returns {Promise<any>}
     */
    validate () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            resolve(values)
          } else {
            reject(err)
          }
          setTimeout(() => {
            this.state.confirmSubmit = false
          }, 600)
        })
      })
    },
    /***
     * 提交前对数据的处理（在验证正确之后的处理）
     * @param values
     */
    enhance (values) {
    },
    /***
     * 新建记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async add (values) {
      const createApi = this.createApi ? this.createApi : '/'
      const res = await dibootApi.post(`${this.baseApi}${createApi}`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '添加记录成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    /***
     * 更新记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async update (values) {
      const updateApiPrefix = this.updateApiPrefix ? this.updateApiPrefix : ''
      const res = await dibootApi.put(`${this.baseApi}${updateApiPrefix}/${this.model[this.primaryKey]}`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '更新记录成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    /***
     * 表单提交事件
     * @returns {Promise<void>}
     */
    async onSubmit () {
      this.state.confirmSubmit = true
      const values = await this.validate()
      this.enhance(values)
      try {
        let result = {}
        if (this.model[this.primaryKey] === undefined) {
          // 新增该记录
          result = await this.add(values)
        } else {
          // 更新该记录
          values[this.primaryKey] = this.model[this.primaryKey]
          result = await this.update(values)
        }

        // 执行提交成功后的一系列后续操作
        this.submitSuccess(result)
      } catch (e) {
        // 执行一系列后续操作
        this.submitFailed(e)
      }
    },
    /***
     * 提交成功之后的处理
     * @param msg
     */
    submitSuccess (result) {
      this.$notification.success({
        message: '操作成功',
        description: result.msg
      })
      this.close()
      this.form.resetFields()
      this.$emit('complete')
      this.$emit('changeKey', result.data)
    },
    /***
     * 提交失败之后的处理
     * @param e
     */
    submitFailed (e) {
      // 如果是字符串，直接提示
      let msg
      if (typeof e === 'string') {
        msg = e
      } else {
        msg = e.message || e.msg
      }

      // 如果还没有消息内容，则可能是校验错误信息，进行校验错误信息提取
      if (!msg && typeof e === 'object') {
        msg = this.validateErrorToMsg(e)
      }
      this.$notification.error({
        message: '操作失败',
        description: msg
      })
    },
    // 解决带有下拉框组件在滚动时下拉框不随之滚动的问题
    getPopupContainer (trigger) {
      return trigger.parentElement
    },
    /****
     * 打开表单之后的操作
     * @param id
     */
    afterOpen (id) {

    },
    afterClose () {

    },
    async attachMore () {
      let res = {}
      if (this.getMore === true) {
        res = await dibootApi.get(`${this.baseApi}/attachMore`)
      } else if (this.attachMoreList.length > 0) {
        res = await dibootApi.post('/common/attachMore', this.attachMoreList)
      }
      if (res.code === 0) {
        this.more = res.data
        return res.data
      }
    },
    /***
     * select选择框启用search功能后的过滤器
     * @param input
     * @param option
     * @returns {boolean}
     */
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    /**
     * 设置文件uuid
     * @private
     */
    __setFileUuidList__ (values) {
      // 如果包含上传功能，那么设置uuid
      if (this.isUpload) {
        const fileWrapperKeys = Object.keys(this.fileWrapper)
        if (fileWrapperKeys.length > 0) {
          for (const fileWrapperKey of fileWrapperKeys) {
            const tempFileList = this.fileWrapper[fileWrapperKey]
            if (tempFileList && tempFileList.length && tempFileList.length > 0) {
              this.fileUuidList.push(...tempFileList.map(item => item.uid))
            }
          }
          values['fileUuidList'] = this.fileUuidList
        }
      }
    },
    /**
     * 初始化fileWrapper
     * @private
     */
    __defaultFileWrapperKeys__ () {
      const fileWrapperKeys = Object.keys(this.fileWrapper)
      if (fileWrapperKeys.length > 0) {
        for (const fileWrapperKey of fileWrapperKeys) {
          this.fileWrapper[fileWrapperKey] = []
        }
      } else {
        this.fileWrapper = {}
      }
      this.fileUuidList = []
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
