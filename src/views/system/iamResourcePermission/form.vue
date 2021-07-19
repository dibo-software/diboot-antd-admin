<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="state.visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-form layout="vertical" :form="form" class="iamResourcePermissionForm">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="上级菜单">
            <a-tree-select
              placeholder="请选择上级菜单"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="menuTreeDataFilter(model.id)"
              treeNodeFilterProp="title"
              showSearch
              treeDefaultExpandAll
              v-decorator="[
                'parentId',
                {
                  initialValue: model.parentId !== undefined ? model.parentId.toString() : initParentId,
                  rules: [{ required: true, message: '上级菜单不能为空', whitespace: true }]
                }
              ]"
            >
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="当前菜单选取">
            <a-tree-select
              v-if="routerTreeList.length > 0"
              placeholder="请选取当前菜单"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="routerTreeList"
              treeNodeFilterProp="title"
              showSearch
              treeDefaultExpandAll
              v-model="currentMenu"
              @change="onMenuNameChange"
            >
            </a-tree-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="菜单名称">
            <a-input
              placeholder="菜单名称"
              v-decorator="[
                'displayName',
                {
                  initialValue: model.displayName,
                  rules: [{ required: true, message: '菜单名称不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="菜单编码">
            <a-input
              placeholder="菜单编码"
              v-decorator="[
                'resourceCode',
                {
                  initialValue: model.resourceCode,
                  rules: [
                    { required: true, message: '菜单编码不能为空', whitespace: true },
                    { validator: this.checkCodeDuplicate }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="当前菜单页面接口列表">
        <a-tree-select
          v-if="apiTreeList.length > 0"
          placeholder="请选取当前菜单页面接口列表"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="apiTreeList"
          treeNodeFilterProp="title"
          showSearch
          treeDefaultExpandAll
          multiple
          allowClear
          v-model="apiSetList"
        >
        </a-tree-select>
      </a-form-item>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-card size="small" title="按钮/权限列表">
            <a-button-group slot="extra">
              <a-button
                @click="addNewPermission"
                type="primary"
                size="small"
                icon="plus"
              ></a-button>
              <a-button
                @click="removePermission(currentPermissionActiveKey)"
                v-if="permissionList.length > 0"
                type="danger"
                size="small"
                icon="delete"
              ></a-button>
            </a-button-group>

            <a-tabs
              v-if="permissionList.length > 0"
              :defaultActiveKey="0"
              v-model="currentPermissionActiveKey"
            >
              <a-tab-pane
                v-for="(permission, index) in permissionList"
                :tab="permission.displayName"
                :key="index">
                <a-form-item :required="true" label="按钮/权限编码">
                  <a-row type="flex" align="middle" :gutter="16">
                    <a-col :span="19">
                      <a-select
                        v-if="more.resourcePermissionCodeKvList && isSelect"
                        showSearch
                        :filterOption="(input, option) => filterPermissionCodeOption(permission, input, option)"
                        @change="value => changePermissionName(permission, value)"
                        placeholder="请选择按钮/权限编码"
                        v-model="permission.resourceCode"
                      >
                        <a-select-option
                          v-for="(item, i) in more.resourcePermissionCodeKvList"
                          v-if="!existPermissionCodes.includes(item.v) || permission.resourceCode === item.v"
                          :key="i"
                          :value="item.v"
                        >
                          {{ item.k }}[{{ item.v }}]
                        </a-select-option>
                      </a-select>
                      <a-input
                        v-if="!isSelect"
                        placeholder="请输入按钮/权限名称"
                        v-model="permission.resourceCode"
                      />
                    </a-col>
                    <a-col :span="5">
                      <a-button type="primary" icon="swap" size="small" @click="handleSwap(permission, index)">{{ isSelect ? '自定义输入' : '从字典选取' }}</a-button>
                    </a-col>
                  </a-row>
                </a-form-item>
                <a-form-item :required="true" label="按钮/权限名称">
                  <a-input
                    placeholder="按钮/权限名称"
                    v-model="permission.displayName"
                  />
                </a-form-item>
                <a-form-item label="当前按钮/权限所需接口列表">
                  <a-tree-select
                    v-if="routerTreeList.length > 0"
                    placeholder="当前按钮/权限所需接口列表"
                    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                    :treeData="apiTreeList"
                    treeNodeFilterProp="title"
                    showSearch
                    treeDefaultExpandAll
                    multiple
                    allowClear
                    @change="value => {permission.apiSetList = value; $forceUpdate()}"
                    v-model="permission.apiSetList"
                  >
                  </a-tree-select>
                </a-form-item>
              </a-tab-pane>
            </a-tabs>
            <template v-else>
              无
            </template>
          </a-card>
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
import { treeListFormatter, routersFormatter, treeList2list, apiListFormatter } from '@/utils/treeDataUtil'
import { mapState } from 'vuex'
import _ from 'lodash'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'

const NEW_PERMISSION_ITEM = {
  id: undefined,
  parentId: '',
  displayType: 'PERMISSION',
  displayName: '新按钮/权限',
  resourceCode: '',
  apiSetList: []
}
export default {
  name: 'IamResourcePermissionDrawer',
  components: { ACol, ARow },
  data () {
    return {
      baseApi: '/iam/resourcePermission',
      form: this.$form.createForm(this),
      getMore: true,
      currentPermissionActiveKey: 0,
      currentMenu: '',
      apiSetList: [],
      permissionList: [],
      apiTreeList: [],
      isSelect: true
    }
  },
  mixins: [ form ],
  methods: {
    async afterOpen (id) {
      if (id) {
        // 设置当前菜单项的接口列表
        if (this.model.apiSetList && this.model.apiSetList.length > 0) {
          this.apiSetList = this.model.apiSetList
        }
        // 设置当前菜单项的按钮/权限列表
        this.model.permissionList.forEach(item => {
          if (!item.apiSetList || item.apiSetList.length === 0) {
            item.apiSetList = []
          }
        })
        this.permissionList = this.model.permissionList
      }

      dibootApi.get(`${this.baseApi}/apiList`).then(res => {
        if (res.code === 0) {
          this.apiTreeList = apiListFormatter(res.data)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    menuTreeDataFilter (id) {
      const tree = this.menuTreeData
      if (id == null) {
        return tree
      }
      // 深度遍历删除指定id对象
      const deepDelItem = tree => {
        for (let i = tree.length - 1; i >= 0; i--) {
          const treeElement = tree[i]
          if (treeElement.key === id) {
            tree.splice(i, 1)
            return true
          }
          const children = treeElement.children || []
          if (children.length > 0) {
            if (deepDelItem(children)) {
              return true
            }
          }
        }
        return false
      }
      deepDelItem(tree)
      return tree
    },
    onMenuNameChange (value) {
      if (this.routerList || this.routerList.length > 0) {
        const currentMenu = this.routerList.find(item => {
          return item.value === value
        })
        if (currentMenu === undefined) {
          return false
        }
        // 自动设置菜单名称与菜单编码
        this.form.setFieldsValue({
          resourceCode: currentMenu.value,
          displayName: currentMenu.title
        })
        // 自动设置菜单页面所需接口
        this.apiSetList = []
        if (!currentMenu.value) {
          return false
        }
        const currentApi = this.apiList.find(item => {
          return item.value && item.value.toLowerCase().includes(currentMenu.value.toLowerCase())
        })
        if (currentApi === undefined || !currentApi.value) {
          return false
        }
        this.apiSetList.push(currentApi.value)
      }
    },
    /***
       * 提交前的验证流程
       * @returns {Promise<any>}
       */
    validate () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, fieldsValue) => {
          if (!err) {
            const errMsgs = []
            // 对按钮/权限列表进行验证
            if (this.permissionList.length > 0) {
              const notChangePerIdxList = []
              const nullDisplayNameIdxList = []
              const nullFrontendCodeIdxList = []
              this.permissionList.forEach((permission, i) => {
                // 校验按钮/权限名称是否为空以及是否更改
                if (!permission.displayName) {
                  nullDisplayNameIdxList.push(i + 1)
                } else if (permission.displayName === NEW_PERMISSION_ITEM.displayName) {
                  notChangePerIdxList.push(i + 1)
                }
                // 校验按钮/权限编码是否设置
                if (!permission.resourceCode) {
                  nullFrontendCodeIdxList.push(i + 1)
                }
              })
              // 收集验证错误信息
              if (notChangePerIdxList.length > 0) {
                errMsgs.push(`第 ${notChangePerIdxList.join('、')} 个按钮/权限的名称没有更改`)
              }
              if (nullDisplayNameIdxList.length > 0) {
                errMsgs.push(`第 ${nullDisplayNameIdxList.join('、')} 个按钮/权限的名称没有填写`)
              }
              if (nullFrontendCodeIdxList.length > 0) {
                errMsgs.push(`第 ${nullFrontendCodeIdxList.join('、')} 个按钮/权限的编码没有填写`)
              }
            }
            if (errMsgs.length > 0) {
              const msg = errMsgs.join('；') + '。'
              this.$message.error(msg)
              reject(msg)
            }

            // 获取当前菜单的可用接口列表
            const apiSetList = this.apiSetList.filter(api => {
              return api !== undefined && api !== ''
            })

            // 整理当前的按钮/权限列表以及对应的接口列表
            const permissionList = _.cloneDeep(this.permissionList)
            // 整理所有按钮/权限列表的可用接口列表，并设置菜单的id为当前的parentId
            permissionList.forEach(permission => {
              permission.apiSetList = permission.apiSetList.filter(api => {
                return api !== undefined && api !== ''
              })
              if (this.model && this.model.id) {
                permission.parentId = this.model.id
              }
            })

            // 合并参数
            const displayType = 'MENU'
            const values = {
              ...fieldsValue,
              displayType,
              apiSetList,
              permissionList
            }

            resolve(values)
          } else {
            reject(err)
          }
          setTimeout(() => {
            this.state.confirmSubmit = false
          }, 600)
        })
      })
    },
    addNewPermission () {
      const newPermission = _.cloneDeep(NEW_PERMISSION_ITEM)
      this.permissionList.push(newPermission)
      this.currentPermissionActiveKey = this.permissionList.length - 1
      // 自动补全编码选项
      if (this.more && this.more.resourcePermissionCodeKvList) {
        const validKv = this.more.resourcePermissionCodeKvList.find(kv => {
          return !this.existPermissionCodes.includes(kv.v)
        })
        newPermission.resourceCode = validKv.v
        this.changePermissionName(newPermission, validKv.v)
      }
    },
    removePermission (index) {
      this.permissionList.splice(index, 1)
      this.currentPermissionActiveKey = this.currentPermissionActiveKey > 0 ? --this.currentPermissionActiveKey : 0
    },
    filterPermissionCodeOption (permission, input, option) {
      const text = option.componentOptions.children[0].text.toLowerCase()
      if (text.indexOf(input.toLowerCase()) >= 0) {
        return true
      }
      const value = option.componentOptions.propsData.value.toLowerCase()
      if (value.indexOf(input.toLowerCase()) >= 0) {
        return true
      }
      permission.resourceCode = input
      return false
    },
    changePermissionName (permission, value) {
      const validKv = this.more.resourcePermissionCodeKvList.find(item => {
        return item.v === value
      })
      // 自动补全按钮/权限名称
      if (validKv !== undefined) {
        permission.displayName = validKv['k']
      }
      // 自动补全接口列表
      permission.apiSetList = []
      if (this.apiSetList.length === 0 || !value) {
        return false
      }
      const matchStrList = this.apiSetList[0].match(/\/(\S*)\//)
      if (!matchStrList || matchStrList.length < 2) {
        return false
      }
      const matchStr = matchStrList[0]
      let uri
      if (value === 'detail') {
        uri = `GET:${matchStr}{`
      } else if (value === 'create') {
        uri = `POST:${matchStr}`
      } else if (value === 'update') {
        uri = `PUT:${matchStr}{`
      } else if (value === 'delete') {
        uri = `DELETE:${matchStr}{`
      } else if (value === 'export') {
        uri = `POST:${matchStr}export`
      } else if (value === 'import') {
        uri = `POST:${matchStr}import`
      }
      if (!uri) {
        return false
      }
      const matchApi = this.apiList.find(api => {
        return api.value && api.value.includes(uri)
      })
      if (matchApi === undefined) {
        return false
      }
      permission.apiSetList.push(matchApi.value)
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
    },
    handleSwap (permission, index) {
      this.isSelect = !this.isSelect
      permission.resourceCode = ''
      permission.displayName = ''
      this.$set(this.permissionList, index, permission)
    },
    afterClose () {
      this.apiSetList = []
      this.permissionList = []
      this.currentPermissionActiveKey = 0
      this.currentMenu = ''
    }
  },
  computed: {
    ...mapState({
      addRouters: state => state.permission.addRouters
    }),
    routerTreeList: function () {
      return routersFormatter(this.addRouters)
    },
    routerList: function () {
      return treeList2list(_.cloneDeep(this.routerTreeList))
    },
    apiList: function () {
      return treeList2list(_.cloneDeep(this.apiTreeList))
    },
    menuTreeData: function () {
      let menuTreeData = []
      if (this.more && this.more.menuList) {
        menuTreeData = treeListFormatter(this.more.menuList, 'id', 'displayName', true)
      }
      menuTreeData.splice(0, 0, { key: '0', value: '0', title: '顶级菜单' })
      return menuTreeData
    },
    existPermissionCodes: function () {
      if (!this.permissionList) {
        return []
      }
      return this.permissionList.map(item => {
        return item.resourceCode
      })
    }
  },
  props: {
    initParentId: {
      type: String,
      default: () => {
        return '0'
      }
    }
  }
}
</script>

<style scoped>
  .iamResourcePermissionForm .ant-form-item {
    margin-bottom: 10px;
  }
</style>
