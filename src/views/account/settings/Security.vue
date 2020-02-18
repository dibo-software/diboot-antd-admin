<template>
  <div class="account-change-pwd-view">

    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form layout="vertical" :form="form">
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
          <a-form-item>
            <a-button @click="onSubmit" type="primary">提交</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
