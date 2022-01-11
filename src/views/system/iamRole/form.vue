<template>
  <a-drawer
    :title="`${title}角色`"
    :width="width"
    :visible="state.visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-form :form="form">
      <a-row :gutter="16">
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
        <a-col :span="12">
          <a-form-item label="角色编码">
            <a-input
              placeholder="角色编码"
              v-decorator="[
                'code',
                {
                  initialValue: model.code,
                  rules: [{ required: true, message: '角色编码不能为空', whitespace: true }, { validator: checkCodeDuplicate }]
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
            <template v-if="isAdmin">
              <a-tag>拥有所有权限</a-tag>
            </template>
            <template v-else>
              <flat-tree
                v-if="permissionTreeList.length > 0"
                showIcon
                checkable
                checkStrictly
                @check="onNodeCheck"
                :defaultExpandAll="true"
                v-model="checkedKeys"
                :treeData="permissionTreeList"
              >
                <a-icon slot="menu" type="bars" />
                <a-icon slot="permission" type="thunderbolt" />
              </flat-tree>
            </template>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <div class="drawer-footer">
      <a-button @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { dibootApi } from '@/utils/request'
import form from '@/components/diboot/mixins/form'
import FlatTree from '@/components/FlatTree'
import { permissionTreeListFormatter, treeList2list, list2childrenMap } from '@/utils/treeDataUtil'
import _ from 'lodash'

export default {
  name: 'IamRoleForm',
  components: { FlatTree },
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
      const res = await dibootApi.get(`/iam/resourcePermission/list`)
      if (res.code === 0) {
        if (!res.data || res.data.length === 0) {
          this.$message.error('请先添加菜单及权限')
        } else {
          this.permissionTreeList = permissionTreeListFormatter(res.data, 'id', 'displayName')
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    /***
     * 节点选中时的处理事件
     * 当选中的是父节点时，全选所有子节点
     * 当取消选中的是父节点时，取消所有子节点选择
     * @param checkedKeys
     * @param e
     */
    onNodeCheck (checkedKeys, e) {
      const { value } = e.node
      const checked = e.checked
      if (checked === true) {
        // 如果具有上级节点，则自动选择所有的父级节点（上级菜单必选，否则设置无效）
        this.deepCheckParentNode(value)
        // 如果具有下级权限节点，则自动选择所有权限列表（默认操作，可去除）
        const children = this.childrenMap[value]
        if (this.withoutMenuChildren(children)) {
          children.forEach(item => {
            this.autoCheckNode(item.value)
          })
        }
      } else {
        // 如果具有下级权限节点，则自动取消选择所有的父级节点（下级菜单必须取消，否则设置无效）
        this.deepUnCheckChildrenNode(value)
      }
    },
    /***
     * 逐级选中所有父节点
     * @param value
     */
    deepCheckParentNode (value) {
      const currentPermission = this.permissionList.find(item => {
        return item.value === value
      })
      if (currentPermission != null && currentPermission.parentId && currentPermission.parentId !== 0) {
        this.autoCheckNode(currentPermission.parentId)
        this.deepCheckParentNode(currentPermission.parentId)
      }
    },
    /***
     * 逐级取消选中所有子节点
     * @param value
     */
    deepUnCheckChildrenNode (value) {
      const children = this.childrenMap[value]
      if (children != null && children.length > 0) {
        children.forEach(item => {
          this.autoUnCheckNode(item.value)
          this.deepUnCheckChildrenNode(item.value)
        })
      }
    },
    autoCheckNode (value) {
      const checkedIdList = this.checkedKeys.checked
      if (!checkedIdList.includes(value)) {
        checkedIdList.push(value)
      }
    },
    autoUnCheckNode (value) {
      const checkedIdList = this.checkedKeys.checked
      if (checkedIdList.includes(value)) {
        _.pull(checkedIdList, value)
      }
    },
    withoutMenuChildren (children) {
      if (children == null || children.length === 0) {
        return false
      }
      const permission = children.find(item => {
        return item.type === 'MENU'
      })
      return permission == null
    },
    afterClose () {
      this.permissionTreeList = []
      this.checkedKeys = []
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
      const checkedIdList = this.checkedKeys.checked ? this.checkedKeys.checked : []
      // 自动选择没有选到的父级
      checkedIdList.forEach(id => {
        const permission = this.permissionList.find(item => {
          return item.value === id
        })
        if (permission != null && permission.parentId != null && !checkedIdList.includes(permission.parentId)) {
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
    },
    childrenMap: function () {
      return list2childrenMap(this.permissionList)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
