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
          <a-form-item label="公司名">
            <a-input
              placeholder="请输入公司名"
              v-decorator="[
                'name',
                {
                  initialValue: model.name,
                  rules: [{ required: true, message: '公司名不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="简称">
            <a-input
              placeholder="请输入简称"
              v-decorator="[
                'shortName',
                {
                  initialValue: model.shortName
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="税号">
            <a-input
              placeholder="请输入税号"
              v-decorator="[
                'taxid',
                {
                  initialValue: model.taxid
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="电话">
            <a-input
              placeholder="请输入电话"
              v-decorator="[
                'telphone',
                {
                  initialValue: model.telphone
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="地址">
            <a-input
              placeholder="请输入地址"
              v-decorator="[
                'address',
                {
                  initialValue: model.address
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="客户状态">
            <a-select
              v-if="more.cusStatusKvList"
              show-search
              :filter-option="filterOption"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'cusStatus',
                {
                  initialValue: model.cusStatus
                }
              ]"
            >
              <a-select-option
                value=""
              >
                -- 请选择 --
              </a-select-option>
              <a-select-option
                v-for="(item, index) in more.cusStatusKvList"
                :key="index"
                :value="item.v"
              >
                {{ item.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
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
  name: 'CustomerForm',
  mixins: [form],
  data () {
    return {
      baseApi: '/customer',
      form: this.$form.createForm(this),
      attachMoreList: [
        {
          type: 'D',
          target: 'CUS_STATUS'
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
</style>
