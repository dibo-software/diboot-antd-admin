<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="state.visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-form layout="vertical" :form="form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="上级部门">
            <a-tree-select
              v-if="orgTreeList.length > 0"
              placeholder="请选择上级部门"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="orgTreeList"
              treeNodeFilterProp="title"
              showSearch
              treeDefaultExpandAll
              v-decorator="[
                'parentId',
                {
                  rules: [{ required: true, message: '请选择上级部门' }],
                  initialValue: model.parentId != null ? `${model.parentId}` : currentNodeId
                }
              ]"
            >
            </a-tree-select>
            <template v-else>
              无
            </template>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="编码">
            <a-input
              placeholder="编码"
              v-decorator="[
                'code',
                {
                  initialValue: model.code,
                  rules: [
                    { required: true, message: '编码不能为空', whitespace: true },
                    { validator: this.checkCodeDuplicate }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="全称">
            <a-input
              placeholder="全称"
              v-decorator="[
                'name',
                {
                  initialValue: model.name,
                  rules: [{ required: true, message: '全称不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="简称">
            <a-input
              placeholder="简称"
              v-decorator="[
                'shortName',
                {
                  initialValue: model.shortName,
                  rules: [{ required: true, message: '简称不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="类型">
            <a-select
              :getPopupContainer="getPopupContainer"
              placeholder="请选择类型"
              v-decorator="[
                'type',
                {
                  initialValue: model.type? model.type : 'DEPT',
                  rules: [{ required: true, message: '类型不能为空' }]
                }
              ]"
            >
              <a-select-option
                v-for="(type, index) in more.orgTypeOptions"
                :key="index"
                :value="type.value"
              >
                {{ type.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="负责人">
            <a-input
              type="hidden"
              placeholder="请选择负责人"
              v-decorator="[
                'managerId',
                {
                  initialValue: model.managerId
                }
              ]"
            />
            <span v-if="model.managerName">
              {{ model.managerName }}
            </span>
            <a-button type="link" @click="$refs.userSelectModal.open()">设置</a-button>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="备注">
            <a-textarea
              :rows="5"
              placeholder="备注"
              v-decorator="[
                'orgComment',
                {
                  initialValue: model.orgComment
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <div class="drawer-footer">
      <a-button @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">确定</a-button>
    </div>
    <user-select-modal ref="userSelectModal" @select="record => selectReportManager(record)"></user-select-modal>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
import { treeListFormatter } from '@/utils/treeDataUtil'
import _ from 'lodash'
import userSelectModal from '@/views/orgStructure/orgUser/UserSelectModal'

export default {
  name: 'IamOrgForm',
  data () {
    return {
      baseApi: '/iam/org',
      attachMoreList: [
        {
          target: 'ORG_TYPE'
        }
      ],
      form: this.$form.createForm(this),
      orgList: []
    }
  },
  mixins: [ form ],
  methods: {
    afterOpen () {
      dibootApi.get(`${this.baseApi}/tree`).then(res => {
        if (res.code === 0) {
          this.orgList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    selectReportManager (user) {
      this.model.managerName = user.realname
      this.form.setFieldsValue({
        managerId: user.id
      })
    },
    async checkCodeDuplicate (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.model.id, code: value }
      const res = await dibootApi.get(`${this.baseApi}/checkCodeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    }
  },
  computed: {
    parentId: function () {
      if (this.model == null || !this.model.parentId) {
        return this.currentNodeId.toString(10)
      }
      return this.model.parentId.toString(10)
    },
    orgTreeList: function () {
      if (this.orgList == null || this.orgList.length === 0) {
        return []
      }
      const orgTreeList = treeListFormatter(_.cloneDeep(this.orgList), 'id', 'shortName', true)
      orgTreeList.unshift({ title: '无', value: '0', key: '0' })
      return orgTreeList
    }
  },
  components: {
    userSelectModal
  },
  props: {
    currentNodeId: {
      type: String,
      default: () => {
        return '0'
      }
    }
  }
}
</script>

<style scoped>
</style>
