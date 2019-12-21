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
    <position-form-modal
      @refreshList="getTargetKvList"
      @changeKey="changeTargetId"
      ref="positionFormModal"></position-form-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import positionFormModal from '@/views/orgStructure/rolePermission/positionFormModal'
import refMultiForm from '@/components/diboot/mixins/refMultiForm'

const API = {
  sourceKvListAPI: '/iam/org/kvIndentList',
  targetKvListAPI: '/iam/position/kvList',
  addTargetAPI: '/iam/position/'
}
export default {
  name: 'OrgPositionModal',
  components: {
    positionFormModal
  },
  data () {
    return {
      name: 'iam/orgPosition',
      apiMap: _.cloneDeep(API)
    }
  },
  methods: {
    changeTargetId (obj) {
      if (obj && obj.id) {
        let value
        if (typeof obj.id === 'number') {
          value = obj.id.toString(10)
        } else {
          value = obj.id
        }
        this.form.setFieldsValue({
          positionId: value
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
