<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-form-item>
        <a-input
          size="large"
          type="text"
          placeholder="请输入用户名"
          v-decorator="[
            'username',
            {rules: [{ required: true, message: '请输入用户名' }, { validator: userNameValidator }], validateTrigger: 'change'}
          ]"
        >
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="请输入密码"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}
          ]"
        >
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="验证码"
              v-decorator="[
                'captcha',
                {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}
              ]"
            >
              <a-icon slot="prefix" type="key" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <img
            :src="`${baseURL}/auth/captcha?traceId=${traceId}`"
            @click="refreshTraceId()"
            alt="验证码"
            style="height: 40px; cursor: pointer;">
        </a-col>
      </a-row>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>
      <a-form-item style="margin-top:24px" v-if="enableSso">
        <a-button
          size="large"
          type="danger"
          class="login-button"
          @click="ssoLogin"
        >SSO 登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { baseURL } from '@/utils/request'
import { login, isEnableSso } from '@/utils/sso'

export default {
  data () {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      baseURL,
      traceId: Math.random().toString(36).slice(-8) + Date.parse(new Date()),
      // 启用SSO
      enableSso: isEnableSso()
    }
  },
  methods: {
    ssoLogin () {
      login()
    },
    ...mapActions(['Login', 'Logout', 'GetInfo']),
    // handler
    userNameValidator (rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    handleGetInfo () {
      const { GetInfo } = this
      GetInfo().then((res) => {
        console.log(res)
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login,
        traceId
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['username', 'password', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        if (!err) {
          const loginParams = { ...values, traceId }
          Login(loginParams)
            .then((res) => {
              if (res.code === 0) {
                this.loginSuccess(res)
              } else {
                this.refreshTraceId()
                this.$notification.error({
                  message: '登录失败',
                  description: res.msg,
                  duration: 2
                })
              }
            })
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      this.$router.push('/dashboard')
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    },
    refreshTraceId () {
      this.traceId = Math.random().toString(36).slice(-8) + Date.parse(new Date())
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
