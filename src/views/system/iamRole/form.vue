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
import { permissionTreeListFormatter, treeList2list, tree2List } from '@/utils/treeDataUtil'
import _ from 'lodash'
/**
 * 收集树节点上所有父节点
 * @param parentId 父节点
 * @param dataList 子节点
 * @param result 存储结果
 * @param transformField 字段转化
 */
const collectDeepParent = (parentId, dataList, result) => {
  if (parentId === '0') return
  const data = (dataList.find(val => collectField(val, 'id') === parentId) || {})
  data && result.push(data)
  collectDeepParent((data['parentId'] || '0'), dataList, result)
}
/**
 * 收集对象中的指定字段
 * @param data 对象
 * @param fieldName 对象的属性名
 * @param defaultValue 属性默认值，不设置默认值，表示对象中一定可以获取到非null、非undefined值
 */
const collectField = (data, fieldName, defaultValue) => {
  const val = data[fieldName]
  return defaultValue ? (val || defaultValue) : val
}
// /**
//  * 收集指定字段列表
//  * @param dataList 对象列表
//  * @param fieldName 对象的名称
//  * @param defaultValue 属性默认值
//  */
const collectFieldList = (dataList, fieldName, defaultValue) => {
  return dataList.map(val => collectField(val, fieldName, defaultValue))
}
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
      originTreeList: [],
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
          this.originTreeList = res.data
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
      // 将原始的节点树转化成list
      const originList = tree2List(this.originTreeList)
      // 获取当前节点，及当前节点的子节点
      const currentNode = originList.find(item => item.id === value)
      const result = [currentNode]
      const currentChildrenResult = tree2List(currentNode.children || []) || []
      result.push(...currentChildrenResult)
      if (checked === true) {
        // 如果具有上级节点，则自动选择所有的父级节点（上级菜单必选，否则设置无效）
        this.deepCheckParentNode(value)
        result.forEach(item => {
          this.autoCheckNode(item.id)
        })
      } else {
        const currentWithChildrenIdResult = collectFieldList(result, 'id')
        const parentResult = []
        // 收集当前父节点
        collectDeepParent(currentNode.parentId, originList, parentResult)
        const parentIdResult = collectFieldList(parentResult, 'id')
        // 合并相当点击的节点的子项和父级节点id
        const mergeValues = [...currentWithChildrenIdResult, ...parentIdResult]
        // 查找父项下的所有子项(包含父项)
        const allParentWithChildrenData = tree2List(parentResult)
        // 获取抛开当前节点下的所有子项和当前节点下所有父项 的剩余项
        const remainValues = collectFieldList(allParentWithChildrenData, 'id').filter(
          val => !mergeValues.includes(val)
        )
        // 判断剩余节点是否存在已选中的节点中, 当前节点的父级下有其他子节点，那么只移除当前节点及子节点，如果父级下无其他子节点，那么移除当前节点的父节点和子节点
        const resultValues = checkedKeys.checked.some(val => remainValues.includes(val)) ? currentWithChildrenIdResult : mergeValues
        resultValues.forEach(item => {
          this.autoUnCheckNode(item)
        })
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
