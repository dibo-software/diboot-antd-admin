<template>
  <a-drawer
    :title="title"
    :width="720"
    @close="close"
    :visible="state.visible"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <a-form layout="vertical" :form="form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="用户名">
            <a-input
              placeholder="请输入用户名"
              v-decorator="[
                'username',
                {
                  initialValue: model.username,
                  rules: [{ required: true, message: '用户名不能为空', whitespace: true }, { validator: this.checkUsernameDuplicate }]
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
          <a-form-item label="角色">
            <a-select
              v-if="more.roleKvList"
              :getPopupContainer="getPopupContainer"
              mode="multiple"
              placeholder="请选择"
              v-decorator="[
                'roleIdList',
                {
                  initialValue: model.roleList && model.roleList.map(role => {return role.id}),
                  rules: [{ required: true, message: '角色不能为空' }]
                }
              ]"
            >
              <a-select-option
                v-for="(role, index) in more.roleKvList"
                :key="index"
                :value="role.v"
              >
                {{ role.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="性别">
            <a-select
              v-if="more.genderKvList"
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
                v-for="(gender, index) in more.genderKvList"
                :key="index"
                :value="gender.v"
              >
                {{ gender.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态">
            <a-select
              v-if="more.userStatusKvList"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'status',
                {
                  initialValue: model.status,
                  rules: [{ required: true, message: '用户状态不能为空' }]
                }
              ]"
            >
              <a-select-option
                v-for="(status, index) in more.userStatusKvList"
                :key="index"
                :value="status.v"
              >
                {{ status.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="电话">
            <a-input
              placeholder="手机号"
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
          <a-form-item label="密码">
            <a-button
              v-if="setPassword === false"
              @click="setPassword = true"
              size="small"
              type="primary">重设密码</a-button>
            <a-input
              v-if="setPassword === true"
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

export default {
  name: 'IamUserForm',
  data () {
    return {
      baseApi: '/iam/user',
      setPassword: false,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    async afterOpen (id) {
      if (id === undefined) {
        this.setPassword = true
      } else {
        this.setPassword = false
      }
      // 获取account的username信息到表单中
      if (id !== undefined) {
        const res = await dibootApi.get(`${this.baseApi}/getUsername/${id}`)
        if (res.code === 0) {
          this.form.setFieldsValue({ username: res.data })
        }
      }
    },
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
    async checkUsernameDuplicate (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.model.id, username: value }
      const res = await dibootApi.get(`${this.baseApi}/checkUsernameDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
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
      values.orgId = 0

      console.log('values==>', values)
    }
  },
  props: {
    more: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  mixins: [form]
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
