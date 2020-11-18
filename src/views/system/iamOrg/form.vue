<template>
  <a-drawer
    :title="title"
    :width="720"
    @close="close"
    :visible="state.visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-form layout="vertical" :form="form">
      <a-row :gutter="16">
        <a-col :span="24">
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
                  initialValue: model.parentId !== undefined ? `${model.parentId}` : currentNodeId
                }
              ]"
            >
            </a-tree-select>
            <template v-else>
              无
            </template>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="简称">
            <a-input
              placeholder="请输入简称"
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
        <a-col :span="24">
          <a-form-item label="名称">
            <a-input
              placeholder="请输入名称"
              v-decorator="[
                'name',
                {
                  initialValue: model.name,
                  rules: [{ required: true, message: '名称不能为空', whitespace: true }]
                }
              ]"
            />
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
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
import { treeListFormatter } from '@/utils/treeDataUtil'
import _ from 'lodash'

export default {
  name: 'IamOrgForm',
  mixins: [form],
  data () {
    return {
      baseApi: '/iam/org',
      form: this.$form.createForm(this),
      orgList: []
    }
  },
  methods: {
    afterOpen () {
      dibootApi.get(`${this.baseApi}/tree`).then(res => {
        if (res.code === 0) {
          this.orgList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  },
  computed: {
    parentId: function () {
      if (this.model === undefined || !this.model.parentId) {
        return this.currentNodeId.toString(10)
      }
      return this.model.parentId.toString(10)
    },
    orgTreeList: function () {
      if (this.orgList === undefined || this.orgList.length === 0) {
        return []
      }
      const orgTreeList = treeListFormatter(_.cloneDeep(this.orgList), 'id', 'shortName', true)
      orgTreeList.unshift({ title: '无', value: '0', key: '0' })
      return orgTreeList
    }
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
<style lang="less" scoped>
</style>
