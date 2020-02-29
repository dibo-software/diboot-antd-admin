<template>
  <a-drawer
    :title="title"
    :width="800"
    :visible="state.visible"
    @close="close"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-form :form="form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="编码">
            <a-input
              placeholder="编码"
              v-decorator="[
                'code',
                {
                  initialValue: model.code,
                  rules: [{ required: true, message: '编码不能为空', whitespace: true }, { validator: checkCodeDuplicate }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="角色名称">
            <a-input
              placeholder="角色名称"
              v-decorator="[
                'name',
                {
                  initialValue: model.name,
                  rules: [{ required: true, message: '角色名称不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item
            label="描述"
          >
            <a-textarea
              :rows="3"
              v-decorator="[
                'description',
                {
                  initialValue: model.description
                }
              ]"
              placeholder="..." />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="角色授权">
            <a-row>
              <template v-if="isAdmin">
                <a-col :span="20">
                  <a-tag>拥有所有权限</a-tag>
                </a-col>
              </template>
              <template v-else>
                <a-col :span="20">
                  <a-tree
                    v-if="permissionTreeList.length > 0"
                    showIcon
                    checkable
                    checkStrictly
                    :defaultExpandAll="true"
                    v-model="checkedKeys"
                    :treeData="permissionTreeList"
                  >
                    <a-icon slot="menu" type="bars" />
                    <a-icon slot="permission" type="thunderbolt" />
                  </a-tree>
                </a-col>
              </template>
            </a-row>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <div class="footer" >
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.submitBtn" :disabled="state.submitBtn">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { dibootApi } from '@/utils/request'
import form from '@/components/diboot/mixins/form'
import { permissionTreeListFormatter, treeList2list } from '@/utils/treeDataUtil'
import _ from 'lodash'

export default {
  name: 'RoleForm',
  props: {
    more: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mixins: [ form ],
  data () {
    return {
      baseApi: '/iam/role',
      form: this.$form.createForm(this),
      isAdmin: false,
      permissionTreeList: [],
      checkedKeys: []
    }
  },
  methods: {
    async afterOpen (id) {
      // 是否为超级管理员
      if (this.model && this.model.code && this.model.code.toUpperCase() === 'SUPER_ADMIN') {
        this.isAdmin = true
      }

      // 设置checkedKeys初值
      if (this.model && this.model.permissionList) {
        this.checkedKeys = this.model.permissionList.map(item => {
          return item.id
        })
      }

      // 获取系统中所有的permissionList
      const res = await dibootApi.get(`/iam/frontendPermission/allList`)
      if (res.code === 0) {
        if (!res.data || res.data.length === 0){
          this.$message.error('请先添加菜单及权限')
        } else {
          this.permissionTreeList = permissionTreeListFormatter(res.data, 'id', 'displayName')
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    close () {
      this.state.visible = false
      this.model = {}
      this.permissionTreeList = []
      this.checkedKeys = []
      this.form.resetFields()
      this.isAdmin = false
    },
    async checkCodeDuplicate (rule, value, callback) {
      const params = { id: this.model.id, code: value }
      const res = await dibootApi.get(`${this.baseApi}/checkCodeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    },
    enhance (values) {
      const checkedIdList = this.checkedKeys.checked
      // 自动选择没有选到的父级
      checkedIdList.forEach(id => {
        const permission = this.permissionList.find(item => {
          return item.value === id
        })
        if (permission !== undefined && permission.parentId !== undefined && !checkedIdList.includes(permission.parentId)) {
          checkedIdList.push(permission.parentId)
        }
      })
      values.permissionIdList = this.checkedKeys.checked
    }
  },
  computed: {
    permissionList: function () {
      if (!this.permissionTreeList || this.permissionTreeList.length === 0) {
        return []
      }
      return treeList2list(_.cloneDeep(this.permissionTreeList))
    }
  }
}
</script>

<style lang="less" scoped>
  .footer{
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
