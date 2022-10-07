import { dibootApi } from '@/utils/request'
import { mapGetters } from 'vuex'
import moment from 'moment'
import more from './more'

export default {
  mixins: [more],
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
      // 当前组件状态对象
      state: {
        // 当前抽屉/模态框是否显示
        visible: false,
        // 当前表单提交按钮状态
        confirmSubmit: false,
        // 当前表单数据加载状态
        formDataLoading: false
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
      fileUuidList: [],
      /**
       * 文件前缀
       */
      filePrefix: '',
      /**
       * 当前关联的对象名称
       */
      relObjType: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    moment,
    async open (id) {
      this.state.visible = true
      if (id == null) {
        // 没有id数据则认为是新建
        this.model = {}
        this.title = '新建'
        this.afterOpen()
      } else {
        // 否则作为更新处理
        this.state.formDataLoading = true
        try {
          const res = await dibootApi.get(`${this.baseApi}/${id}`)
          if (res.code === 0) {
            this.model = res.data
            this.title = '更新'
            this.state.visible = true
            this.state.formDataLoading = false
            this.afterOpen(id)
          } else {
            this.$notification.error({
              message: '获取表单数据失败，请重试',
              description: res.msg
            })
            this.close()
            return false
          }
        } catch (e) {
          this.$message.error('获取数据出错，请重试')
          this.close()
          return false
        }
      }
      await this.attachMore()
    },
    /**
     * 关闭表单
     */
    close () {
      this.state.visible = false
      this.state.formDataLoading = false
      this.model = {}
      this.__defaultFileWrapperKeys__()
      this.form.resetFields()
      this.afterClose()
    },
    /**
     * 点击级联类型后，加载select数据
     */
    handleCascaderSelectNext (data, clearParams = []) {
      // 将级联已经选中的统一清理
      clearParams.forEach(param => delete this.queryParam[param])
      // 选中的数据初始化
      Object.assign(this.more, data)
      this.$forceUpdate()
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
            this.state.confirmSubmit = false
            reject(err)
          }
        })
      })
    },
    /***
     * 提交前对数据的处理（在验证正确之后的处理）
     * @param values
     */
    async enhance (values) {
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
      try {
        const values = await this.validate()
        await this.enhance(values)
        let result = {}
        if (this.model[this.primaryKey] == null) {
          // 新增该记录
          result = await this.add(values)
        } else {
          // 更新该记录
          values[this.primaryKey] = this.model[this.primaryKey]
          result = await this.update(values)
        }

        // 执行提交成功后的一系列后续操作
        this.state.confirmSubmit = false
        this.submitSuccess(result)
      } catch (e) {
        // 执行一系列后续操作
        this.state.confirmSubmit = false
        this.submitFailed(e)
      }
    },
    /***
     * 提交成功之后的处理
     * @param msg
     */
    submitSuccess (result) {
      this.state.confirmSubmit = false
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
      this.state.confirmSubmit = false
      this.$notification.error({
        message: '操作失败',
        description: msg
      })
    },
    validateErrorToMsg (err) {
      return err.message
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
    /**
     * 清除form内容
     */
    clearForm () {
      this.form.resetFields()
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
     * 回显指定属性的图片文件
     * @param id 当前model的id
     * @param relObjField 字段名
     */
    echoImgFile (id, relObjField) {
      dibootApi.get(`/uploadFile/getList/${id}/${this.relObjType}/${relObjField}`).then(res => {
        if (res.code === 0 && res.data && res.data.length > 0) {
          res.data.forEach(data => {
            this.fileWrapper[`${relObjField}List`].push(this.fileFormatter(data, true))
          })
        }
      })
    },
    /**
     * 文件数据转化
     * @param data 相应的数据
     * @param isImage 是否是图片
     * @returns {{uid: ((function(): *)|*|(function(): *)), response: string, filePath: *, name: (*|string), status: string}}
     */
    fileFormatter (data, isImage) {
      const { uuid: uid, fileName: name, accessUrl } = data
      const file = {
        uid, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
        name, // 文件名
        status: 'done', // 状态有：uploading done error removed
        response: '{"status": "success"}', // 服务端响应内容
        filePath: data.accessUrl
      }
      isImage && Object.assign(file, {
        url: `${this.filePrefix}${accessUrl}/image`,
        thumbUrl: `${this.filePrefix}${accessUrl}/image`
      })
      return file
    },
    /**
     * 设置文件uuid
     * @private
     */
    __setFileUuidList__ (values) {
      // 如果包含上传功能，那么设置uuid
      if (this.isUpload) {
        this.fileUuidList = []
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
