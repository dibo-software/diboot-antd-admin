<template>
  <div>
    <a-modal
      title="选择角色"
      :visible="visible"
      @ok="onSubmit()"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="岗位" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-select
            showSearch
            :filterOption="filterOption"
            v-decorator="[
              'positionId',
              {
                rules: [{ required: true, message: '请选择岗位' }],
                initialValue: currentNode
              }
            ]"
            placeholder="请选择岗位"
          >
            <a-select-option
              v-for="kv in sourceKvList"
              :key="kv.k"
              :value="kv.k">
              {{ kv.v }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="角色" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-row :gutter="8">
            <a-col :span="18">
              <a-select
                showSearch
                :filterOption="filterOption"
                v-decorator="[
                  'roleId',
                  { rules: [{ required: true, message: '请选择角色' }] },
                ]"
                placeholder="请选择角色"
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
                @click="$refs.roleFormModal.open()"
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
    <role-form-modal
      @refreshList="getTargetKvList"
      @changeKey="changeTargetId"
      ref="roleFormModal"></role-form-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import roleFormModal from '@/views/orgStructure/rolePermission/roleFormModal'
import refMultiForm from '@/components/diboot/mixins/refMultiForm'

const API = {
  sourceKvListAPI: '/iam/position/kvList',
  targetKvListAPI: '/iam/role/kvList',
  addTargetAPI: '/iam/role/'
}
export default {
  name: 'PositionRoleModal',
  components: {
    roleFormModal
  },
  data () {
    return {
      name: 'iam/positionRole',
      apiMap: _.cloneDeep(API)
    }
  },
  methods: {
    async open (currentNodeId) {
      if (currentNodeId !== undefined) {
        this.currentNodeId = currentNodeId
      }
      this.visible = true
      await this.getSourceKvList()
      await this.getTargetKvList()
    },
    changeTargetId (obj) {
      if (obj && obj.id) {
        let value
        if (typeof obj.id === 'number') {
          value = obj.id.toString(10)
        } else {
          value = obj.id
        }
        this.form.setFieldsValue({
          roleId: value
        })
      }
    }
  },
  mixins: [refMultiForm]
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
