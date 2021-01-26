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
        <a-col :span="12">
          <a-form-item label="客户">
            <a-select
              v-if="more.customerKvList"
              show-search
              :filter-option="filterOption"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择客户"
              v-decorator="[
                'customerId',
                {
                  initialValue: model.customerId ? `${model.customerId}` : ''
                }
              ]"
            >
              <a-select-option
                value=""
              >
                -- 请选择 --
              </a-select-option>
              <a-select-option
                v-for="(item, index) in more.customerKvList"
                :key="index"
                :value="`${item.v}`"
              >
                {{ item.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
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
          <a-form-item label="性别">
            <a-select
              v-if="more.genderKvList"
              show-search
              :filter-option="filterOption"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'gender',
                {
                  initialValue: model.gender
                }
              ]"
            >
              <a-select-option
                value=""
              >
                -- 请选择 --
              </a-select-option>
              <a-select-option
                v-for="(item, index) in more.genderKvList"
                :key="index"
                :value="item.v"
              >
                {{ item.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="头衔">
            <a-input
              placeholder="请输入头衔"
              v-decorator="[
                'title',
                {
                  initialValue: model.title
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="电话">
            <a-input
              placeholder="请输入电话"
              v-decorator="[
                'cellphone',
                {
                  initialValue: model.cellphone,
                  rules: [{ required: true, message: '电话不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="微信">
            <a-input
              placeholder="请输入微信"
              v-decorator="[
                'wechat',
                {
                  initialValue: model.wechat
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="备注">
            <a-textarea
              placeholder="请输入备注"
              v-decorator="[
                'remark',
                {
                  initialValue: model.remark
                }
              ]"
            />
          </a-form-item>
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

export default {
  name: 'ContactPersonForm',
  mixins: [form],
  data () {
    return {
      baseApi: '/contactPerson',
      form: this.$form.createForm(this),
      attachMoreList: [
        {
          type: 'T',
          target: 'customer',
          key: 'short_name',
          value: 'id'
        },
        {
          type: 'D',
          target: 'GENDER'
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
</style>
