<template>
  <a-drawer
    :title="title"
    width="1000"
    :visible="state.visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-row :gutter="5">
      <a-col class="transition-width" :span="showPermission ? 12 : 24">
        <a-card title="基础配置">
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
                        initialValue: model.parentId != null ? model.parentId.toString() : initParentId,
                        rules: [{ required: true, message: '上级菜单不能为空', whitespace: true }]
                      }
                    ]"
                  >
                  </a-tree-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item>
                  <div style="display: inline-block; width: 90%" slot="label">
                    <span>菜单名称</span>
                    <a-popover placement="bottom" trigger="hover">
                      <template slot="content">
                        <a-tree-select
                          style="width: 200px"
                          placeholder="选择菜单"
                          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                          :treeData="allRouterTreeList"
                          treeNodeFilterProp="title"
                          showSearch
                          treeDefaultExpandAll
                          v-model="currentMenu"
                          @change="onMenuNameChange"
                        />
                      </template>
                      <a style="float: right">选择</a>
                    </a-popover>
                  </div>
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
              <a-col :span="24">
                <a-form-item>
                  <div style="display: inline-block; width: 100%" slot="label">
                    <span>菜单权限接口</span>
                    <a-button size="small" style="float: right" type="primary" @click="goPermissionConfig('Menu')">配置</a-button>
                  </div>
                  <div class="permission-tag-container" :gutter="12">
                    <template v-if="permissionCodes && permissionCodes.length > 0">
                      <a-tag
                        v-for="(permissionCode, index) in permissionCodes"
                        style="margin-bottom: 3px"
                        :key="`menu_${index}`"
                        color="green"
                        closable
                        @close.stop.prevent="(e) => handleRemovePermissionCode(permissionCode)"
                      >{{ permissionCode }}</a-tag>
                    </template>
                    <template v-else>
                      <span style="color: #d3d3d3">请点击右侧"配置按钮"选择权限接口</span>
                    </template>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-card size="small" title="按钮权限接口">
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
                      <a-form-item :required="true" label="按钮权限编码">
                        <a-row type="flex" align="middle" :gutter="16">
                          <a-col :span="16">
                            <a-select
                              v-if="isSelect"
                              showSearch
                              :filterOption="(input, option) => filterPermissionCodeOption(permission, input, option)"
                              @change="value => changeResourceCode(permission, value)"
                              placeholder="请选择按钮权限编码"
                              v-model="permission.resourceCode"
                            >
                              <a-select-option
                                v-for="(item, i) in more.resourcePermissionCodeOptions"
                                v-if="!existPermissionCodes.includes(item.value) || permission.resourceCode === item.value"
                                :key="i"
                                :value="item.value"
                              >
                                {{ item.label }}[{{ item.value }}]
                              </a-select-option>
                            </a-select>
                            <a-input
                              v-else
                              placeholder="请输入按钮权限编码"
                              @change="value => changeResourceCode(permission, value.target.value)"
                              v-model="permission.resourceCode"
                            />
                          </a-col>
                          <a-col :span="8">
                            <a-button type="primary" icon="swap" size="small" @click="handleSwap(permission, index)">{{ isSelect ? '自定义输入' : '从字典选取' }}</a-button>
                          </a-col>
                        </a-row>
                      </a-form-item>
                      <a-form-item :required="true" label="按钮权限名称">
                        <a-input
                          placeholder="按钮权限名称"
                          @change="value => changePermissionConfig(permission, value.target.value)"
                          v-model="permission.displayName"
                        />
                      </a-form-item>
                      <a-form-item :required="true">
                        <div style="display: inline-block; width: 95%" slot="label">
                          <span>按钮权限接口配置</span>
                          <a-button size="small" style="float: right" type="primary" @click="goPermissionConfig('Permission')">配置</a-button>
                        </div>

                        <div class="permission-tag-container">
                          <template v-if="permission.permissionCodes && permission.permissionCodes.length > 0">
                            <a-tag
                              v-for="(permissionCode, i) in permission.permissionCodes"
                              style="margin-bottom: 3px"
                              :key="`permission_${i}`"
                              color="green"
                              closable
                              @close.stop.prevent="handleRemovePermissionCode(permissionCode, permission)"
                            >{{ permissionCode }}</a-tag>
                          </template>
                          <template v-else>
                            <span style="color: #d3d3d3">请点击右侧"配置按钮"选择权限接口</span>
                          </template>
                        </div>
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
        </a-card>
      </a-col>
      <a-col class="transition-width" :span="showPermission ? 12 : 0">
        <permission-list
          ref="permissionList"
          :title="currentPermissionTitle"
          :current-permission-codes="currentPermissionCodes"
          :config-code="currentConfigCode"
          :menu-resource-code="form.getFieldValue('resourceCode')"
          :origin-api-list="originApiList"
          @changePermissionCodes="handleChangePermissionCodes"
        />
      </a-col>
    </a-row>
    <div class="drawer-footer">
      <a-button @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
import { asyncRouterMap } from '@/config/router.config'
import { treeListFormatter, routersFormatter, treeList2list } from '@/utils/treeDataUtil'
import { mapState } from 'vuex'
import _ from 'lodash'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
import PermissionList from '@/views/system/iamResourcePermission/permissionList'

const NEW_PERMISSION_ITEM = {
  id: undefined,
  parentId: '',
  displayType: 'PERMISSION',
  displayName: '新按钮权限',
  resourceCode: '',
  permissionCodes: []
}
export default {
  name: 'IamResourcePermissionDrawer',
  components: { PermissionList, ACol, ARow },
  data () {
    return {
      baseApi: '/iam/resourcePermission',
      form: this.$form.createForm(this),
      getMore: true,
      attachMoreList: [
        {
          target: 'RESOURCE_PERMISSION_CODE'
        }
      ],
      currentPermissionActiveKey: 0,
      currentMenu: '',
      permissionCodes: [],
      permissionList: [],
      isSelect: true,
      originApiList: [],
      currentPermissionTitle: '菜单页面接口配置',
      currentConfigCode: '',
      currentPermissionCodes: [],
      showPermission: false
    }
  },
  mixins: [ form ],
  methods: {
    async afterOpen (id) {
      if (id) {
        // 设置当前菜单项的接口列表
        if (this.model.permissionCodes && this.model.permissionCodes.length > 0) {
          this.permissionCodes = this.model.permissionCodes
          this.currentPermissionCodes = this.permissionCodes
        }
        // 设置当前菜单项的按钮/权限列表
        this.model.permissionList.forEach(item => {
          if (!item.permissionCodes || item.permissionCodes.length === 0) {
            item.permissionCodes = []
          }
        })
        this.permissionList = this.model.permissionList
      }

      dibootApi.get(`${this.baseApi}/apiList`).then(res => {
        if (res.code === 0) {
          this.originApiList = res.data
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
        if (currentMenu == null) {
          return false
        }
        // 自动设置菜单名称与菜单编码
        this.form.setFieldsValue({
          resourceCode: currentMenu.value,
          displayName: currentMenu.title
        })
        // 重置接口权限
        this.permissionCodes = []
        this.currentPermissionCodes = []
        this.permissionList = []
        this.currentConfigCode = 'Menu'
        this.$refs.permissionList.goScrollIntoView(this.$refs.permissionList.getAnchor())
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
                errMsgs.push(`第 ${notChangePerIdxList.join('、')} 个按钮权限的名称没有更改`)
              }
              if (nullDisplayNameIdxList.length > 0) {
                errMsgs.push(`第 ${nullDisplayNameIdxList.join('、')} 个按钮权限的名称没有填写`)
              }
              if (nullFrontendCodeIdxList.length > 0) {
                errMsgs.push(`第 ${nullFrontendCodeIdxList.join('、')} 个按钮权限的编码没有填写`)
              }
            }
            if (errMsgs.length > 0) {
              const msg = errMsgs.join('；') + '。'
              this.$message.error(msg)
              reject(msg)
            }

            // 获取当前菜单的可用接口列表
            const permissionCodes = this.permissionCodes

            // 整理当前的按钮/权限列表以及对应的接口列表
            const permissionList = _.cloneDeep(this.permissionList)
            // 整理所有按钮/权限列表的可用接口列表，并设置菜单的id为当前的parentId
            permissionList.forEach(permission => {
              permission.permissionCodes = permission.permissionCodes.filter(permissionCode => {
                return permissionCode != null && permissionCode !== ''
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
              permissionCodes,
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
      if (this.more && this.more.resourcePermissionCodeOptions) {
        const validOption = this.more.resourcePermissionCodeOptions.find(option => {
          return !this.existPermissionCodes.includes(option.value)
        })
        if (validOption) {
          newPermission.resourceCode = validOption.value
          this.changeResourceCode(newPermission, validOption.value)
        }
      }
    },
    removePermission (index) {
      this.permissionList.splice(index, 1)
      this.currentPermissionActiveKey = this.currentPermissionActiveKey > 0 ? --this.currentPermissionActiveKey : 0
      this.changePermissionConfig(this.permissionList[this.currentPermissionActiveKey])
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
    /**
     * 删除配置的权限
     * @param permissionCode 被删除的权限code
     * @param permission 如果是按钮权限会传入当前按钮的权限所有配置，不传入表示删除的是菜单权限
     */
    handleRemovePermissionCode (permissionCode, permission) {
      if (!permission) {
        this.permissionCodes = this.permissionCodes.filter(item => item !== permissionCode)
      } else {
        permission.permissionCodes = permission.permissionCodes.filter(item => item !== permissionCode)
      }
      // 重置权限配置
      this.goPermissionConfig(permission ? 'Permission' : 'Menu')
    },
    goPermissionConfig (configCode) {
      if (!this.showPermission) {
        this.$refs.permissionList.initFuse()
      }
      this.showPermission = true
      configCode === 'Menu' ? this.change2MenuPermissionConfig()
        : this.changePermissionConfig(this.permissionList[this.currentPermissionActiveKey])
    },
    changeResourceCode (permission, value) {
      const validOption = this.more.resourcePermissionCodeOptions.find(item => {
        return item.value === value
      })
      // 自动补全按钮/权限名称
      if (validOption != null) {
        permission.displayName = validOption.label
      }
      // 重新设置接口配置
      this.changePermissionConfig(permission, permission.displayName || value)
    },
    /**
     * 重置权限配置名称
     * @param permission
     * @param value
     */
    changePermissionConfig (permission, value) {
      this.currentPermissionTitle = `${value || permission.displayName || permission.resourceCode} 按钮权限接口配置`
      this.currentConfigCode = permission.resourceCode
      this.currentPermissionCodes = permission.permissionCodes
    },
    /**
     * 重置权限配置名称
     * @param permission
     * @param value
     */
    change2MenuPermissionConfig () {
      this.currentPermissionTitle = '菜单页面接口配置'
      this.currentConfigCode = 'Menu'
      this.currentPermissionCodes = this.permissionCodes
      if (!this.permissionCodes || this.permissionCodes.length === 0) {
        this.$refs.permissionList.goScrollIntoView(this.$refs.permissionList.getAnchor())
      }
    },
    /**
     * 更改值，tag回显位置跟着调整
     * @param isMenu
     */
    handleChangePermissionCodes (permissionCodes) {
      if (this.currentConfigCode === 'Menu') {
        this.permissionCodes = permissionCodes
      } else {
        const permission = this.permissionList[this.currentPermissionActiveKey]
        permission['permissionCodes'] = permissionCodes
        this.$set(this.permissionList, this.currentPermissionActiveKey, permission)
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
    handleSwap (permission, index) {
      this.isSelect = !this.isSelect
      permission.resourceCode = ''
      permission.displayName = ''
      this.changePermissionConfig(permission, '')
      this.$set(this.permissionList, index, permission)
    },
    afterClose () {
      this.permissionCodes = []
      this.permissionList = []
      this.currentPermissionActiveKey = 0
      this.currentMenu = ''
      this.currentPermissionTitle = '菜单页面接口配置'
      this.currentConfigCode = ''
      this.currentPermissionCodes = []
      this.showPermission = false
      this.$refs.permissionList.handleSearchChange()
    }
  },
  computed: {
    ...mapState({
      addRouters: state => state.permission.addRouters
    }),
    routerTreeList: function () {
      return routersFormatter(this.addRouters)
    },
    allRouterTreeList () {
      return routersFormatter(asyncRouterMap)
    },
    routerList: function () {
      return treeList2list(_.cloneDeep(this.allRouterTreeList))
    },
    menuTreeData: function () {
      let menuTreeData = []
      if (this.more && this.more.menuTree) {
        menuTreeData = treeListFormatter(this.more.menuTree, 'id', 'displayName', true)
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
  watch: {
    currentPermissionActiveKey (val) {
      this.changePermissionConfig(this.permissionList[val])
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
  .transition-width {
    transition: width 0.3s;
  }
  .permission-tag-container {
    border: 1px dashed #d9d9d9;
    padding: 5px;
    margin: 0 2px;
    min-height: 32px
  }
</style>
