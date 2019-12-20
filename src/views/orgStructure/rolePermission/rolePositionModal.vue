<template>
  <div>
    <a-modal
      title="选择岗位"
      :visible="visible"
      @ok="onSubmit()"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="部门" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-select
            showSearch
            :filterOption="filterOption"
            v-decorator="[
              'orgId',
              {
                rules: [{ required: true, message: '请选择部门' }],
                initialValue: currentNode
              }
            ]"
            placeholder="请选择部门"
          >
            <a-select-option
              v-for="kv in sourceKvList"
              :key="kv.k"
              :value="kv.k">
              {{ kv.v }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="岗位" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-row :gutter="8">
            <a-col :span="18">
              <a-select
                showSearch
                :filterOption="filterOption"
                v-decorator="[
                  'positionId',
                  { rules: [{ required: true, message: '请选择岗位' }] },
                ]"
                placeholder="请选择岗位"
              >
                <a-select-option
                  v-for="kv in targetKvList"
                  :key="kv.k"
                  :value="kv.k">
                  {{ kv.v }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-button
                @click="$refs.positionFormModal.open()"
                type="primary"
                icon="plus"
                ghost
                block>
                添加
              </a-button>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
    <position-form-modal ref="positionFormModal"></position-form-modal>
  </div>
</template>

<script>
import { dibootApi } from '@/utils/request'
import _ from 'lodash'
import positionFormModal from '@/views/orgStructure/rolePermission/positionFormModal'

const API = {
  sourceKvListAPI: '/iam/org/kvIndentList',
  targetKvListAPI: '/iam/position/kvList',
  addTargetAPI: '/iam/position/'
}
export default {
  name: 'RolePositionModal',
  components: {
    positionFormModal
  },
  data () {
    return {
      name: 'iam/orgPosition',
      sourceKvList: [],
      targetKvList: [],
      model: {},
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      apiMap: _.cloneDeep(API)
    }
  },
  methods: {
    async open () {
      this.visible = true
      await this.getSourceKvList()
      await this.getTargetKvList()
    },
    async getSourceKvList () {
      const res = await dibootApi.get(this.apiMap.sourceKvListAPI)
      if (res.code === 0) {
        this.sourceKvList = res.data
      }
    },
    async getTargetKvList () {
      const res = await dibootApi.get(this.apiMap.targetKvListAPI)
      if (res.code === 0) {
        this.targetKvList = res.data
      }
    },
    /***
     * 表单提交事件
     * @returns {Promise<void>}
     */
    async onSubmit (e) {
      this.confirmLoading = true
      try {
        const values = await this.validate()
        this.enhance(values)
        let result = {}
        if (this.model.id === undefined) {
          // 新增该记录
          result = await this.add(values)
        } else {
          // 更新该记录
          values['id'] = this.model.id
          result = await this.update(values)
        }
        // 执行提交失败后的一系列后续操作
        this.submitSuccess(result)
      } catch (error) {
        // 执行一系列后续操作
        this.submitFailed(error)
      }
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
      const res = await dibootApi.put(`/${this.name}/${this.model.id}`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '更新记录成功' }
      } else {
        throw new Error(res.msg)
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
      this.confirmLoading = false
      this.form.resetFields()
      this.$emit('refreshList')
      this.$emit('changeKey', result.data)
    },
    /***
     * 提交失败之后的处理
     * @param e
     */
    submitFailed (e) {
      this.confirmLoading = false

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
    validate () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            resolve(values)
          } else {
            reject(err)
          }
        })
      })
    },
    validateErrorToMsg (error) {
      if (!error) {
        return error
      }
      let msgs = []
      _.forEach(error, (value, key) => {
        msgs.push(...value.errors.map(item => {
          return item.message
        }))
      })
      return msgs.join(', ')
    },
    handleCancel (e) {
      this.visible = false
      this.form.resetFields()
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  },
  computed: {
    currentNode: function () {
      if (this.currentNodeId === undefined || this.currentNodeId === 0) {
        return undefined
      }
      if (typeof this.currentNodeId === 'number') {
        return this.currentNodeId.toString(10)
      }
      return this.currentNodeId
    }
  },
  mounted () {
    // let currentNode
    // if (this.currentNodeId !== undefined && this.currentNodeId !== 0) {
    //   if (typeof this.currentNodeId === 'number') {
    //     currentNode = this.currentNodeId.toString(10)
    //   } else {
    //     currentNode = this.currentNodeId
    //   }
    // }
    // this.form.setFieldsValue({
    //   orgId: currentNode
    // })
  },
  props: {
    currentNodeId: {
      type: Number,
      default: () => {
        return 0
      }
    }
  }
}
</script>

<style scoped>
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right
  }
</style>
