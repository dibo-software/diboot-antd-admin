<template>
  <div class="account-change-pwd-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical" :form="form">
          <a-form-item label="旧密码">
            <a-input
              type="password"
              placeholder="请输入旧密码"
              v-decorator="[
                'oldPassword',
                {
                  rules: [{ required: true, message: '旧密码不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="新密码">
            <a-input
              type="password"
              placeholder="请输入新密码"
              v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: '新密码不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
          <a-form-item label="确认密码">
            <a-input
              type="password"
              placeholder="请确认新密码"
              v-decorator="[
                'confirmPassword',
                {
                  rules: [{ required: true, message: '确认密码不能为空', whitespace: true }, { validator: confirmPwdValidator }],
                  validateTrigger: 'change'
                }
              ]"
            />
          </a-form-item>
          <a-form-item>
            <a-button @click="onSubmit" type="primary">更改密码</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
export default {
  name: 'ChangePwdSettings',
  data () {
    return {
      baseApi: '/iam/user',
      form: this.$form.createForm(this)
    }
  },
  methods: {
    /***
     * 新建记录的提交
     * @param values
     * @returns {Promise<string>}
     */
    async add (values) {
      const res = await dibootApi.post(`${this.baseApi}/changePwd`, values)
      if (res.code === 0) {
        return { data: res.data, msg: '更改密码成功' }
      } else {
        throw new Error(res.msg)
      }
    },
    /***
     * 提交成功之后的处理
     * @param msg
     */
    submitSuccess (result) {
      this.$notification.success({
        message: '操作成功',
        description: result.msg
      })
      this.form.resetFields()
    },
    confirmPwdValidator (rule, value, callback) {
      if (!value) {
        callback()
      }
      if (value === this.form.getFieldValue('password')) {
        callback()
      }
      callback(new Error('确认密码与新密码不一致'))
    }
  },
  mixins: [ form ]
}
</script>

<style scoped>

</style>
