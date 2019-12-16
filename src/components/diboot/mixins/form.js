import { dibootApi } from '@/utils/request'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      model: {},
      title: '',
      state: {
        visible: false,
        submitBtn: false
      }
    }
  },
  computed: {
    // userInfo () {
    //   return this.$store.getters.userInfo
    // },
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
        const res = await dibootApi.get(`/${this.name}/${id}`)
        if (res.code === 0) {
          console.log(res.data)
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
      console.log('this.model--', this.model)
    },
    close () {
      this.state.visible = false
      this.model = {}
      this.form.resetFields()
    },
    /***
     * 提交前的验证流程
     * @returns {Promise<any>}
     */
    validate () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          console.log(err)
          console.log(values)
          if (!err) {
            resolve(values)
          } else {
            reject(err)
          }
          setTimeout(() => {
            this.state.submitBtn = false
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
      const res = await dibootApi.post(`/${this.name}/`, values)
      if (res.code === 0) {
        return '添加记录成功'
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
      const res = await dibootApi.put(`/${this.name}/${this.model.id}`, values)
      if (res.code === 0) {
        return '更新记录成功'
      } else {
        throw new Error(res.msg)
      }
    },
    /***
     * 表单提交事件
     * @returns {Promise<void>}
     */
    async onSubmit () {
      this.state.submitBtn = true
      const values = await this.validate()
      this.enhance(values)
      try {
        let msg = ''
        if (this.model.id === undefined) {
          values.createBy = this.userInfo.currentUserId
          // 新增该记录
          msg = await this.add(values)
        } else {
          // 更新该记录
          values['id'] = this.model.id
          msg = await this.update(values)
        }

        // 执行提交失败后的一系列后续操作
        this.submitSuccess(msg)
      } catch (e) {
        // 执行一系列后续操作
        this.submitFailed(e)
      }
    },
    /***
     * 提交成功之后的处理
     * @param msg
     */
    submitSuccess (msg) {
      this.$notification.success({
        message: '操作成功',
        description: msg
      })
      this.close()
      this.form.resetFields()
      this.$emit('refreshList')
    },
    /***
     * 提交失败之后的处理
     * @param e
     */
    submitFailed (e) {
      this.$notification.error({
        message: '操作失败',
        description: e.message || e.msg || e
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

    }
  }
}
