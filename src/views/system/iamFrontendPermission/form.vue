<template>
  <a-drawer
    :title="title"
    width="720"
    :visible="state.visible"
    @close="close"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-form layout="vertical" :form="form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="父级菜单">
            <a-tree-select
              v-if="menuTreeData.length > 0"
              placeholder="请选择父级菜单"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="menuTreeData"
              treeNodeFilterProp="title"
              showSearch
              treeDefaultExpandAll
              v-decorator="[
            'parentId',
            {
              initialValue: model.parentId ? model.parentId.toString() : initParentId,
              rules: [{ required: true, message: '父级菜单不能为空', whitespace: true }]
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
                  rules: [{ required: true, message: '类型名称不能为空', whitespace: true }]
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
                'frontendCode',
                {
                  initialValue: model.frontendCode,
                  rules: [
                    { required: true, message: '类型编码不能为空', whitespace: true },
                    { validator: this.checkCodeDuplicate }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item
        v-for="(api, apiIdx) in apiSetList"
        :key="`a_${apiIdx}`"
        v-bind="
          apiIdx === 0
            ? innerFormItemLayout
            : innerFormItemLayoutWithOutLabel
        "
        :label="apiIdx === 0 ? '页面内接口列表' : ''"
        :required="false"
      >
        <a-input
          @change="$forceUpdate()"
          v-model="apiSetList[apiIdx]"
          placeholder="请输入页面需要请求的接口"
          style="width: 80%; margin-right: 8px"
        />
        <a-icon
          v-if="apiSetList.length > 1"
          class="dynamic-delete-button"
          type="minus-circle-o"
          style="cursor: pointer;"
          @click="() => removeMenuApiSet(apiIdx)"
        />
      </a-form-item>
      <a-form-item v-bind="innerFormItemLayoutWithOutLabel">
        <a-button
          type="dashed"
          style="width: 80%"
          @click="addMenuApiSet()"
        >
          <a-icon type="plus" /> 添加接口API
        </a-button>
      </a-form-item>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-card size="small" title="按钮/权限管理">
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
              defaultActiveKey="0"
              v-model="currentPermissionActiveKey"
            >
              <a-tab-pane
                v-for="(permission, index) in permissionList"
                :tab="permission.displayName"
                :key="index">
                <a-form-item :required="true" label="按钮/权限编码">
                  <a-select
                    v-if="more.frontendPermissionCodeKvList"
                    showSearch
                    :filterOption="(input, option) => filterPermissionCodeOption(permission, input, option)"
                    @change="value => changePermissionName(permission, value)"
                    placeholder="请选择按钮/权限编码"
                    v-model="permission.frontendCode"
                  >
                    <a-select-option
                      v-for="(item, index) in more.frontendPermissionCodeKvList"
                      v-if="!existPermissionCodes.includes(item.v) || permission.frontendCode === item.v"
                      :key="index"
                      :value="item.v"
                    >
                      {{ item.k }}[{{ item.v }}]
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item :required="true" label="按钮/权限名称">
                  <a-input
                    placeholder="按钮/权限名称"
                    v-model="permission.displayName"
                  />
                </a-form-item>
                <a-form-item
                  v-for="(api, apiIdx) in permission.apiSetList"
                  :key="`a_${apiIdx}`"
                  v-bind="
                    apiIdx === 0
                      ? innerFormItemLayout
                      : innerFormItemLayoutWithOutLabel
                  "
                  :label="apiIdx === 0 ? '所需接口列表' : ''"
                  :required="false"
                >
                  <a-input
                    @change="$forceUpdate()"
                    v-model="permission['apiSetList'][apiIdx]"
                    placeholder="请输入按钮/权限所需接口"
                    style="width: 80%; margin-right: 8px"
                  />
                  <a-icon
                    v-if="permission['apiSetList'].length > 1"
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    style="cursor: pointer;"
                    @click="() => removeApiSet(permission, apiIdx)"
                  />
                </a-form-item>
                <a-form-item v-bind="innerFormItemLayoutWithOutLabel">
                  <a-button
                    type="dashed"
                    style="width: 80%"
                    @click="addApiSet(permission)"
                  >
                    <a-icon type="plus" /> 添加接口API
                  </a-button>
                </a-form-item>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>
      </a-row>
    </a-form>

    <div class="footer">
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.submitBtn" :disabled="state.submitBtn">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
import { treeListFormatter, routersFormatter, treeList2list } from '@/utils/treeDataUtil'
import { mapState } from 'vuex'
import _ from 'lodash'

const NEW_PERMISSION_ITEM = {
  id: undefined,
  parentId: '',
  displayType: 'PERMISSION',
  displayName: '新按钮/权限',
  frontendCode: '',
  apiSetList: ['']
}
export default {
  name: 'DictionaryDrawer',
  data () {
    return {
      baseApi: '/iam/frontendPermission',
      createApi: '/create',
      updateApiPrefix: '/update',
      form: this.$form.createForm(this),
      currentPermissionActiveKey: 0,
      apiSetList: [''],
      permissionList: [],
      innerFormItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      },
      innerFormItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 }
        }
      }
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
        this.permissionList = this.model.permissionList
        this.permissionList.forEach(item => {
          if (!item.apiSetList || item.apiSetList.length === 0) {
            item.apiSetList = ['']
          }
        })
      }
    },
    onMenuNameChange (value) {
      if (this.routerList || this.routerList.length > 0) {
        const resultList = this.routerList.filter(item => {
          return item.value === value
        })
        if (resultList.length > 0) {
          this.form.setFieldsValue({
            frontendCode: resultList[0]['value'],
            displayName: resultList[0]['title']
          })
        }
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
                if (!permission.frontendCode) {
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
            this.state.submitBtn = false
          }, 600)
        })
      })
    },
    onPermissionListTabsEdit (targetKey, action) {
      console.log('targetKey==>', targetKey)
      if (action === 'add') {
        this.addNewPermission()
      } else if (action === 'remove') {
        this.removePermission(targetKey)
      }
    },
    addNewPermission () {
      const newPermission = _.cloneDeep(NEW_PERMISSION_ITEM)
      this.permissionList.push(newPermission)
      this.currentPermissionActiveKey = this.permissionList.length - 1
    },
    removePermission (index) {
      this.permissionList.splice(index, 1)
      this.currentPermissionActiveKey = this.currentPermissionActiveKey > 0 ? --this.currentPermissionActiveKey : 0
    },
    addMenuApiSet () {
      this.apiSetList.push('')
      this.$forceUpdate()
    },
    removeMenuApiSet (apiIdx) {
      this.apiSetList.splice(apiIdx, 1)
      this.$forceUpdate()
    },
    addApiSet (permission) {
      let apiSetList = permission.apiSetList
      if (apiSetList === undefined) {
        apiSetList = []
      }
      apiSetList.push('')
      permission.apiSetList = apiSetList
      this.$forceUpdate()
    },
    removeApiSet (permission, apiIdx) {
      permission.apiSetList.splice(apiIdx, 1)
      this.$forceUpdate()
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
      permission.frontendCode = input
      return false
    },
    changePermissionName (permission, value) {
      const validKvList = this.more.frontendPermissionCodeKvList.filter(item => {
        return item.v === value
      })
      if (validKvList.length > 0) {
        permission.displayName = validKvList[0]['k']
      }
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
    close () {
      this.state.visible = false
      this.model = {}
      this.apiSetList = ['']
      this.permissionList = []
      this.form.resetFields()
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
    menuTreeData: function () {
      if (!this.more || !this.more.menuList) {
        return []
      }
      const menuTreeData = treeListFormatter(this.more.menuList, 'id', 'displayName', true)
      menuTreeData.splice(0, 0, { key: '0', value: '0', title: '顶级菜单' })
      return menuTreeData
    },
    existPermissionCodes: function () {
      if (!this.permissionList) {
        return []
      }
      return this.permissionList.map(item => {
        return item.frontendCode
      })
    }
  },
  props: {
    more: {
      type: Object,
      default: () => {
        return {}
      }
    },
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
