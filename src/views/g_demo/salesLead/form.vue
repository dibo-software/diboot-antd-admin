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
          <a-form-item label="标题">
            <a-input
              placeholder="请输入标题"
              v-decorator="[
                'title',
                {
                  initialValue: model.title,
                  rules: [{ required: true, message: '标题不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="来源渠道">
            <a-select
              v-if="more.channelKvList"
              show-search
              :filter-option="filterOption"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'srcChannel',
                {
                  initialValue: model.srcChannel
                }
              ]"
            >
              <a-select-option
                value=""
              >
                -- 请选择 --
              </a-select-option>
              <a-select-option
                v-for="(item, index) in more.channelKvList"
                :key="index"
                :value="item.v"
              >
                {{ item.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="信息链接">
            <a-input
              placeholder="请输入信息链接"
              v-decorator="[
                'channelLink',
                {
                  initialValue: model.channelLink
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="客户">
            <span>{{ model.customerName }}</span>
            <a-input
              type="hidden"
              v-decorator="[
                'customerId',
                {
                  initialValue: model.customerId
                }
              ]"
            />
            <a-button type="link" icon="user-add" @click="$refs.customerListSelectorWindow.open()">选择客户</a-button>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="联系人">
            <a-select
              v-if="more.contactPersonKvList"
              show-search
              :filter-option="filterOption"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择联系人"
              v-decorator="[
                'contactPersonId',
                {
                  initialValue: model.contactPersonId ? `${model.contactPersonId}` : '',
                  rules: [{ required: true, message: '联系人不能为空', whitespace: true }]
                }
              ]"
            >
              <a-select-option
                value=""
              >
                -- 请选择 --
              </a-select-option>
              <a-select-option
                v-for="(item, index) in more.contactPersonKvList"
                :key="index"
                :value="`${item.v}`"
              >
                {{ item.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="销售员">
            <a-select
              v-if="more.iamUserKvList"
              show-search
              :filter-option="filterOption"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择销售员"
              v-decorator="[
                'salesId',
                {
                  initialValue: model.salesId ? `${model.salesId}` : ''
                }
              ]"
            >
              <a-select-option
                value=""
              >
                -- 请选择 --
              </a-select-option>
              <a-select-option
                v-for="(item, index) in more.iamUserKvList"
                :key="index"
                :value="`${item.v}`"
              >
                {{ item.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="线索状态">
            <a-select
              v-if="more.leadStatusKvList"
              show-search
              :filter-option="filterOption"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择"
              v-decorator="[
                'leadStatus',
                {
                  initialValue: model.leadStatus
                }
              ]"
            >
              <a-select-option
                value=""
              >
                -- 请选择 --
              </a-select-option>
              <a-select-option
                v-for="(item, index) in more.leadStatusKvList"
                :key="index"
                :value="item.v"
              >
                {{ item.k }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="截止期限">
            <a-date-picker
              valueFormat="YYYY-MM-DD"
              v-decorator="[
                'deadline',
                {
                  initialValue: model.deadline
                }
              ]"
              style="width: 100%;"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="提醒信息">
            <a-input
              placeholder="请输入提醒信息"
              v-decorator="[
                'reminder',
                {
                  initialValue: model.reminder
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
      <modal-window :width="1200" title="选择客户" ref="customerListSelectorWindow" @confirm="onConfirm">
        <customer-list-selector ref="customerListSelector" slot="content" @selectedRows="onSelectedRows" />
      </modal-window>
    </a-form>
    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import customerListSelector from '@/views/panel/customerListSelector'
import modalWindow from '@/components/diboot/components/popWindow/modalWindow'
export default {
  name: 'SalesLeadForm',
  components: {
    customerListSelector,
    modalWindow
  },
  mixins: [form],
  data () {
    return {
      baseApi: '/salesLead',
      form: this.$form.createForm(this),
      customerList: [],
      attachMoreList: [
        {
          type: 'D',
          target: 'CHANNEL'
        },
        {
          type: 'T',
          target: 'customer',
          key: 'short_name',
          value: 'id'
        },
        {
          type: 'T',
          target: 'contact_person',
          key: 'realname',
          value: 'id'
        },
        {
          type: 'T',
          target: 'iam_user',
          key: 'realname',
          value: 'id'
        },
        {
          type: 'D',
          target: 'LEAD_STATUS'
        }
      ]
    }
  },
  methods: {
    onConfirm () {
      // 确认弹窗事件处理代码
      if (this.customerList && this.customerList.length > 0) {
        const nowCustomer = this.customerList[0]
        this.form.setFieldsValue({
          customerId: nowCustomer.id
        })
        this.model.customerName = nowCustomer.shortName
        this.$refs.customerListSelectorWindow.close()
      } else {
        this.$message.error('请选择客户信息')
      }
    },
    onSelectedRows (selectedRows) {
      // 事件处理代码
      this.customerList = selectedRows
    }
  }
}
</script>
<style lang="less" scoped>
</style>
