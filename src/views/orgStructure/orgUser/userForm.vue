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
          <a-form-item label="所属部门">
            <a-tree-select
              v-if="orgTreeList.length > 0"
              placeholder="请选择所属部门"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
              :treeData="orgTreeList"
              treeNodeFilterProp="title"
              showSearch
              treeDefaultExpandAll
              v-decorator="[
                'orgId',
                {
                  rules: [{ required: true, message: '请选择上级部门' }],
                  initialValue: model.orgId != null ? `${model.orgId}` : currentNodeId
                }
              ]"
            >
            </a-tree-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16" v-if="systemUser">
        <a-col :span="12">
          <a-form-item label="用户名">
            <a-input
              placeholder="请输入用户名"
              v-decorator="[
                'username',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '用户名不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="角色">
            <a-select
              :getPopupContainer="getPopupContainer"
              mode="multiple"
              placeholder="请选择角色"
              v-decorator="[
                'roleIdList',
                {
                  initialValue: model.roleList && model.roleList.map(role => {return role.id}),
                  rules: [{ required: true, message: '角色不能为空' }]
                }
              ]"
            >
              <a-select-option
                v-for="(role, index) in more.iamRoleOptions"
                :key="index"
                :value="role.value"
              >
                {{ role.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="系统用户">
            <a-switch defaultChecked v-model="systemUser" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="密码" v-if="systemUser">
            <a-button
              v-if="setPassword === false"
              @click="setPassword = true"
              size="small"
              type="primary">重设密码</a-button>
            <a-input
              v-else
              type="password"
              v-decorator="[
                'password',
                {
                  initialValue: '',
                  rules: [{ required: true, message: '密码不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="12">
          <a-form-item label="账号状态" v-if="systemUser">
            <a-select
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'accountStatus',
                {
                  initialValue: model.accountStatus? model.accountStatus : 'A',
                }
              ]"
            >
              <a-select-option
                v-for="(status, index) in more.accountStatusOptions"
                :key="index"
                :value="status.value"
              >
                {{ status.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="姓名">
            <a-input
              placeholder="请输入姓名"
              v-decorator="[
                'realname',
                {
                  initialValue: model.realname,
                  rules: [{ required: true, message: '姓名不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="用户编号">
            <a-input
              placeholder="请输入用户编号"
              v-decorator="[
                'userNum',
                {
                  initialValue: model.userNum,
                  rules: [{ required: true, message: '用户编号不能为空', whitespace: true }, { validator: this.checkUserNumDuplicate }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="性别">
            <a-select
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'gender',
                {
                  initialValue: model.gender,
                  rules: [{ required: true, message: '性别不能为空' }]
                }
              ]"
            >
              <a-select-option
                v-for="(gender, index) in more.genderOptions"
                :key="index"
                :value="gender.value"
              >
                {{ gender.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="生日">
            <a-date-picker
              format="YYYY-MM-DD"
              valueFormat="YYYY-MM-DD"
              v-decorator="[
                'birthdate',
                {
                  initialValue: model.birthdate ? moment(model.birthdate) : undefined
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="电话">
            <a-input
              placeholder="请输入电话"
              v-decorator="[
                'mobilePhone',
                {
                  initialValue: model.mobilePhone
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="邮箱">
            <a-input
              placeholder="xxx@xxx.com"
              v-decorator="[
                'email',
                {
                  initialValue: model.email
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="状态">
            <a-select
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'status',
                {
                  initialValue: model.status? model.status : 'A',
                  rules: [{ required: true, message: '用户状态不能为空' }]
                }
              ]"
            >
              <a-select-option
                v-for="(status, index) in more.userStatusOptions"
                :key="index"
                :value="status.value"
              >
                {{ status.label }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="drawer-footer">
      <a-button @click="close">取消</a-button>
      <a-button v-if="!model.id" @click="onSubmit(true)" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">保存并继续</a-button>
      <a-button @click="onSubmit(false)" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">保存</a-button>
    </div>
    <user-select-modal ref="userSelectModal" @select="record => selectReportManager(record)"></user-select-modal>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import UserSelectModal from '@/views/orgStructure/orgUser/UserSelectModal'
import { dibootApi } from '@/utils/request'
import { treeListFormatter } from '@/utils/treeDataUtil'
import _ from 'lodash'

export default {
  name: 'OrgUserForm',
  data () {
    return {
      baseApi: '/iam/user',
      form: this.$form.createForm(this),
      orgList: [],
      systemUser: false,
      setPassword: false,
      attachMoreList: [
        {
          target: 'USER_STATUS'
        },
        {
          target: 'ACCOUNT_STATUS'
        },
        {
          target: 'GENDER'
        },
        {
          target: 'IamRole',
          label: 'name',
          value: 'id'
        }
      ]
    }
  },
  methods: {
    async afterOpen (id) {
      // 加载部门树数据
      this.loadOrgTree()
      // 获取account的username信息到表单中
      this.loadUsername()
      // 回显岗位配置数据
      this.showPositionConfig()
      // 新建显示密码填写，更新隐藏密码填写
      if (id == null) {
        this.setPassword = true
      } else {
        this.setPassword = false
      }
    },
    async loadOrgTree () {
      const res = await dibootApi.get(`/iam/org/tree`)
      if (res.code === 0) {
        this.orgList = res.data
      } else {
        this.$message.error(res.msg)
      }
    },
    showPositionConfig () {
      if (this.model.positionList == null || this.model.positionList.length === 0) {
        return undefined
      }
      const positionIdList = this.model.positionList.map(item => {
        return item.id.toString()
      })
      setTimeout(() => {
        this.form.setFieldsValue({
          positionIdList
        })
      }, 200)
    },
    async loadUsername () {
      const id = this.model.id
      if (id != null) {
        const res = await dibootApi.get(`${this.baseApi}/getUsername/${id}`)
        if (res.code === 0 && res.data) {
          this.systemUser = true
          setTimeout(() => {
            this.form.setFieldsValue({ username: res.data })
          }, 200)
        }
      }
    },
    selectReportManager (user) {
      this.model.reportManagerName = user.realname
      this.form.setFieldsValue({
        reportManagerId: user.id
      })
    },
    async checkUserNumDuplicate (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.model.id, userNum: value }
      const res = await dibootApi.get(`${this.baseApi}/checkUserNumDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    },
    enhance (values) {
    },
    afterClose () {
      this.systemUser = false
    }
  },
  computed: {
    orgTreeList: function () {
      if (this.orgList == null || this.orgList.length === 0) {
        return []
      }
      const orgTreeList = treeListFormatter(_.cloneDeep(this.orgList), 'id', 'shortName', true)
      orgTreeList.unshift({ title: '无', value: '0', key: '0' })
      return orgTreeList
    }
  },
  mixins: [form],
  components: {
    UserSelectModal
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
