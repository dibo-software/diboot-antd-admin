<template>
  <a-drawer
    title="选择岗位"
    width="720"
    :visible="state.visible"
    @close="close"
    class="content"
    :body-style="{ paddingBottom: '80px' }"
  >
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="addUserPosition">添加人员岗位设置</a-button>
      <a-button v-action:addPosition type="default" icon="plus" @click="$refs.positionForm.open()">添加岗位</a-button>
    </div>
    <a-form-model ref="form" layout="inline" :model="form" :rules="formRules">
      <template v-for="(item, i) in form.userPositionList">
        <a-row :key="item.id">
          <a-form-model-item
            label="岗位"
            :prop="`userPositionList.${i}.positionId`"
          >
            <a-select
              v-model="item.positionId"
              placeholder="请选择岗位列表"
              style="width: 160px;"
            >
              <a-select-option
                v-for="(option, index) in more.iamPositionOptions"
                :key="index"
                :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="组织"
            :prop="`userPositionList.${i}.orgId`"
          >
            <a-tree-select
              v-if="orgTreeList.length > 0"
              placeholder="请选择组织部门"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="orgTreeList"
              treeNodeFilterProp="title"
              :showSearch="true"
              treeDefaultExpandAll
              v-model="item.orgId"
              style="width: 200px;"
            >
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item
            label="主岗"
          >
            <a-switch
              v-model="item.isPrimaryPosition"
              checked-children="是"
              un-checked-children="否"/>
          </a-form-model-item>
          <a-form-model-item>
            <a-button
              @click="removeUserPosition(i)"
              size="small"
              type="danger"
              icon="delete">
            </a-button>
          </a-form-model-item>
        </a-row>
      </template>
    </a-form-model>

    <position-form
      ref="positionForm"
      @complete="attachMore"
    />

    <div class="drawer-footer">
      <a-button @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmLoading" :disabled="state.confirmLoading">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import positionForm from '@/views/orgStructure/position/form'
import { dibootApi } from '@/utils/request'
import form from '@/components/diboot/mixins/form'
import { treeListFormatter } from '@/utils/treeDataUtil'
import _ from 'lodash'

const USER_POSITION_ITEM = {
  userType: 'IamUser',
  userId: '0',
  positionId: '',
  orgId: '0',
  isPrimaryPosition: false
}

export default {
  name: 'UserPositionRefForm',
  data () {
    return {
      baseApi: '/iam/userPosition',
      attachMoreList: [
        {
          target: 'IamPosition',
          label: 'name'
        }
      ],
      user: {},
      orgList: [],
      form: {
        userPositionList: []
      }
    }
  },
  methods: {
    async open (user) {
      this.user = user
      this.state.visible = true
      this.attachMore()
      this.loadUserPositionList(user.id)
      this.loadOrgList()
    },
    addUserPosition () {
      // 复制一份用户岗位对象
      const item = _.cloneDeep(USER_POSITION_ITEM)
      // 设置用户岗位对象的组织部门为当前用户默认的部门
      item.orgId = `${this.user.orgId}`
      // 添加当前用户岗位对象
      this.form.userPositionList.push(item)
      this.$forceUpdate()
    },
    removeUserPosition (index) {
      this.form.userPositionList.splice(index, 1)
      this.$forceUpdate()
    },
    loadOrgList () {
      dibootApi.get('/iam/org/tree').then(res => {
        if (res.code === 0) {
          this.orgList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    loadUserPositionList (value) {
      if (!value) {
        return false
      }
      // 当部门改变后，需要获取当前部门已配置的岗位列表，并回显到当前表单中
      dibootApi.get(`/iam/position/listUserPositions/IamUser/${value}`).then(res => {
        const data = res.data
        if (data && data.length > 0) {
          data.forEach(item => {
            // 转为String类型
            item.positionId = `${item.positionId}`
            item.orgId = `${item.orgId}`
            // 组织部门为0时，默认设置当前用户orgId
            if (item.orgId === '0' || !item.orgId) {
              item.orgId = `${this.user.orgId}`
            }
            this.form.userPositionList = res.data
          })
        }
      }).catch(() => {
        this.form.userPositionList = []
      })
    },
    async onSubmit () {
      try {
        this.state.confirmSubmit = true
        await this.formModelValidate()
        const values = {
          userType: 'IamUser',
          userId: this.user.id,
          userPositionList: this.form.userPositionList
        }
        const res = await dibootApi.post('/iam/position/batchUpdateUserPositionRelations', values)
        this.state.confirmSubmit = false
        if (res.code === 0) {
          // 执行提交失败后的一系列后续操作
          this.submitSuccess(res)
        } else {
          // 执行一系列后续操作
          this.submitFailed(res.msg)
        }
      } catch (error) {
        this.state.confirmSubmit = false
      }
    },
    /***
     * 提交前的验证流程
     * @returns {Promise<any>}
     */
    formModelValidate () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve()
          } else {
            reject(new Error('请完善表单'))
          }
          setTimeout(() => {
            this.state.confirmSubmit = false
          }, 600)
        })
      })
    },
    close () {
      this.state.visible = false
      this.state.formDataLoading = false
      this.model = {}
      this.__defaultFileWrapperKeys__()
      this.$refs.form.resetFields()
      this.user = {}
      this.more.iamPositionOptions = []
      this.orgList = []
      this.form.userPositionList = []
    }
  },
  computed: {
    orgTreeList: function () {
      if (this.orgList == null || this.orgList.length === 0) {
        return []
      }
      const orgTreeList = treeListFormatter(_.cloneDeep(this.orgList), 'id', 'shortName', true)
      orgTreeList.unshift({ title: '无', value: '0', key: '0' })
      return orgTreeList
    },
    formRules: function () {
      const rules = {}
      if (!this.form.userPositionList || this.form.userPositionList.length === 0) {
        return rules
      }
      for (let i = 0; i < this.form.userPositionList.length; i++) {
        rules[`userPositionList.${i}.positionId`] = [{ required: true, message: '请选择岗位', trigger: 'blur' }]
        rules[`userPositionList.${i}.orgId`] = [{ required: true, message: '请选择组织部门', trigger: 'blur' }]
      }
      return rules
    }
  },
  components: {
    positionForm
  },
  mixins: [form]
}
</script>

<style scoped>
</style>
