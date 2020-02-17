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
      <a-divider />
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="拥有权限">
            <a-row :gutter="16" v-for="(permission, idx) in permissionList" :key="idx">
              <template v-if="isAdmin">
                <a-col :span="4">
                  {{ permission.name }}：
                </a-col>
                <a-col :span="20">
                  <a-tag>所有权限</a-tag>
                </a-col>
              </template>
              <template v-else>
                <a-col :span="4">
                  <a-checkbox
                    :indeterminate="permission.indeterminate"
                    @change="onCheckAllChange($event, permission)"
                    :checked="permission.checked"
                  >
                    {{ permission.name }}：
                  </a-checkbox>
                </a-col>
                <a-col :span="20">
                  <a-checkbox-group
                    @change="changePermission($event, permission)"
                    v-model="permissionIdsMap[permission.id]"
                  >
                    <a-checkbox
                      v-for="(item, index) in permission.children"
                      :key="index"
                      :value="item.id"
                    >
                      {{ item.operationName }}
                    </a-checkbox>
                  </a-checkbox-group>
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
import forEach from 'lodash.foreach'
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
      permissionList: [],
      permissionIdsMap: {}
    }
  },
  methods: {
    /***
     * 新建记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async add (values) {
      const res = await dibootApi.post(`${this.baseApi}/create`, values)
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
      const res = await dibootApi.put(`${this.baseApi}/update/${this.model.id}`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '更新记录成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    async afterOpen (id) {
      // 是否为超级管理员
      if (this.model && this.model.code && this.model.code.toUpperCase() === 'SUPER_ADMIN') {
        this.isAdmin = true
      }

      // 获取系统中所有的permissionList
      const res = await dibootApi.get(`/iam/permission/list`, { parentId: 0 })
      if (res.code === 0) {
        this.permissionList = res.data
      }
      // 获取所有已设置的权限
      let allSelectedIds = []
      if (this.model && this.model.permissionList && this.model.permissionList.length > 0) {
        allSelectedIds = this.model.permissionList.map(per => {
          return per.id
        })
      }
      this.permissionList.forEach(per => {
        const selectIds = []
        if (per.children && per.children.length > 0) {
          per.children.forEach(item => {
            if (allSelectedIds.includes(item.id)) {
              selectIds.push(item.id)
            }
          })
        }
        this.permissionIdsMap[per.id] = selectIds

        // 对全选按钮的选中状态进行处理
        per.indeterminate = !!selectIds.length && selectIds.length < per.children.length
        per.checked = selectIds.length === per.children.length
      })
    },
    onCheckAllChange (e, permission) {
      const checked = e.target.checked
      if (checked) {
        if (permission.children && permission.children.length > 0) {
          this.permissionIdsMap[permission.id] = permission.children.map(per => {
            return per.id
          })
        }
      } else {
        this.permissionIdsMap[permission.id] = []
      }
      // 改变全选按钮状态
      Object.assign(permission, {
        indeterminate: false,
        checked: e.target.checked
      })
      this.$forceUpdate()
    },
    changePermission (e, permission) {
      this.permissionIdsMap[permission.id] = e
      permission.indeterminate = !!this.permissionIdsMap[permission.id].length && this.permissionIdsMap[permission.id].length < permission.children.length
      permission.checked = this.permissionIdsMap[permission.id].length === permission.children.length
      this.$forceUpdate()
    },
    close () {
      this.state.visible = false
      this.model = {}
      this.permissionIdsMap = {}
      this.permissionList = []
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
      const permissionIds = []
      forEach(this.permissionIdsMap, (value, key) => {
        permissionIds.push(...value)
      })
      values.permissionIdList = permissionIds
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
